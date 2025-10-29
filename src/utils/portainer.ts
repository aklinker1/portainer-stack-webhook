import { InternalServerErrorHttpError } from "@aklinker1/zeta";
import { env } from "../env";
import { createTtlValue } from "./ttl-value";
import { bold, cyan } from "../colors";

export interface PortainerApi {
  listStacks: () => Promise<PortainerStack[]>;
  getStack: (id: number) => Promise<PortainerStack>;
  getStackFile: (id: number) => Promise<PortainerStackFile>;
  updateStack: (id: number, options: UpdateStackOptions) => Promise<void>;
}

export function createPortainerApi(): PortainerApi {
  const { apiUrl, username, password } = env.portainer;

  const checkResponse = async (response: Response, expectedStatus = 200) => {
    if (response.status !== expectedStatus)
      throw new PortainerApiError(
        expectedStatus,
        response,
        await response.text(),
      );
  };

  const jwt = createTtlValue<string>(60 * 60e3); // 1 hour (experimentally, it seems portainer JWTs last 8 hours)

  const login = async (): Promise<PortainerLoginResponse> => {
    console.log(`${cyan(bold("ℹ"))} Fetching new JWT for portainer...`);

    const res = await fetch(`${apiUrl}/auth`, {
      body: JSON.stringify({ username, password }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    await checkResponse(res);

    const json = (await res.json()) as PortainerLoginResponse;
    jwt.setValue(json.jwt);
    console.log(json);

    return json;
  };

  const getAuthHeaders = async () => {
    const value = jwt.getValue() || (await login().then((res) => res.jwt));
    return {
      Authorization: `Bearer ${value}`,
    };
  };

  const listStacks: PortainerApi["listStacks"] = async () => {
    const res = await fetch(`${apiUrl}/stacks`, {
      headers: await getAuthHeaders(),
    });

    await checkResponse(res);
    return (await res.json()) as any;
  };

  const getStack: PortainerApi["getStack"] = async (id) => {
    const res = await fetch(`${apiUrl}/stacks/${id}`, {
      headers: await getAuthHeaders(),
    });

    await checkResponse(res);
    return (await res.json()) as any;
  };

  const getStackFile: PortainerApi["getStackFile"] = async (id) => {
    const res = await fetch(`${apiUrl}/stacks/${id}/file`, {
      headers: await getAuthHeaders(),
    });

    await checkResponse(res);
    return (await res.json()) as any;
  };

  const updateStack: PortainerApi["updateStack"] = async (
    id,
    options,
  ): Promise<void> => {
    const updateUrl = new URL(`${apiUrl}/stacks/${id}`);
    updateUrl.searchParams.set("endpointId", String(options.endpointId));

    const res = await fetch(updateUrl.href, {
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

    await checkResponse(res);
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
    options?: ErrorOptions,
  ) {
    super(
      `Request to Portainer API failed. Expected status ${expectedStatus}, received ${response.status}`,
      { response, text },
      options,
    );
  }
}
