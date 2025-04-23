export interface LoginCredentials {
  email: string;
  password: string;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiRequestOptions<T = any> {
  method?: HttpMethod;
  body?: T;
  headers?: HeadersInit;
}

export interface RegisterUserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  institution?: string;
  role: "student" | "teacher";
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      verified?: boolean;
    };
  }

  interface User {
    verified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    verified?: boolean;
  }
}
