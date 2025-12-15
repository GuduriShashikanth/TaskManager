import { findUserById, updateUserName, findAllUsers } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";

export const getProfile = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  return user;
};

export const updateProfile = async (userId: string, name: string) => {
  const user = await updateUserName(userId, name);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  return user;
};

export const getAllUsers = async () => {
  const users = await findAllUsers();
  return users;
};
