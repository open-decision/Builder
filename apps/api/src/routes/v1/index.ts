import express from "express";
import authRouter from "./auth.route";
import fileRouter from "./file.route";
import { userRouter, usersRouter } from "./user.route";
import docsRouter from "./docs.route";
import config from "../../config/config";
import treeRouter from "./tree.route";
import publishedTreeRouter from "./publishedTree.route";
import { authRoot, userRoot } from "@open-decision/api-specification";
const router = express.Router();

const defaultRoutes = [
  { path: authRoot, route: authRouter },
  { path: userRoot, route: userRouter },
  { path: "/users", route: usersRouter },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs/",
    route: docsRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.use(treeRouter);
router.use(fileRouter);
router.use(publishedTreeRouter);

/* istanbul ignore next */
if (config.NODE_ENV === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

// make the docs public even in production, if explicitly required
if (config.PUBLIC_API_DOCUMENTATION !== "false") {
  router.use("/docs/", docsRouter);
}

export default router;
