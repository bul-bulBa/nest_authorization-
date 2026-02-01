import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
    @IsEmail({}, { message: 'Enter correct email address' })
    @IsNotEmpty({ message: 'email is required' })
    email: string
}