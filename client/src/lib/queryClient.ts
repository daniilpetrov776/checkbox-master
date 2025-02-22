import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// export async function apiRequest(
//   method: string,
//   url: string,
//   data?: unknown | undefined,
// ): Promise<Response> {
//   const res = await fetch(url, {
//     method,
//     headers: data ? { "Content-Type": "application/json" } : {},
//     body: data ? JSON.stringify(data) : undefined,
//     credentials: "include",
//   });

//   await throwIfResNotOk(res);
//   return res;
// }

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: {
      // Всегда добавляем заголовок для ngrok
      "ngrok-skip-browser-warning": "true",
      // Добавляем Content-Type только если есть data
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
// export const getQueryFn: <T>(options: {
//   on401: UnauthorizedBehavior;
// }) => QueryFunction<T> =
//   ({ on401: unauthorizedBehavior }) =>
//   async ({ queryKey }) => {
//     const res = await fetch(queryKey[0] as string, {
//       credentials: "include",
//     });

//     if (unauthorizedBehavior === "returnNull" && res.status === 401) {
//       return null;
//     }

//     await throwIfResNotOk(res);
//     return await res.json();
//   };

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const res = await fetch(url, {
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true", // Добавляем заголовок напрямую в fetch
      },
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       queryFn: async ({ queryKey }) => {
//         const [url] = queryKey;
//         const response = await apiRequest('GET', url);
//         return response.json(); // Или как вы обрабатываете данные
//       },
//     },
//   },
// });