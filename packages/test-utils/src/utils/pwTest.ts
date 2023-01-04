import { test as base } from "@playwright/test";
import { DashboardPage, createDashboardPage } from "./pageModels/DashboardPage";
import { createEditorPage, EditorPage } from "./pageModels/EditorPage";
import { ForgotPasswordPage } from "./pageModels/ForgotPasswordPage";
import { LoginPage } from "./pageModels/LoginPage";
import { RegisterPage } from "./pageModels/RegisterPage";
import { createPrototypePage, PrototypePage } from "./pageModels/PrototypePage";
import { createPublishedPage, PublishedPage } from "./pageModels/PublishedPage";

type Fixtures = {
  dashboardPage: DashboardPage;
  registerPage: RegisterPage;
  loginPage: LoginPage;
  forgotPasswordPage: ForgotPasswordPage;
  editorPage: EditorPage;
  prototypePage: PrototypePage;
  publishedPage: PublishedPage;
  _autoSnapshotSuffix: void;
};

export const pwTest = base.extend<Fixtures>({
  _autoSnapshotSuffix: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, testInfo) => {
      testInfo.snapshotSuffix = "";
      await use();
    },
    { auto: true },
  ],
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = await createDashboardPage(page);
    await dashboardPage.goto();

    await use(dashboardPage);

    await dashboardPage.cleanup();
  },
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await use(registerPage);

    await registerPage.cleanup();
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await use(loginPage);

    await loginPage.cleanup();
  },
  forgotPasswordPage: async ({ page }, use) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();

    await use(forgotPasswordPage);

    await forgotPasswordPage.cleanup();
  },
  editorPage: async ({ page }, use) => {
    const nodeEditorPage = await createEditorPage(page);
    await nodeEditorPage.goto(nodeEditorPage.tree.uuid);
    await nodeEditorPage.editor.fitViewButton.click();

    await use(nodeEditorPage);

    await nodeEditorPage.cleanup();
  },
  prototypePage: async ({ page }, use) => {
    const prototypePage = await createPrototypePage(page);
    await prototypePage.goto();

    await use(prototypePage);

    await prototypePage.cleanup();
  },
  publishedPage: async ({ page }, use) => {
    const publishedPage = await createPublishedPage(page);
    await publishedPage.goto();

    await use(publishedPage);

    await publishedPage.cleanup();
  },
});
