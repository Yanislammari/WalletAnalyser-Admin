import { BACKEND_BASE_URL } from "../constants/env";
import { useAuth } from "../providers/AuthProvider";

export interface RequestPayload<T>{
  data : T,
  status : number
}

export abstract class BaseService {
  protected baseUrl: string;
  //private logout : () => void;

  constructor() {
    this.baseUrl = BACKEND_BASE_URL;
    //this.logout = useAuth().logout;
  }

  protected async request<T>(
    path: string,
    options: RequestInit,
    isFormData = false
  ): Promise<T> {
    let headers: HeadersInit = options.headers || {};

    if (!isFormData) {
      headers = {
        ...(options.headers as Record<string, string>),
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      };
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Request failed" }));
      if(res.status == ( 401 | 400 )){
        //this.logout
      }
      throw new Error(error.message || "Request failed");
    }

    return res.json() as Promise<T>; 
  }
}
