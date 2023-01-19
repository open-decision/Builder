import * as React from "react";
import {
  DropdownMenu,
  Form,
  Icon,
  Row,
  Stack,
  stackClasses,
  Tabs,
  ToggleGroup,
} from "@open-decision/design-system";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { useTranslations } from "next-intl";
import { nodeNameMaxLength } from "../../utils/constants";
import { NodeMenu } from "../NodeMenu";
import { SidebarPreview } from "./SidebarPreview";
import {
  TNodePluginGroup,
  TNodeSidebarProps,
} from "@open-decision/plugins-node-helpers";

const hasContent = (node: any): node is { data: { content: any } } => {
  return node.data && node.data.content;
};

export const sidebarPaddingClasses = "p-4";

export const NodeSidebar = ({
  className,
  nodeId,
  children,
  hasPreview = true,
  tabs = [],
  initialTab,
  nodePlugins,
  edgePlugins,
}: Omit<TNodeSidebarProps, "onNodeCreate" | "onEdgeCreate">) => {
  const [selectedTab, setSelectedTab] = React.useState(initialTab);

  return (
    <Stack
      key={nodeId}
      className={`flex-1 z-10 h-full border-l border-gray7 ${className}`}
    >
      <Header
        nodeId={nodeId}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabs={[...tabs, hasPreview ? "Vorschau" : ""]}
        nodePlugins={nodePlugins}
      />
      <Tabs.Root value={selectedTab} asChild>
        <Stack
          classNames={[
            sidebarPaddingClasses,
            "overflow-x-hidden overflow-y-scroll h-full",
          ]}
        >
          {children}
          <SidebarPreview nodePlugins={nodePlugins} edgePlugins={edgePlugins} />
        </Stack>
      </Tabs.Root>
    </Stack>
  );
};

type HeaderProps = Pick<TNodeSidebarProps, "nodeId"> & {
  selectedTab?: string;
  setSelectedTab?: (value: string) => void;
  tabs?: string[];
  nodePlugins: TNodePluginGroup;
};

const Header = ({
  nodeId,
  selectedTab,
  setSelectedTab,
  tabs,
  nodePlugins,
}: HeaderProps) => {
  const t = useTranslations("builder.nodeEditingSidebar");
  const nodeNames = useTranslations("common.nodeNames");
  const treeClient = useTreeClient();

  const node = useTree((treeClient) => treeClient.nodes.get.single(nodeId));
  const startNodeId = useTree((treeClient) => treeClient.get.startNodeId());

  const isStartNode = nodeId === startNodeId;

  const methods = Form.useForm({
    defaultValues:
      node instanceof Error
        ? {}
        : {
            name: node?.name ?? "",
            rendererButtonLabel: node?.rendererButtonLabel,
          },
  });

  if (!node) return null;

  const NodeTypeIcon = nodePlugins.Icons[node.type];

  return (
    <Form.Root methods={methods}>
      <header
        className={stackClasses({}, [
          "min-h-[26px] bg-layer-3 gap-4 border-b border-gray7",
          sidebarPaddingClasses,
        ])}
      >
        <Row center className="justify-between w-full">
          <Row>
            <Icon label="" className="bg-gray3 rounded-md p-2">
              <NodeTypeIcon />
            </Icon>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <DropdownMenu.Button variant="neutral">
                  {nodeNames(`${node.type as any}.short`)}
                </DropdownMenu.Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="start">
                {Object.values(nodePlugins.addablePlugins).map((plugin) => (
                  <DropdownMenu.Item
                    key={plugin.type}
                    onSelect={() => {
                      const oldNode = treeClient.nodes.get.single(nodeId);

                      if (!oldNode) return;
                      let oldNodeContent;

                      if (hasContent(oldNode)) {
                        oldNodeContent = oldNode.data.content;
                      }

                      const newNode = plugin.create({
                        data: { content: oldNodeContent },
                        name: oldNode.name,
                        position: oldNode.position,
                      })(treeClient);

                      treeClient.nodes.update.node(nodeId, newNode);
                    }}
                  >
                    {nodeNames(`${plugin.type}.short`)}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Row>
          <NodeMenu
            align="end"
            nodeId={nodeId}
            isStartNode={isStartNode}
            name={node.name ?? "Kein Name"}
          />
        </Row>
        <Form.Field Label={t("nameInput.label")} layout="inline-left">
          <Form.Input
            {...methods.register("name", {
              onChange(event) {
                treeClient.nodes.update.name(nodeId, event.target.value);
              },
            })}
            maxLength={nodeNameMaxLength}
            placeholder={t("nameInput.placeholder")}
            className="text-gray12"
          />
        </Form.Field>

        {tabs && selectedTab && setSelectedTab ? (
          <ToggleGroup.Root
            type="single"
            value={selectedTab}
            onValueChange={(value) => {
              if (value) setSelectedTab(value);
            }}
          >
            {tabs.map((tab, index) => (
              <ToggleGroup.Item key={tab} value={tab}>
                {index + 1}. {tab}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        ) : null}
      </header>
    </Form.Root>
  );
};
