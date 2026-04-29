import type { ChangePasswordPayload, Login2FAPayload, LoginPayload, TokenBody } from "../payloads/LoginPayload";
import type { AuthResponse, FirstFaPayload } from "../responses/AuthResponse";
import type { UserResponse } from "../responses/UserResponse";
import { BaseService } from "./BaseService";

class AuthService extends BaseService {
  private static instance: AuthService;

  private constructor() {
    super();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(payload: LoginPayload): Promise<FirstFaPayload> {
    return this.request<FirstFaPayload>("/auth/login_admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async login2Fa(payload: Login2FAPayload): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login_admin_2FA", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async resend2Fa(payload: TokenBody): Promise<FirstFaPayload> {
    return this.request<FirstFaPayload>("/auth/resend_code_admin_2FA", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async authentificationCheck(payload: TokenBody): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/verify-token-admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async changePassword(payload: ChangePasswordPayload): Promise<void> {
    return this.request<void>("/auth/admin-change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } 
}

export default AuthService;