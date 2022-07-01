import {
  Button,
  Icon,
  DropdownMenu,
  Tooltip,
  StyleObject,
} from "@open-decision/design-system";
import {
  FileTextIcon,
  HamburgerMenuIcon,
  RocketIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useTreeContext } from "../../../../../features/Builder/state/treeStore/TreeContext";
import { PreviewLink } from "../../PreviewLink";

type Props = {
  isStartNode?: boolean;
  nodeId: string;
  name: string;
  css?: StyleObject;
};

export function NodeMenu({ isStartNode = false, name, nodeId, css }: Props) {
  const {
    treeClient: {
      nodes: { deleteN },
    },
    updateStartNode,
    removeSelectedNodes,
  } = useTreeContext();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          size="small"
          variant="secondary"
          css={{
            colorScheme: "gray",
            ...css,
          }}
          square
        >
          <Icon label={`Öffne Menü Node: ${name}`}>
            <HamburgerMenuIcon />
          </Icon>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content css={{ groupColor: "$gray12" }}>
        <DropdownMenu.Item asChild>
          <PreviewLink initialNode={nodeId}>
            <Icon>
              <FileTextIcon />
            </Icon>
            Vorschau
          </PreviewLink>
        </DropdownMenu.Item>
        {isStartNode ? (
          <Tooltip.Root>
            <Tooltip.Trigger style={{ all: "unset" }}>
              <DropdownMenu.Item onSelect={() => deleteN([nodeId])} disabled>
                <Icon label="Löschen Icon" css={{ $$paddingInline: 0 }}>
                  <TrashIcon />
                </Icon>
                Node löschen
              </DropdownMenu.Item>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Title>
                Die Startnode kann nicht entfernt werden.
              </Tooltip.Title>
            </Tooltip.Content>
          </Tooltip.Root>
        ) : (
          <>
            <DropdownMenu.Item onSelect={() => updateStartNode(nodeId)}>
              <Icon label="Zur Startnode machen" css={{ $$paddingInline: 0 }}>
                <RocketIcon />
              </Icon>
              Zur Startnode machen
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => {
                deleteN([nodeId]);
                removeSelectedNodes();
              }}
              css={{ colorScheme: "danger" }}
            >
              <Icon label="Löschen Icon" css={{ $$paddingInline: 0 }}>
                <TrashIcon />
              </Icon>
              Node löschen
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
