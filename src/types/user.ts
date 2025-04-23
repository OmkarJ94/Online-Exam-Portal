export interface User {
  sub: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [resource: string]: {
      roles: string[];
    };
  };
  exp?: number;
  iat?: number;
}
