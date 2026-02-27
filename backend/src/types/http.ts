import { AuthenticatedUser } from "./express";

export interface AuthenticatedRequest extends Express.Request {
  user?: AuthenticatedUser;
}

