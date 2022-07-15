import { client } from "@open-decision/api-client";
import { TLoginOutput } from "@open-decision/auth-api-specification";
import { APIError, ODError } from "@open-decision/type-classes";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export const authCookieConfig = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
} as const;

export const deleteCookies = (res: NextApiResponse) => {
  res.setHeader("Set-Cookie", [
    serialize("refreshToken", "removed", {
      ...authCookieConfig,
      maxAge: -1,
    }),
    serialize("token", "removed", {
      ...authCookieConfig,
      maxAge: -1,
    }),
  ]);
};

export const setCookieHeaders = (
  res: NextApiResponse,
  loginResponse: TLoginOutput
) => {
  res.setHeader("Set-Cookie", [
    serialize("refreshToken", loginResponse.access.refreshToken.token, {
      ...authCookieConfig,
      maxAge:
        Number(process.env.JWT_REFRESH_EXPIRATION_DAYS ?? 7) * 86400 * 1000,
    }),
    serialize("token", loginResponse.access.token.token, {
      ...authCookieConfig,
      maxAge: Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES ?? 15) * 60,
    }),
  ]);
};

export const refreshAuth = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = req.cookies["token"];
  const refreshToken = req.cookies["refreshToken"];

  const OD = client({ urlPrefix: `${process.env.OD_API_ENDPOINT}/v1` });

  // When the token is still valid we don't need to refresh it and just return it
  if (token) {
    return token;
  }

  // When there is a valid refreshToken we can use it to refresh the token
  if (refreshToken) {
    const { data: authData, response: authResponse } =
      await OD.auth.refreshToken({ body: { refreshToken } });

    if (authData instanceof ODError) throw authResponse;

    setCookieHeaders(res, authData);

    return authData.access.token.token;
  }

  throw new APIError({
    code: "UNAUTHENTICATED",
    message: "The user is not authenticated",
  });
};
