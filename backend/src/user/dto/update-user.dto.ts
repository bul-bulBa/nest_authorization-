import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString({message: 'name must be string'})
    @IsNotEmpty({message: 'name is required'})
    name: string

    @IsString({message: 'Email must be string'})
    @IsEmail({}, {message: 'incorrect email format'})
    @IsNotEmpty({ message: 'email is required'})
    email: string

    @IsBoolean({ message: 'IsTwoFactorEnabled must be boolean'})
    isTwoFactorEnabled: boolean
}