import {
  Box,
  Button,
  Icon,
  Link as SystemLink,
  Tabs,
} from "@open-decision/design-system";
import { BaseHeader, MainContent } from "components";
import { TreeNameInput } from "features/Builder/components/TreeNameInput";
import { ExportButton } from "features/Builder/components/ExportButton";
import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "react-feather";
import { Preview } from "features/Preview/Preview";
import { InterpreterProvider } from "@open-decision/interpreter";
import { MobilePreview } from "features/Preview/MobilePreview";
import { ErrorBoundary } from "@sentry/nextjs";
import { ErrorFallback } from "features/Error/ErrorFallback";
import { QueryClientProvider } from "react-query";
import { queryClient } from "features/Data/queryClient";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: Number(context.params?.id) },
  };
};

export default function VorschauPage({ id }) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={ErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <Vorschau id={id} />
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
}

type Props = { id: number };

function Vorschau({ id }: Props) {
  return (
    <InterpreterProvider
      tree={{
        id,
        name: syncedStore.name,
        tags: [],
        treeData: {
          nodes: syncedStore.nodes,
          startNode: syncedStore.startNode,
        },
      }}
    >
      <MainContent
        css={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "max-content max-content 1fr",
        }}
      >
        <BaseHeader>
          <TreeNameInput />
          <ExportButton css={{ marginLeft: "auto" }} />
        </BaseHeader>
        <Tabs.Root asChild defaultValue="desktop_preview">
          <>
            <Box
              css={{
                $padding: "$space$4 $space$2",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                borderBottom: "1px solid $gray7",
              }}
            >
              <Link passHref href={`/builder/${id}`}>
                <SystemLink
                  css={{
                    color: "$gray11",
                    fontWeight: "$extra-small-heading",
                    padding: "var(--padding)",
                    maxWidth: "max-content",
                    marginBottom: "-1px",
                  }}
                  underline={false}
                >
                  <Icon label="Zurück">
                    <ChevronLeft />
                  </Icon>
                  Zurück zum Builder
                </SystemLink>
              </Link>
              <Tabs.List>
                <Box
                  css={{
                    display: "flex",
                    gap: "$4",
                    alignItems: "end",
                    justifyContent: "center",
                  }}
                >
                  <Tabs.Trigger value="desktop_preview" asChild>
                    <Button
                      variant="neutral"
                      css={{
                        padding: "var(--padding)",
                        borderRadius: "0",

                        "&[data-state='active']": {
                          marginBottom: "-1px",
                          borderBottom: "3px solid $primary9",
                        },
                      }}
                    >
                      Desktop
                    </Button>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="mobile_preview" asChild>
                    <Button
                      variant="neutral"
                      css={{
                        padding: "var(--padding)",
                        borderRadius: "0",

                        "&[data-state='active']": {
                          marginBottom: "-1px",
                          borderBottom: "3px solid $primary9",
                        },
                      }}
                    >
                      Mobil
                    </Button>
                  </Tabs.Trigger>
                </Box>
              </Tabs.List>
              <Box />
            </Box>
            <Box
              css={{
                position: "relative",
                width: "100vw",
              }}
            >
              {/* <ThemingButton
                css={{ position: "absolute", top: 28, left: 28 }}
              /> */}
              <Tabs.Content value="desktop_preview" css={{ height: "100%" }}>
                <Preview />
              </Tabs.Content>
              <Tabs.Content
                value="mobile_preview"
                css={{ backgroundColor: "$gray6", height: "100%" }}
              >
                <MobilePreview />
              </Tabs.Content>
            </Box>
          </>
        </Tabs.Root>
      </MainContent>
    </InterpreterProvider>
  );
}