import type { Login2FAPayload, LoginPayload } from "../payloads/LoginPayload";
import type { AuthResponse } from "../responses/AuthResponse";
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

  public async login(payload: LoginPayload): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login_admin", {
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
}

export default AuthService;