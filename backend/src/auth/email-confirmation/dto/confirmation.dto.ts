import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmationDto {

    @IsString({message: 'token must be string'})
    @IsNotEmpty({message: 'field cannot be empty'})
    token: string
}