import { FetchError, RequiredEnvError } from "./errors";

export async function createPortainerApi() {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) throw RequiredEnvError(`BASE_URL`);
  const username = process.env.USERNAME;
  if (!username) throw RequiredEnvError(`USERNAME`);
  const password = process.env.PASSWORD;
  if (!password) throw RequiredEnvError(`PASSWORD`);

  const checkResponse = (response: Response, expectedStatus = 200) => {
    if (response.status !== expectedStatus) throw new FetchError(response);
  };

  const login = async (): Promise<PortainerLoginResponse> => {
    const res = await fetch(`${baseUrl}/auth`, {
      body: JSON.stringify({ username, password }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status !== 200) throw new FetchError(res);
    return await res.json<PortainerLoginResponse>();
  };

  const { jwt } = await login();
  const authHeaders = {
    Authorization: `Bearer ${jwt}`,
  };

  return {
    async listStacks(): Promise<PortainerStack[]> {
      const res = await fetch(`${baseUrl}/stacks`, {
        headers: authHeaders,
      });

      checkResponse(res);
      return await res.json<PortainerStack[]>();
    },

    async getStack(id: number): Promise<PortainerStack> {
      const res = await fetch(`${baseUrl}/stacks/${id}`, {
        headers: authHeaders,
      });

      checkResponse(res);
      return await res.json<PortainerStack>();
    },

    async getStackFile(id: number): Promise<PortainerStackFile> {
      const res = await fetch(`${baseUrl}/stacks/${id}/file`, {
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
      }
    ): Promise<void> {
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
