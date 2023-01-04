import { Page } from "@playwright/test";

export class DocumentNodeModel {
  readonly page: Page;
  renderer: DocumentNodeRenderer;
  sidebar: DocumentNodeSidebar;

  constructor(page: Page) {
    this.page = page;
    this.renderer = new DocumentNodeRenderer(page);
    this.sidebar = new DocumentNodeSidebar(page);
  }
}

class DocumentNodeRenderer {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getDownloadLocator(buttonText: string) {
    return this.page.locator(`button >> text=${buttonText}`);
  }

  async download(buttonText: string) {
    await this.getDownloadLocator(buttonText).click();
  }
}

class DocumentNodeSidebar {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async uploadTemplate(filePath: string) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent("filechooser"),
      this.page.locator(`text=Template hochladen`).click(),
    ]);

    await fileChooser.setFiles(filePath);
  }
}
