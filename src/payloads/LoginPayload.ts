export interface LoginPayload {
  email: string;
  password: string;
}

export interface Login2FAPayload {
  code : string
  token : string
}

export interface Resend2FaPayload {
  token : string
}