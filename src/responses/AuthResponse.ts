import type { UserResponse } from "./UserResponse";

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface FirstFaPayload {
  token: string;
}
