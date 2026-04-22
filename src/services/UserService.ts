import type { BanUserPayload } from "../payloads/UserPayload";
import type { UserResponse, UsersWithDataResponseDto } from "../responses/UserResponse";
import { BaseService } from "./BaseService";

class UserService extends BaseService {
  private static instance: UserService;
  private readonly base_url_user = "/admin/users/"

  private constructor() {
    super();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getUsersIntro(): Promise<UsersWithDataResponseDto> {
    return this.request<UsersWithDataResponseDto>(this.base_url_user + 'intro', {
      method: "GET",
    });
  }

  public async getUsersIntroOffset(offset: number): Promise<UserResponse[]> {
    return this.request<UserResponse[]>(this.base_url_user + `?offset=${offset}`, {
      method: "GET",
    });
  }

  public async banUser(payload: BanUserPayload, userId : string): Promise<UserResponse> {
    return this.request<UserResponse>(this.base_url_user + userId, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }
}

export default UserService;