import { userSchema } from './schema';

export type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};

export type UserSchema = typeof userSchema;
