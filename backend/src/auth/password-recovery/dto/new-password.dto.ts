import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class NewPasswordDto {

    @IsString({message: 'password must be string'})
    @MinLength(6, {message: 'min length 6 symbols'})
    @IsNotEmpty({message: 'password is required'})
    password: string
}