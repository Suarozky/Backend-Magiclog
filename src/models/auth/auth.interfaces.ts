import { type } from "os";

type jwtPayload = {
  id: string;
  email: string;
  sub: string;
  iat?: number;
  exp?: number;
}

export type { jwtPayload };
