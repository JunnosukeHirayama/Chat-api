export class CreateUserDto {
    email: string;
    password: string;
    name?: string; // ? はあってもなくても良いという意味
  }