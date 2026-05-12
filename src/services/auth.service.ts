import User, { IUser } from "../models/user.model";
import { LoginDTO, RegisterDTO } from "../dto/register.dto";
import { createError } from "../utils/createError";
import { comparePassword, hashPassword } from "../utils/hash.util";
import { generateToken } from "../utils/jwt.util";

export const registerUserService = async (
  payload: RegisterDTO,
): Promise<Partial<IUser>> => {
  const { first_name, last_name, username, email, password, phone } = payload;

  if (!first_name || !last_name || !username || !email || !password) {
    throw createError("All required fields are mandatory", 400);
  }

  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    throw createError("Email Already Exists", 409);
  }

  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    throw createError("Username Already Exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    first_name,
    last_name,
    username,
    email,
    password: hashedPassword,
    phone,
  });

  const userObject = user.toObject();
  const { password: _, ...userWithoutPassword } = userObject;
  return userWithoutPassword;
};

export const loginUserService = async (payload: LoginDTO) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw createError("Email and password are required", 400);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw createError("Invalid credentials", 401);
  }
  const isPasswordMatched = await comparePassword(password, user.password);

  if (!isPasswordMatched) {
    throw createError("Invalid credentials", 401);
  }
  const token = generateToken({ userId: user._id.toString() });

  const userObject = user.toObject();
  const { password: _, ...userWithoutPassword } = userObject;

  return {
    user: userWithoutPassword,
    token,
  };
};
