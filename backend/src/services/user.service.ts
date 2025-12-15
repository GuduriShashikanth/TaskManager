import { findUserById, updateUserName } from "../repositories/user.repository";

export const getProfile = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateProfile = async (userId: string, name: string) => {
  const user = await updateUserName(userId, name);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
