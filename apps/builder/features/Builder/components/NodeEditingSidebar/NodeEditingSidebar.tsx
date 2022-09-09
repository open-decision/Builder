import {
  Box,
  StyleObject,
  Row,
  Form,
  Label,
  Stack,
  DropdownMenu,
} from "@open-decision/design-system";
import * as React from "react";
import { Node } from "@open-decision/type-classes";
import { nodeNameMaxLength } from "../../utilities/constants";
import { NodeMenu } from "../Canvas/Nodes/NodeMenu";
import {
  useParents,
  useSelectedNodes,
  useStartNodeId,
} from "../../state/treeStore/hooks";
import { RichTextEditor } from "@open-decision/rich-text-editor";
import {
  useTreeClient,
  useTreeContext,
} from "../../state/treeStore/TreeContext";
import { AnimatePresence, motion } from "framer-motion";
import { ParentNodeSelector } from "./ParentNodeSelector";
import { StartNodeLabel } from "../NodeLabels/StartNodeLabels";
import { useTranslations } from "next-intl";
import { SingleSelectInput } from "@open-decision/select-input-ui";
import { BuilderComponent } from "@open-decision/free-text-input-ui";
import { useSnapshot } from "valtio";
import { createTreeClient } from "@open-decision/tree-client";
import { z } from "zod";
import { useEditor } from "../../state/useEditor";

type InputHeaderProps = {
  children?: React.ReactNode;
  inputType?: z.infer<
    ReturnType<typeof createTreeClient>["inputs"]["Type"]
  >["type"];
  nodeId: string;
};

const InputHeader = ({ children, inputType, nodeId }: InputHeaderProps) => {
  const treeClient = useTreeClient();

  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "$2",
        marginBottom: "$3",
      }}
    >
      <Label as="h2" css={{ margin: 0, display: "block" }}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <DropdownMenu.Button
              alignByContent="left"
              variant="neutral"
              size="small"
              css={{ textStyle: "medium-text" }}
            >
              {/* FIXME missing input types */}
              {inputType
                ? inputType.charAt(0).toUpperCase() + inputType.slice(1)
                : "Kein Input Typ ausgewählt"}
            </DropdownMenu.Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            {treeClient.inputs.types.map((type) => {
              return (
                <DropdownMenu.CheckboxItem
                  key={type}
                  checked={inputType === type}
                  onClick={() => {
                    const newInput = treeClient.input.select.create();
                    treeClient.inputs.add(newInput);
                    treeClient.inputs.connect.toNode(nodeId, newInput.id);
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenu.CheckboxItem>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Label>
      {children}
    </Box>
  );
};

export function NodeEditingSidebar() {
  const [selectionType, selectedNode] = useSelectedNodes();

  return (
    <AnimatePresence>
      {selectionType === "single" ? (
        <motion.aside
          layout
          key={selectionType}
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
          {selectionType === "single" ? (
            <NodeEditingSidebarContent
              key={selectedNode.id}
              css={{
                gridRow: "1 / -1",
                gridColumn: "2",
                zIndex: "$10",
                height: "100%",
                overflow: "hidden scroll",
                groupColor: "$gray11",
                borderLeft: "$border$layer",
              }}
              node={{ id: selectedNode.id, data: selectedNode.data }}
            />
          ) : null}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

type Props = { node: Pick<Node.TNode, "id" | "data">; css?: StyleObject };

function NodeEditingSidebarContent({ node, css }: Props) {
  const t = useTranslations("builder.nodeEditingSidebar");
  const inputs = useInputs(node.data.inputs);
  const {
    tree: { syncedStore },
  } = useTreeContext();
  const { replaceSelectedNodes } = useEditor();
  const treeClient = useTreeClient();
  const tree = useSnapshot(syncedStore);

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
        {inputs ? (
          Object.values(inputs).map((input) =>
            input.type ? (
              <Box as="section" key={input.id}>
                {(() => {
                  switch (input.type) {
                    case "select": {
                      return (
                        <>
                          <InputHeader inputType={input.type} nodeId={node.id}>
                            <SingleSelectInput.PrimaryActionSlot
                              tree={tree}
                              input={input}
                            />
                          </InputHeader>
                          <SingleSelectInput.Component
                            nodeId={node.id}
                            onClick={(target) => replaceSelectedNodes([target])}
                            input={input}
                            key={input.id}
                            tree={tree}
                          />
                        </>
                      );
                    }

                    case "freeText": {
                      return (
                        <>
                          <InputHeader
                            inputType={input.type}
                            nodeId={node.id}
                          />
                          <BuilderComponent.Component
                            inputId={input.id}
                            nodeId={node.id}
                            onClick={() => null}
                            key={input.id}
                            tree={tree}
                          />
                        </>
                      );
                    }

                    default:
                      return null;
                  }
                })()}
              </Box>
            ) : (
              <InputHeader nodeId={node.id} />
            )
          )
        ) : (
          <InputHeader nodeId={node.id} />
        )}
      </Box>
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
