import type { UserType } from "../enums/UserType";

export interface UserDto {
  user : UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  googleId: string | null;
  googlePictureUrl: string | null;
  ban: boolean;
  userType: UserType;
  subscribe : boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersWithDataResponseDto {
  numberOfUsers : number,
  numberOfBanUsers : number,
  numberOfNewMonthlyUsers : number,
  numberOfPaidUsers : number,
  users : UserResponse[]
}
