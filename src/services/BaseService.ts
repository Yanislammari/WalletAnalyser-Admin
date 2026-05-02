import { BACKEND_BASE_URL } from "../constants/env";

export interface RequestPayload<T>{
  data : T,
  status : number
}

export abstract class BaseService {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = BACKEND_BASE_URL;
  }

  protected async request<T>(
    path: string,
    options: RequestInit,
    isFormData = false
  ): Promise<T> {
    let headers: HeadersInit = {
      ...(options.headers as Record<string, string>),
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    };

  if (!isFormData) {
    headers = {
      ...headers,
      "Content-Type": "application/json",
    };
  }

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      if (res.status === 401 || res.status === 400) {
        window.dispatchEvent(new Event("auth:logout"));
        throw new Error(error.message || "Your session has expired. Please login again.");
      }
      throw new Error(error.message || "Request failed");
    }

    return res.json() as Promise<T>; 
  }


  protected async requestBlob(
    path: string,
    options: RequestInit,
    isFormData = false
  ){
    let headers: HeadersInit = options.headers || {};

    if (!isFormData) {
      headers = {
        ...(options.headers as Record<string, string>),
        Authorization: `Bearer ${localStorage.getItem("token")}`
      };
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      if (res.status === 401 || res.status === 400) {
        window.dispatchEvent(new Event("auth:logout"));
        throw new Error(error.message || "Your session has expired. Please login again.");
      }
      throw new Error(error.message || "Request failed");
    }

    return res.blob(); 
  }
}
