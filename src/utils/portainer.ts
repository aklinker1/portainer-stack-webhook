import { InternalServerErrorHttpError } from "@aklinker1/zeta";
import { env } from "../env";

export async function createPortainerApi() {
  const { BASE_URL, USERNAME, PASSWORD } = env;

  const checkResponse = (response: Response, expectedStatus = 200) => {
    if (response.status !== expectedStatus)
      throw new PortainerApiError(response);
  };

  const login = async (): Promise<PortainerLoginResponse> => {
    const res = await fetch(`${BASE_URL}/auth`, {
      body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status !== 200) throw new PortainerApiError(res);
    return await res.json<PortainerLoginResponse>();
  };

  const { jwt } = await login();
  const authHeaders = {
    Authorization: `Bearer ${jwt}`,
  };

  return {
    async listStacks(): Promise<PortainerStack[]> {
      const res = await fetch(`${BASE_URL}/stacks`, {
        headers: authHeaders,
      });

      checkResponse(res);
      return await res.json<PortainerStack[]>();
    },

    async getStack(id: number): Promise<PortainerStack> {
      const res = await fetch(`${BASE_URL}/stacks/${id}`, {
        headers: authHeaders,
      });

      checkResponse(res);
      return await res.json<PortainerStack>();
    },

    async getStackFile(id: number): Promise<PortainerStackFile> {
      const res = await fetch(`${BASE_URL}/stacks/${id}/file`, {
        headers: authHeaders,
      });

      checkResponse(res);
      return await res.json<PortainerStackFile>();
    },

    async updateStack(
      id: number,
      options: {
        endpointId: number;
        prune: boolean;
        pullImage: boolean;
        stackFileContent: string;
      },
    ): Promise<void> {
      const updateUrl = new URL(`${BASE_URL}/stacks/${id}`);
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
    },
  };
}

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

export type PortainerApi = Awaited<ReturnType<typeof createPortainerApi>>;

export class PortainerApiError extends InternalServerErrorHttpError {
  constructor(response: Response, options?: ErrorOptions) {
    super("Request to Portainer API failed", { response }, options);
  }
}
