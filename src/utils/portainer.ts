import { InternalServerErrorHttpError } from "@aklinker1/zeta";
import { env } from "../env";
import { createTtlValue } from "./ttl-value";
import { logger } from "./logger";

export interface PortainerApi {
  listStacks: () => Promise<PortainerStack[]>;
  getStack: (id: number) => Promise<PortainerStack>;
  getStackFile: (id: number) => Promise<PortainerStackFile>;
  updateStack: (id: number, options: UpdateStackOptions) => Promise<void>;
}

export function createPortainerApi(): PortainerApi {
  const { apiUrl, accessToken, username, password } = env.portainer;

  const fetchPortainer = async (url: string, init?: RequestInit) => {
    try {
      return await fetch(url, init);
    } catch (err) {
      logger.error("portainer.fetch_failed", {
        url,
        method: init?.method ?? "GET",
        error: String(err),
      });
      throw new InternalServerErrorHttpError(
        `Unable to connect to Portainer at ${url}`,
        { cause: err },
      );
    }
  };

  const checkResponse = async (
    response: Response,
    expectedStatus = 200,
    url?: string,
  ) => {
    if (response.status !== expectedStatus)
      throw new PortainerApiError(
        expectedStatus,
        response,
        await response.text(),
        url,
      );
  };

  const jwt = createTtlValue<string>(60 * 60e3); // 1 hour (experimentally, it seems portainer JWTs last 8 hours)

  const login = async (): Promise<PortainerLoginResponse> => {
    if (!username || !password) {
      throw new InternalServerErrorHttpError(
        "Portainer username/password are not configured",
      );
    }

    logger.info("portainer.jwt.fetch", {
      message: "Fetching new JWT for portainer...",
    });

    const url = `${apiUrl}/auth`;
    const res = await fetchPortainer(url, {
      body: JSON.stringify({ username, password }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await checkResponse(res, 200, url);

    const json = (await res.json()) as PortainerLoginResponse;
    jwt.setValue(json.jwt);

    return json;
  };

  const getToken = async (): Promise<string> => {
    if (accessToken) return accessToken;

    const value = jwt.getValue();
    if (value) return value;

    const { jwt: freshJwt } = await login();
    return freshJwt;
  };

  const getAuthHeaders = async () => ({
    ...(accessToken?.startsWith("ptr_")
      ? { "X-API-Key": accessToken }
      : { Authorization: `Bearer ${await getToken()}` }),
  });

  const listStacks: PortainerApi["listStacks"] = async () => {
    const url = `${apiUrl}/stacks`;
    const res = await fetchPortainer(url, {
      headers: await getAuthHeaders(),
    });

    await checkResponse(res, 200, url);
    return (await res.json()) as any;
  };

  const getStack: PortainerApi["getStack"] = async (id) => {
    const url = `${apiUrl}/stacks/${id}`;
    const res = await fetchPortainer(url, {
      headers: await getAuthHeaders(),
    });

    await checkResponse(res, 200, url);
    return (await res.json()) as any;
  };

  const getStackFile: PortainerApi["getStackFile"] = async (id) => {
    const url = `${apiUrl}/stacks/${id}/file`;
    const res = await fetchPortainer(url, {
      headers: await getAuthHeaders(),
    });

    await checkResponse(res, 200, url);
    return (await res.json()) as any;
  };

  const updateStack: PortainerApi["updateStack"] = async (
    id,
    options,
  ): Promise<void> => {
    const updateUrl = new URL(`${apiUrl}/stacks/${id}`);
    updateUrl.searchParams.set("endpointId", String(options.endpointId));

    const res = await fetchPortainer(updateUrl.href, {
      method: "PUT",
      body: JSON.stringify({
        prune: options.prune,
        pullImage: options.pullImage,
        stackFileContent: options.stackFileContent,
      }),
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
    });

    await checkResponse(res, 200, updateUrl.href);
  };

  return {
    listStacks,
    getStack,
    getStackFile,
    updateStack,
  };
}

export type UpdateStackOptions = {
  endpointId: number;
  prune: boolean;
  pullImage: boolean;
  stackFileContent: string;
};

export interface PortainerLoginResponse {
  jwt: string;
}

export interface PortainerStack {
  Id: number;
  Name: string;
  EndpointId: number;
}

export interface PortainerStackFile {
  StackFileContent: string;
}

export class PortainerApiError extends InternalServerErrorHttpError {
  constructor(
    expectedStatus: number,
    response: Response,
    readonly text: string,
    readonly url?: string,
    options?: ErrorOptions,
  ) {
    super(
      `Request to Portainer API failed. Expected status ${expectedStatus}, received ${response.status}` +
        (url ? ` for ${url}` : ""),
      { response, text, url },
      options,
    );
  }
}
