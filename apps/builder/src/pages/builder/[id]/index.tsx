import * as React from "react";
import { NodeEditor } from "features/Builder/NodeEditor";
import { EditorProvider } from "features/Builder/state/useEditor";
import { ReactFlowProvider } from "react-flow-renderer";
import { EditorHeader } from "features/Builder/components/EditorHeader";
import { SideMenu } from "features/Builder/SideMenu";
import { BuilderLayout } from "../../../features/Builder/components/BuilderLayout";
import { Layout } from "../../../components";
import { LoadingSpinner, Stack } from "@open-decision/design-system";

export default function BuilderPage() {
  return (
    <Layout
      css={{
        display: "grid",
        gridTemplateColumns: `max-content 1fr`,
        gridTemplateRows: "max-content 1fr",
      }}
    >
      <ReactFlowProvider>
        <EditorProvider>
          <EditorHeader
            css={{
              gridColumn: "1 / -1",
              gridRow: "1",
            }}
          />
          <SideMenu css={{ gridRow: "2", gridColumn: "1", layer: "1" }} />
          <React.Suspense
            fallback={
              <Stack center>
                <LoadingSpinner size="50px" />
              </Stack>
            }
          >
            <NodeEditor
              css={{
                gridColumn: "2 / 3",
                gridRow: "2",
              }}
            />
          </React.Suspense>
        </EditorProvider>
      </ReactFlowProvider>
    </Layout>
  );
}

BuilderPage.getLayout = function getLayout(page: React.ReactElement) {
  return <BuilderLayout>{page}</BuilderLayout>;
};
