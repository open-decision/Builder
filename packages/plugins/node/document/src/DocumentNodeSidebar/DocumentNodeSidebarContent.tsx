import { useTemplateAPI } from "@open-decision/api-react-binding";
import {
  Button,
  buttonClasses,
  FileInput,
  Icon,
  Row,
  Tabs,
  Text,
} from "@open-decision/design-system";
import { Stack } from "@open-decision/design-system";
import { sidebarCardClasses } from "@open-decision/node-editor";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { useTranslations } from "next-intl";
import { DocumentNodePlugin } from "../documentNodePlugin";
import { Cross1Icon } from "@radix-ui/react-icons";

const DocumentNode = new DocumentNodePlugin();

type Props = { nodeId: string };

export function DocumentNodeSidebarContent({ nodeId }: Props) {
  const treeClient = useTreeClient();
  const t = useTranslations("builder.nodeEditingSidebar");

  const node = useTree((treeClient) => {
    return DocumentNode.get.single(nodeId)(treeClient);
  });

  if (node instanceof Error) return null;

  return (
    <Tabs.Content value="Inhalt">
      <Stack className="gap-4">
        <section>
          <RichTextEditor
            maxHeight={400}
            data-test="richTextEditor"
            onUpdate={({ editor }) =>
              DocumentNode.updateNodeContent(
                nodeId,
                editor.getJSON()
              )(treeClient)
            }
            content={node.data.content}
            Label={t("richTextEditor.label")}
          />
        </section>
        {node.data.templateUuid ? (
          <TemplateCard templateUuid={node.data.templateUuid} nodeId={nodeId} />
        ) : (
          <EmptyTemplateCard nodeId={nodeId} />
        )}
      </Stack>
    </Tabs.Content>
  );
}

type TemplateCardProps = { templateUuid: string; nodeId: string };

export const TemplateCard = ({ templateUuid, nodeId }: TemplateCardProps) => {
  const treeClient = useTreeClient();
  const { data } = useTemplateAPI().useTemplateQuery(templateUuid);

  const { mutate: deleteTemplate } = useTemplateAPI().useDeleteTemplateMutation(
    {
      onSuccess: () => {
        DocumentNode.deleteTemplateUuid(nodeId)(treeClient);
      },
    }
  );

  const { mutate: updateTemplate } =
    useTemplateAPI().useCreateTemplateMutation();

  return (
    <Stack className={sidebarCardClasses}>
      <Row className="justify-between items-center">
        <Text>{`${data?.data.displayName}`}</Text>
        <Row className="gap-2">
          <FileInput
            type="upload"
            accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
            className={buttonClasses({ size: "small", variant: "secondary" })}
            onChange={(event) => {
              const treeUuid = treeClient.get.id();
              if (!treeUuid) return;

              if (!event.currentTarget.files?.[0]) return;

              updateTemplate({
                template: event.currentTarget.files[0],
                treeUuid,
                displayName: event.currentTarget.files[0].name,
                templateUuid,
              });

              event.target.value = "";
            }}
          >
            Template aktualisieren
          </FileInput>
          <Button
            variant="neutral"
            size="small"
            onClick={() => {
              deleteTemplate({ templateUuid });
            }}
          >
            <Icon>
              <Cross1Icon />
            </Icon>
          </Button>
        </Row>
      </Row>
    </Stack>
  );
};

type EmptyTemplateCardProps = { nodeId: string };

const EmptyTemplateCard = ({ nodeId }: EmptyTemplateCardProps) => {
  const treeClient = useTreeClient();
  const { mutate: createTemplate } = useTemplateAPI().useCreateTemplateMutation(
    {
      onSuccess: ({ data }) => {
        DocumentNode.updateTemplateUuid(nodeId, data.uuid)(treeClient);
      },
    }
  );

  return (
    <Stack className={sidebarCardClasses}>
      <FileInput
        type="upload"
        accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
        className={buttonClasses({})}
        onChange={(event) => {
          const treeUuid = treeClient.get.id();
          if (!treeUuid) return;

          if (!event.currentTarget.files?.[0]) return;

          createTemplate({
            template: event.currentTarget.files[0],
            treeUuid,
            displayName: event.currentTarget.files[0].name,
          });

          event.target.value = "";
        }}
      >
        Template hochladen
      </FileInput>
    </Stack>
  );
};
