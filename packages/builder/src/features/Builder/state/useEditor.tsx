import * as React from "react";
import { OnLoadParams, useZoomPanHelper } from "react-flow-renderer";
import { calculateCenterOfNode } from "../utilities/useCenter";
import { sidebarWidth, transitionDuration } from "../utilities/constants";
import { useTree } from "./useTree";
import { BuilderNode } from "@open-decision/type-classes";

type EditorState = {
  reactFlowInstance?: OnLoadParams<any>;
  setReactFlowInstance: (newInstance: OnLoadParams<any>) => void;
  isNodeEditingSidebarOpen: boolean;
  closeNodeEditingSidebar: () => void;
  isTransitioning: boolean;
};

export const EditorContext = React.createContext<EditorState | null>(null);

type TreeProviderProps = Omit<
  React.ComponentProps<typeof EditorContext.Provider>,
  "value"
>;
export function EditorProvider({ children }: TreeProviderProps) {
  const [state, send] = useTree();
  const selectedNodeId = state?.context?.selectedNodeId;

  const [reactFlowInstance, setReactFlowInstance] = React.useState<
    OnLoadParams<BuilderNode.TNode> | undefined
  >();

  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const position = selectedNodeId
    ? state.context.nodes?.[selectedNodeId]?.position
    : undefined;

  const { setCenter } = useZoomPanHelper();
  React.useEffect(() => {
    if (selectedNodeId && position) {
      setIsTransitioning(true);
      const positionOfNodeFromCenter = calculateCenterOfNode(
        position,
        selectedNodeId ? { x: sidebarWidth / 2, y: 0 } : undefined
      );
      setCenter?.(positionOfNodeFromCenter.x, positionOfNodeFromCenter.y, 1);
    }

    // After the animation ends smoothPan is set back to inactive.
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);

    return () => clearTimeout(timer);
  }, [position, selectedNodeId, setCenter]);

  return (
    <EditorContext.Provider
      value={{
        reactFlowInstance,
        setReactFlowInstance,
        isNodeEditingSidebarOpen: Boolean(selectedNodeId),
        closeNodeEditingSidebar: () => send({ type: "selectNode", nodeId: "" }),
        isTransitioning,
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
