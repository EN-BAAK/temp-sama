import { User } from "../modules/users";
import ErrorHandler from "../middlewares/error";
import { ID } from "../types/variables";
import { comparePassword, generateVerificationCode, hashPassword } from "../utils/encrypt";
import { generateTokens } from "../utils/jwt";
import { findUserById } from "../strategies/users";
import { Person } from "../modules/persons";
import { PasswordReset } from "../modules/passwordReset";
import { resetEmailMessage, sendEmail } from "../utils/mails";

export const logout = async (id: ID) => {
  await findUserById({ id })
};

export const verifyUser = async (id: ID) => {
  await findUserById({ id }) as any
  return;
};

export const changePassword = async (id: ID, password: '', newPassword: '') => {
  const user = await User.scope("withPassword").findByPk(id);;

  if(!user)
    throw new ErrorHandler("Internal Server Error", 500)

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new ErrorHandler("Current password is incorrect", 401);

  const hashedPassword = await hashPassword(newPassword)
  user.password = hashedPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

export const login = async (email: string, password: '') => {
  const user = await User.scope("withPassword").findOne({
    include: [
      {
        model: Person,
        as: "person",
        where: { email },
        attributes: ["email"]
      }
    ]
  });

  if (!user) throw new ErrorHandler("Invalid email or password", 401);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new ErrorHandler("Invalid email or password", 401);

  const { accessToken: token } = generateTokens(user.personId)
  return { user: user.toJSON(), token };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({
    include: [
      {
        model: Person,
        as: "person",
        where: { email },
        attributes: ["email"]
      }
    ]
  }) as any

  if (!user) throw new ErrorHandler("User not found", 404);

  await PasswordReset.destroy({ where: { userId: user.personId } });

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await PasswordReset.create({
    userId: user.personId,
    code,
    expiresAt,
  });

  const htmlMessage = resetEmailMessage(code);
  await sendEmail(user.person.email, "Sama bludan - Password Reset Request", htmlMessage);

  return { message: "Reset code sent to email" };
};

export const resetForgottenPassword = async (code: string, newPassword: '') => {
  const reset = await PasswordReset.findOne({ where: { code, isVerified: false } });
  if (!reset || reset.expiresAt < new Date()) {
    throw new ErrorHandler("Invalid or expired code", 400);
  }

  const user = await User.findByPk(reset.userId);
  if (!user) throw new ErrorHandler("User not found", 404);

  const hashedPassword = await hashPassword(newPassword)
  user.password = hashedPassword;
  await user.save();

  await reset.destroy();

  return { message: "Password successfully reset" };
};