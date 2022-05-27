import { Request, Response } from "express";
import config from "../config/config";
import catchAsync from "../utils/catchAsync";
import pickSafeUserProperties from "../utils/pickSafeUserProperties";
import {
  userService,
  tokenService,
  emailService,
  authService,
} from "../services/index";
import httpStatus from "http-status";
import { User } from "@open-decision/models/prisma-client";
// import type { TRegisterOutput } from "../validations/register";
import validateRequest from "../validations/validateRequest";
import * as authValidation from "../validations/auth.validation";
import * as registerValidation from "../validations/register";

namespace Express {
  export interface Request {
    user: User;
  }
}

const register = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(registerValidation.register.input)(req);

  const user = await userService.createUser(
    reqData.body.email,
    reqData.body.password
  );

  // For now this is not necessary, we don't force the user to verify its email before the login is possible
  // if (
  //   config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS &&
  //   user.role == "USER"
  // ) {
  //   res.status(httpStatus.CREATED).send({ user: pickSafeUserProperties(user) });
  // }

  const { refresh, access } = await tokenService.generateAuthTokens(user);

  res.cookie("refreshCookie", refresh.token, {
    maxAge: config.JWT_REFRESH_EXPIRATION_DAYS * 86400 * 1000,
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });

  if (user) {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    emailService.sendVerificationEmail(user.email, verifyEmailToken);
  }

  res
    .status(httpStatus.CREATED)
    // .send({ user: pickSafeUserProperties(user), access } as TRegisterOutput);
    .send({ user: pickSafeUserProperties(user), access });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(authValidation.login)(req);

  const { email, password } = reqData.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  // For now this is not necessary, we don't force the user to verify its email before the login is possible

  // if (
  //   config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS &&
  //   user.emailIsVerified &&
  //   user.role == "USER"
  // ) {
  //   throw new ApiError({
  //     statusCode: httpStatus.UNAUTHORIZED,
  //     message: "Please confirm your email",
  //   });
  // }
  const { refresh, access } = await tokenService.generateAuthTokens(user);
  res.cookie("refreshCookie", refresh.token, {
    maxAge: config.JWT_REFRESH_EXPIRATION_DAYS * 86400 * 1000,
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });
  res.send({ user: pickSafeUserProperties(user), access });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  await validateRequest(authValidation.logout)(req);

  await authService.logout(res.locals.refreshCookie);
  res.clearCookie("refreshCookie", {
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(authValidation.refreshTokens)(req);

  const refreshedTokens = await authService.refreshAuth(
    reqData.cookies.refreshCookie
  );

  res.cookie("refreshCookie", refreshedTokens.refresh.token, {
    maxAge: config.JWT_REFRESH_EXPIRATION_DAYS * 86400 * 1000,
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });

  res.send({
    user: pickSafeUserProperties(refreshedTokens.user),
    access: refreshedTokens?.access,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(authValidation.forgotPassword)(req);

  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    reqData.body.email
  );
  emailService.sendResetPasswordEmail(res.locals.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(authValidation.resetPassword)(req);

  await authService.resetPassword(reqData.body.token, reqData.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(
  async (req: Express.Request, res: Response) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(
      req.user!
    );
    emailService.sendVerificationEmail(req.user!.email, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
  }
);

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const reqData = await validateRequest(authValidation.verifyEmail)(req);

  await authService.verifyEmail(reqData.body.token);
  res.status(httpStatus.NO_CONTENT).send();
});

export const authController = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
