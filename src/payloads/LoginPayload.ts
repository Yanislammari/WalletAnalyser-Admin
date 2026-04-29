export interface LoginPayload {
  email: string;
  password: string;
}

export interface Login2FAPayload {
  code : string
  token : string
}

export interface TokenBody {
  token : string
}

export interface ChangePasswordPayload {
  password: string;
  newPassword: string;
}