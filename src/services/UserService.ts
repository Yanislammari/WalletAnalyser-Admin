import type { AddSuperUserPayload, BanUserPayload } from "../payloads/UserPayload";
import type { UserDto, UserResponse, UsersWithDataResponseDto, UsersWithLength } from "../responses/UserResponse";
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

  public async getUsersIntroOffset(offset: number, limit : number, search : string): Promise<UsersWithLength> {
    return this.request<UsersWithLength>(this.base_url_user + `?offset=${offset}&limit=${limit}&search=${search}`, {
      method: "GET",
    });
  }

  public async banUser(payload: BanUserPayload, userId : string): Promise<UserResponse> {
    return this.request<UserResponse>(this.base_url_user + userId, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async addSuperUser(payload: AddSuperUserPayload): Promise<UserDto> {
    return this.request<UserDto>(this.base_url_user + "register_super_user", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export default UserService;