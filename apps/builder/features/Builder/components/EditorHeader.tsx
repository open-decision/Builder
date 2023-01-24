import {
  DropdownMenu,
  FileInput,
  Icon,
  LoadingSpinner,
  Row,
  useNotificationTemplate,
} from "@open-decision/design-system";
import { ProjectMenu } from "../../../components/ProjectMenu/ProjectMenu";
import { BaseHeader } from "../../../components";
import dynamic from "next/dynamic";
import { Tree } from "@open-decision/tree-type";
import {
  BlendingModeIcon,
  CrossCircledIcon,
  DownloadIcon,
} from "@radix-ui/react-icons";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { useTranslations } from "next-intl";
import { PrototypButton } from "./PrototypButton";
import themeTemplate from "./theme-template.json";
import { useTreeAPI } from "@open-decision/api-react-binding";

type HeaderProps = {
  className?: string;
  treeId: string;
  children?: React.ReactNode;
};

const NodeSearch = dynamic(() => import("./NodeSearch"), { ssr: false });

export const EditorHeader = ({ className, treeId, children }: HeaderProps) => {
  const treeClient = useTreeClient();
  const t = useTranslations("common");

  const theme = useTree((treeClient) => treeClient.get.theme());
  const addNotificationFromTemplate = useNotificationTemplate();

  const templateFile = new Blob([JSON.stringify(themeTemplate)], {
    type: "application/json",
  });

  const templateFileLink = URL.createObjectURL(templateFile);

  const {
    data: tree,
    isLoading,
    isError,
    error,
  } = useTreeAPI().useTreeQuery(treeId, {
    select: (data) => data.data,
  });

  if (isLoading)
    return (
      <BaseHeader className={className}>
        <Row className="w-full justify-center">
          <LoadingSpinner />
        </Row>
      </BaseHeader>
    );

  if (isError) throw error;

  return (
    <BaseHeader
      className={className}
      LogoSlot={
        <ProjectMenu
          tree={tree}
          Items={({ setDropdownOpen }) => {
            return (
              <>
                {theme ? (
                  <DropdownMenu.Item
                    onSelect={() => {
                      treeClient.removeTheme();
                      addNotificationFromTemplate("removeTheme");
                    }}
                  >
                    <Icon>
                      <CrossCircledIcon />
                    </Icon>
                    Theme entfernen
                  </DropdownMenu.Item>
                ) : (
                  <DropdownMenu.Item
                    onSelect={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <FileInput
                      Icon={
                        <Icon>
                          <BlendingModeIcon />
                        </Icon>
                      }
                      onChange={(event) => {
                        const fileReader = new FileReader();
                        fileReader.onload = function (event) {
                          const result = event.target?.result;

                          if (!result || !(typeof result === "string"))
                            throw result;
                          const parsedResult = JSON.parse(result);

                          const validatedResult =
                            Tree.Type.shape.theme.safeParse(parsedResult);

                          if (!validatedResult.success) {
                            console.error(validatedResult.error);
                            setDropdownOpen(false);
                            throw validatedResult;
                          }

                          if (validatedResult.data) {
                            treeClient.updateTheme(validatedResult.data);
                          }

                          addNotificationFromTemplate("addTheme");
                          setDropdownOpen(false);
                        };

                        if (!event.currentTarget.files?.[0]) return;
                        fileReader.readAsText(event.currentTarget.files[0]);
                        event.target.value = "";
                      }}
                    >
                      {t("projectMenu.uploadTheme")}
                    </FileInput>
                  </DropdownMenu.Item>
                )}
                <DropdownMenu.Item asChild>
                  <a
                    href={templateFileLink}
                    download="theme-template.json"
                    className="gap-2"
                  >
                    <Icon className="mt-[2px]">
                      <DownloadIcon />
                    </Icon>
                    Theme Template herunterladen
                  </a>
                </DropdownMenu.Item>
              </>
            );
          }}
        />
      }
    >
      <Row className="gap-3 items-center w-full justify-between">
        <NodeSearch />
        <PrototypButton treeId={treeId} hasPreview={tree.hasPreview} />
      </Row>
      {children}
    </BaseHeader>
  );
};
