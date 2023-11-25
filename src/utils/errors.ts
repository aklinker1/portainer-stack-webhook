export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
  }

  get jsonStack() {
    return (
      this.stack
        ?.split("\n")
        .map((line) => line.trim())
        .slice(1) ?? []
    );
  }

  get body() {
    return JSON.stringify({
      message: this.message,
      ...this.details,
      stack: this.jsonStack,
    });
  }

  toResponse() {
    return new Response(this.body, {
      status: this.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export class FetchError extends Error {
  constructor(private readonly response: Response) {
    super("Failed to fetch: " + response.statusText);
  }

  toResponse() {
    return this.response;
  }
}

export function RequiredEnvError(key: string) {
  return new ApiError(500, `Required environment variable missing: ${key}`);
}
