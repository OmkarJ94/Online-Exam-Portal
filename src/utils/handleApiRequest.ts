import { ApiResponse } from "@/types/shared";

export async function handleApiFetch<TResponse = any, TRequest = any>(
  url: string,
  options: {
    method?: string;
    body?: TRequest;
    headers?: HeadersInit;
  } = {}
): Promise<Response> {
  const { method = "GET", body, headers } = options;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
    method,
    credentials: "include",
    headers: isFormData
      ? headers
      : {
          "Content-Type": "application/json",
          ...headers,
        },
    ...(body && {
      body: isFormData ? body : JSON.stringify(body),
    }),
  });

  return response;
}

export async function handleApiResponse<T = any>(
  response: Response
): Promise<ApiResponse<T>> {
  const status = response.status;
  let data: any = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || status === 401 || status === 403) {
    return {
      error: data?.error_description || data?.error || "Something went wrong",
      status,
      success: false,
    };
  }

  return {
    data,
    status,
    success: true,
  };
}
