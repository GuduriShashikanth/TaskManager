import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../repositories/user.repository";
import { RegisterInput, LoginInput } from "../dtos/auth.dto";
import { ApiError } from "../utils/ApiError";
import { config } from "../config";

const SALT_ROUNDS = 12;

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw ApiError.conflict("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });

  return { user, token };
};

export const loginUser = async (data: LoginInput) => {
  const user = await findUserByEmail(data.email);
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });

  return { token, user };
};
