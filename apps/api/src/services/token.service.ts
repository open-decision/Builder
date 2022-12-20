import * as jose from "jose";
import dayjs from "dayjs";
import config from "../config/config";
import { userService } from "./index";
import { tokenHandler } from "../models/token.model";
import { UUID } from "../types/uuid-class";
import { TokenType, User } from "@prisma/client";
import { APIError } from "@open-decision/type-classes";
/**
 * Generate token
 * @param {(UUID|string)} userId
 * @param {dayjs.Dayjs} expiry
 * @param {TokenType} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = async (
  userUuid: UUID | string,
  expiry: dayjs.Dayjs,
  type: TokenType,
  secret: string
) => {
  return await new jose.SignJWT({
    userUuid: userUuid instanceof UUID ? userUuid.toString() : userUuid,
    type,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expiry.unix())
    .setIssuedAt(dayjs().unix())
    .sign(new TextEncoder().encode(secret));
};

/**
 * Save a token
 * @param {string} token
 * @param {(UUID|string)} userUuid
 * @param {dayjs.Dayjs} expires
 * @param {TokenType} type
 * @param {boolean} [blacklisted=false]
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: string,
  userUuid: UUID | string,
  expiry: dayjs.Dayjs,
  type: TokenType,
  blacklisted = false
) => {
  const storedToken = tokenHandler.storeInDb(
    token,
    userUuid,
    expiry,
    type,
    blacklisted
  );
  return storedToken;
};

/**
 * Verify token (except for access token) and return token entry (or throw an error if it is not valid)
 * @param {string} token
 * @param {TokenType} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: TokenType) => {
  const secret =
    type === TokenType.REFRESH
      ? config.REFRESH_TOKEN_SECRET
      : config.ACCESS_TOKEN_SECRET;

  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(secret)
  );

  const tokenFromDatabase = await tokenHandler.findOne({
    token,
    ownerUuid: payload.userUuid as string,
    blacklisted: false,
    type,
  });

  if (!tokenFromDatabase) {
    throw new Error("Token not found");
  } else {
    return tokenFromDatabase;
  }
};

/**
 * Issue new access & refresh tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshTokens = async (refreshToken: string) => {
  const refreshTokenFromDb = await verifyToken(refreshToken, TokenType.REFRESH);

  const user = await userService.getUserByUuidOrId(
    refreshTokenFromDb.ownerUuid
  );
  if (!user) {
    throw new Error();
  }

  //Delete old refresh token
  await tokenHandler.deleteFromDbById(refreshTokenFromDb.id);
  // Issue new access and refresh token
  const newTokens = await generateAuthTokens(user);

  return {
    user: user,
    ...newTokens,
  };
};

/**
 * Generate access token
 * @param {string} userUuid
 * @param {boolean} [isDevAccount=false]
 * @returns {Object}
 */
const generateAccessToken = async (userUuid: string, isDevAccount = false) => {
  const accessTokenExpires = dayjs().add(
    // Dev accounts get an access token that is valid for one year
    !isDevAccount ? config.JWT_ACCESS_EXPIRATION_MINUTES : 60 * 24 * 365,
    "minutes"
  );

  const accessToken = await generateToken(
    userUuid,
    accessTokenExpires,
    TokenType.ACCESS,
    config.ACCESS_TOKEN_SECRET
  );
  return {
    token: accessToken,
    expires: accessTokenExpires.toString(),
  };
};

/**
 * Generate refresh token
 * @param {string} userUuid
 * @returns {Promise<Object>}
 */
const generateRefreshToken = async (userUuid: string) => {
  const refreshTokenExpires = dayjs().add(
    config.JWT_REFRESH_EXPIRATION_DAYS,
    "days"
  );

  const refreshToken = await generateToken(
    userUuid,
    refreshTokenExpires,
    TokenType.REFRESH,
    config.REFRESH_TOKEN_SECRET
  );
  await saveToken(
    refreshToken,
    userUuid,
    refreshTokenExpires,
    TokenType.REFRESH
  );

  return {
    token: refreshToken,
    expires: refreshTokenExpires.toString(),
  };
};

/**
 * Generate both auth token
 * @param {User} user
 * @param {boolean} [isLogin=true]
 * @returns {Promise<string>}
 */
const generateAuthTokens = async (user: User) => {
  return {
    access: await generateAccessToken(
      user.uuid,
      user.role === "DEVELOPER" ? true : false
    ),
    refresh: await generateRefreshToken(user.uuid),
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new APIError({
      code: "USER_NOT_FOUND",
      message: "No users found with this email",
    });
  }
  const expires = dayjs().add(
    config.RESET_PASSWORD_EXPIRATION_MINUTES,
    "minutes"
  );

  const resetPasswordToken = await generateToken(
    user.uuid,
    expires,
    TokenType.RESET_PASSWORD,
    config.ACCESS_TOKEN_SECRET
  );
  await saveToken(
    resetPasswordToken,
    user.uuid,
    expires,
    TokenType.RESET_PASSWORD,
    false
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {string} userUuid
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (userUuid: string) => {
  const expires = dayjs().add(
    config.VERIFY_EMAIL_EXPIRATION_MINUTES,
    "minutes"
  );
  const verifyEmailToken = await generateToken(
    userUuid,
    expires,
    TokenType.VERIFY_EMAIL,
    config.ACCESS_TOKEN_SECRET
  );
  await saveToken(verifyEmailToken, userUuid, expires, TokenType.VERIFY_EMAIL);
  return verifyEmailToken;
};

export const tokenService = {
  generateToken,
  verifyToken,
  saveToken,
  refreshTokens,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  generateAccessToken,
  generateRefreshToken,
};
