import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { getProfile, updateProfile } from "../services/user.service";

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getProfile(req.userId!);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const user = await updateProfile(req.userId!, name);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
