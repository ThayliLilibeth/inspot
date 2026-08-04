import { IsEmail, IsOptional, IsString } from "class-validator";

export class SyncUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}
