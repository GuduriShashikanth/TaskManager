import { User, IUser } from "../models/User.model";

export const findUserByEmail = (email: string) => {
  return User.findOne({ email });
};

export const createUser = (data: Partial<IUser>) => {
  return User.create(data);
};
