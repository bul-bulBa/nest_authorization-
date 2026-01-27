import { IsEmail, IsNotEmpty, IsString, MinLength, Validate} from 'class-validator'

export class LoginDto {
    @IsString({message: 'email must be string'})
    @IsEmail({}, {message: 'incorrect email format'})
    @IsNotEmpty({message: 'email is required'})
    email: string

    @IsString({message: 'password must be string'})
    @IsNotEmpty({message: 'password is required'})
    @MinLength(6, {message: 'password must be at least 6 characters long'})
    password: string
}