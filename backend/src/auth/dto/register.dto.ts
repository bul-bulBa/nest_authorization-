import { IsEmail, IsNotEmpty, IsString, MinLength, Validate} from 'class-validator'
import { IsPasswordsMatchingConstraint } from '@/libs/common/decorators/is-passwords-matching-constraint.decorator'

export class RegisterDto {
    @IsString({message: 'name must be string'})
    @IsNotEmpty({message: 'name is required'})
    name: string

    @IsString({message: 'email must be string'})
    @IsEmail({}, {message: 'incorrect email format'})
    @IsNotEmpty({message: 'email is required'})
    email: string

    @IsString({message: 'password must be string'})
    @IsNotEmpty({message: 'password is required'})
    @MinLength(6, {message: 'password must be at least 6 characters long'})
    password: string

    @IsString({message: 'password repeat must be string'})
    @IsNotEmpty({message: 'password repeat is required'})
    @MinLength(6, {message: 'password repeat must be at least 6 characters long'})
    @Validate(IsPasswordsMatchingConstraint, {
        message: 'password do not match'
    })
    passwordRepeat: string
}