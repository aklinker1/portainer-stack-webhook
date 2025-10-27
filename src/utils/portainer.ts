import { InternalServerErrorHttpError } from "@aklinker1/zeta";
import { env } from "../env";

export interface PortainerApi {
  listStacks: () => Promise<PortainerStack[]>;
  getStack: (id: number) => Promise<PortainerStack>;
  getStackFile: (id: number) => Promise<PortainerStackFile>;
  updateStack: (id: number, options: UpdateStackOptions) => Promise<void>;
}

export async function createPortainerApi(): Promise<PortainerApi> {
  const { baseUrl, username, password } = env.portainer;

  const checkResponse = (response: Response, expectedStatus = 200) => {
    if (response.status !== expectedStatus)
      throw new PortainerApiError(response);
  };

  const login = async (): Promise<PortainerLoginResponse> => {
    const res = await fetch(`${baseUrl}/auth`, {
      body: JSON.stringify({ username, password }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status !== 200) throw new PortainerApiError(res);
    return (await res.json()) as any;
  };

  const { jwt } = await login();
  const authHeaders = {
    Authorization: `Bearer ${jwt}`,
  };

  const listStacks: PortainerApi["listStacks"] = async () => {
    const res = await fetch(`${baseUrl}/stacks`, {
      headers: authHeaders,
    });

    checkResponse(res);
    return (await res.json()) as any;
  };

  const getStack: PortainerApi["getStack"] = async (id) => {
    const res = await fetch(`${baseUrl}/stacks/${id}`, {
      headers: authHeaders,
    });

    checkResponse(res);
    return (await res.json()) as any;
  };

  const getStackFile: PortainerApi["getStackFile"] = async (id) => {
    const res = await fetch(`${baseUrl}/stacks/${id}/file`, {
      headers: authHeaders,
    });

    checkResponse(res);
    return (await res.json()) as any;
  };

  const updateStack: PortainerApi["updateStack"] = async (
    id,
    options,
  ): Promise<void> => {
    const updateUrl = new URL(`${baseUrl}/stacks/${id}`);
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
        ...authHeaders,
      },
    });

    checkResponse(res);
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
  constructor(response: Response, options?: ErrorOptions) {
    super("Request to Portainer API failed", { response }, options);
  }
}
