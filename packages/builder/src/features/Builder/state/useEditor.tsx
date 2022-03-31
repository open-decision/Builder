import * as React from "react";
import { useReactFlow, useStore } from "react-flow-renderer";
import { calculateCenterOfNode } from "../utilities/calculateCenterOfNode";
import { sidebarWidth } from "../utilities/constants";
import { Node } from "@open-decision/type-classes";
import { useTreeContext } from "./treeStore/TreeContext";

type projectCoordinatesFn = (
  coordinates: Node.TCoordinates
) => Node.TCoordinates | undefined;

type EditorState = {
  getCenter: () => Node.TCoordinates | undefined;
  projectCoordinates: projectCoordinatesFn;
  reactFlowWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  closeNodeEditingSidebar: () => void;
  zoomToNode: (node: Node.TNode) => void;
  isConnecting: boolean;
  connectingNodeId?: string;
};

export const EditorContext = React.createContext<EditorState | null>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof EditorContext.Provider>,
  "value"
>;
export function EditorProvider({ children }: TreeProviderProps) {
  const { removeSelectedNodes } = useTreeContext();
  const reactFlowWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect();

  const { project, setCenter, getZoom } = useReactFlow();
  const getCenter = () => {
    if (!reactFlowBounds) return undefined;

    return project({
      x: reactFlowBounds.width / 2,
      y: reactFlowBounds.height / 2,
    });
  };

  const projectCoordinates: projectCoordinatesFn = (coordinates) => {
    if (!reactFlowBounds) return undefined;

    return project({
      x: coordinates.x - reactFlowBounds.left,
      y: coordinates.y - reactFlowBounds.top,
    });
  };

  function zoomToNode(node: Node.TNode) {
    const positionOfNodeFromCenter = calculateCenterOfNode(
      node.position,
      node.id ? { x: sidebarWidth / 2, y: 0 } : undefined
    );

    setCenter?.(positionOfNodeFromCenter.x, positionOfNodeFromCenter.y, {
      zoom: getZoom(),
      duration: 1000,
    });
  }

  const connectingNodeId = useStore((state) => state.connectionNodeId);
  const isConnecting = useStore((state) => state.connectionNodeId != null);

  return (
    <EditorContext.Provider
      value={{
        projectCoordinates,
        getCenter,
        reactFlowWrapperRef,
        closeNodeEditingSidebar: () => {
          removeSelectedNodes();
        },
        zoomToNode,
        isConnecting,
        connectingNodeId: connectingNodeId ? connectingNodeId : undefined,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const editorContext = React.useContext(EditorContext);

  if (!editorContext) {
    throw new Error("useEditor can only be used inside of an EditorProvider");
  }

  return editorContext;
}
