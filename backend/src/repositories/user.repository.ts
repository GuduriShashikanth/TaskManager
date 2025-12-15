import { User, IUser } from "../models/User.model";
import { Types } from "mongoose";

export const findUserByEmail = (email: string) => {
  return User.findOne({ email });
};

export const createUser = (data: Partial<IUser>) => {
  return User.create(data);
};

export const findUserById = (id: string) => {
  return User.findById(new Types.ObjectId(id)).select("-password");
};

export const updateUserName = (id: string, name: string) => {
  return User.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  ).select("-password");
};
