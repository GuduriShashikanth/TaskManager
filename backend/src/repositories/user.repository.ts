import { User, IUser } from "../models/User.model";
import { Types } from "mongoose";

export const findUserByEmail = (email: string) => {
  return User.findOne({ email });
};

export const createUser = (data: Partial<IUser>) => {
  return User.create(data);
};

export const findUserById = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return User.findById(new Types.ObjectId(id)).select("-password");
};

export const updateUserName = (id: string, name: string) => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return User.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true }
  ).select("-password");
};

export const findAllUsers = () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};
