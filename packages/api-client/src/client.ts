import { TContext, TJWT } from "@open-decision/api-helpers";
import {
  deletePublishedTree,
  getPublishedTree,
  getPublishedTrees,
} from "@open-decision/tree-api-specification";
import {
  createPublishedTreeOfTree,
  createTree,
  deleteTree,
  getPublishedTreesOfTree,
  getTree,
  getTrees,
  updateTree,
} from "@open-decision/tree-api-specification";
import {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
} from "@open-decision/auth-api-specification";
import { Required } from "utility-types";

export type TClientConfig = { token?: TJWT; urlPrefix?: string };

const createContext = ({ token, ...config }: TClientConfig): TContext => ({
  headers: token ? { authorization: `Bearer ${token}` } : undefined,
  ...config,
});

export const createUnauthenticatedClient = (config: TClientConfig) => {
  const context = createContext(config);

  return {
    auth: {
      login: login(context),
      register: register(context),
      refreshToken: refreshToken(context),
      resetPassword: resetPassword(context),
      forgotPassword: forgotPassword(context),
      verifyEmail: verifyEmail(context),
    },
    publishedTrees: {
      getCollection: getPublishedTrees(context),
      getSingle: getPublishedTree(context),
    },
  };
};

const authenticatedClient = (config: Required<TClientConfig, "token">) => {
  const context = createContext(config);
  const unauthenticatedClient = createUnauthenticatedClient(context);

  return {
    auth: {
      ...unauthenticatedClient.auth,
      logout: logout(context),
    },
    trees: {
      getSingle: getTree(context),
      getCollection: getTrees(context),
      create: createTree(context),
      delete: deleteTree(context),
      update: updateTree(context),
      publishedTrees: {
        get: getPublishedTreesOfTree(context),
        create: createPublishedTreeOfTree(context),
      },
    },
    publishedTrees: {
      ...unauthenticatedClient.publishedTrees,
      delete: deletePublishedTree(context),
    },
  };
};

export type TUnauthenticatedClient = ReturnType<
  typeof createUnauthenticatedClient
>;
export type TAuthenticatedClient = ReturnType<typeof authenticatedClient>;

export const client = ({
  token,
  ...context
}: TClientConfig): TUnauthenticatedClient | TAuthenticatedClient => {
  if (token) {
    const client = authenticatedClient({ token, ...context });
    return client;
  }

  const client = createUnauthenticatedClient(context);
  return client;
};

export type TClient = TUnauthenticatedClient | TAuthenticatedClient;