import {
  Box,
  StyleObject,
  Row,
  Form,
  Label,
  Stack,
  Badge,
} from "@open-decision/design-system";
import * as React from "react";
import { Node } from "@open-decision/type-classes";
import { nodeNameMaxLength } from "../../utilities/constants";
import { NodeMenu } from "../Canvas/Nodes/NodeMenu";
import {
  useChildren,
  useNodeOptions,
  useParents,
  useStartNodeId,
  useTreeClient,
} from "@open-decision/tree-sync";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import { AnimatePresence, motion } from "framer-motion";
import { ParentNodeSelector } from "./ParentNodeSelector";
import { StartNodeLabel } from "../NodeLabels/StartNodeLabels";
import { useTranslations } from "next-intl";
import { useEditor } from "../../state/useEditor";
import { useSelectedNodes } from "../../state/useSelectedNodes";
import { InputPluginComponent } from "@open-decision/tree-client";

export function NodeEditingSidebar() {
  const selectedNodes = useSelectedNodes();
  const singleNodeSelected = selectedNodes && selectedNodes.length === 1;

  return (
    <AnimatePresence>
      {singleNodeSelected ? (
        <motion.aside
          layout
          initial={{ x: "100%" }}
          animate={{
            x: 0,
            transition: { duration: 0.5, type: "spring", bounce: 0 },
          }}
          exit={{
            x: "100%",
            transition: {
              duration: 0.3,
              type: "spring",
              bounce: 0,
              delay: 0.1,
            },
          }}
          style={{
            gridRow: "1 / -1",
            gridColumn: "2",
            zIndex: "$10",
            height: "100%",
            overflow: "hidden scroll",
            width: "100%",
          }}
        >
          <NodeEditingSidebarContent
            key={selectedNodes[0].id}
            css={{
              gridRow: "1 / -1",
              gridColumn: "2",
              zIndex: "$10",
              height: "100%",
              overflow: "hidden scroll",
              groupColor: "$gray11",
              borderLeft: "$border$layer",
            }}
            node={{ id: selectedNodes[0].id, data: selectedNodes[0].data }}
          />
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

type Props = { node: Pick<Node.TNode, "id" | "data">; css?: StyleObject };

function NodeEditingSidebarContent({ node, css }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar");
  const { replaceSelectedNodes } = useEditor();
  const treeClient = useTreeClient();
  const childNodes = useChildren(node.id);
  const nodeOptions = useNodeOptions(node.id);

  const unconnectedNodeOptions = nodeOptions
    ? childNodes.filter((option) => !nodeOptions.includes(option.id))
    : childNodes;

  return (
    <Stack
      css={{
        groupColor: "$gray11",
        gap: "$6",
        flex: 1,
        layer: "1",
        paddingInlineEnd: "$5",
        paddingInlineStart: "$5",
        paddingBlock: "$5",
        ...css,
      }}
    >
      <Header node={node} />
      <Box as="section">
        <RichTextEditor
          data-test="richTextEditor"
          onUpdate={({ editor }) =>
            treeClient.nodes.update.content(node.id, editor.getJSON())
          }
          content={node.data.content}
          Label={(props) => (
            <Label
              css={{
                margin: 0,
                marginBottom: "$3",
                display: "block",
              }}
              {...props}
            >
              {t("richTextEditor.label")}
            </Label>
          )}
        />
      </Box>
      <Box as="section">
        <Label as="h2">Nicht zugewiesene Ziele</Label>
        <Row css={{ marginTop: "$2", gap: "$2" }}>
          {Object.values(unconnectedNodeOptions).map((childNode) => (
            <Badge key={childNode.id}>{childNode.name}</Badge>
          ))}
        </Row>
      </Box>
      <InputPluginComponent
        onClick={(target) => replaceSelectedNodes([target])}
        inputIds={node.data.inputs}
        nodeId={node.id}
      />
    </Stack>
  );
}

type HeaderProps = { node: Pick<Node.TNode, "id" | "data"> };

const Header = ({ node }: HeaderProps) => {
  const t = useTranslations("builder.nodeEditingSidebar");
  const startNodeId = useStartNodeId();
  const treeClient = useTreeClient();
  const parentNodes = useParents(node.id);
  const isStartNode = node?.id === startNodeId;

  const formState = Form.useFormState({
    defaultValues: { name: node?.data.name ?? "" },
    setValues(values) {
      treeClient.nodes.update.name(node.id, values.name);
    },
  });

  return (
    <Form.Root state={formState} resetOnSubmit={false}>
      <Row
        css={{
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "26px",
        }}
        as="header"
      >
        <Form.Label name={formState.names.name}>
          {t("nameInput.label")}
        </Form.Label>
        <Row css={{ gap: "$2" }} center>
          {parentNodes.length > 0 ? (
            <ParentNodeSelector parentNodes={parentNodes} />
          ) : null}
          {isStartNode ? (
            <StartNodeLabel css={{ colorScheme: "success" }} />
          ) : null}
          <NodeMenu
            name={node.data.name ?? ""}
            nodeId={node.id}
            isStartNode={isStartNode}
          />
        </Row>
      </Row>
      <Form.Input
        name={formState.names.name}
        maxLength={nodeNameMaxLength}
        placeholder={t("nameInput.placeholder")}
        css={{
          layer: "2",
          color: "$gray12",
        }}
      />
    </Form.Root>
  );
};
