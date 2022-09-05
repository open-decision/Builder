import React from "react";
import {
  Badge,
  Box,
  LoadingSpinner,
  Popover,
  Row,
  Stack,
  styled,
  Text,
  ErrorReportLink,
} from "@open-decision/design-system";

const AppContainer = styled("main", {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  layer: "2",
});

function Loading() {
  return (
    <Box
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        layer: "2",
      }}
    >
      <LoadingSpinner size="60px" />
    </Box>
  );
}

const AlphaBanner = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Row
          css={{
            layer: "3",
            padding: "$2",
            cursor: "pointer",
            boxShadow: "$1",
            justifyContent: "space-between",
          }}
          center
        >
          <Box />
          <Row center css={{ gap: "$2" }}>
            <Badge css={{ colorScheme: "warning" }}>Alpha</Badge>
            <Text>Klicke für mehr Informationen.</Text>
          </Row>
          <ErrorReportLink>Feedback</ErrorReportLink>
        </Row>
      </Popover.Trigger>
      <Popover.Content
        css={{
          maxWidth: "400px",
          focusType: "none",
          padding: "$4",
          layer: "1",
        }}
        asChild
        sideOffset={10}
      >
        <Stack css={{ gap: "$4" }}>
          <Text>
            Open-Decision befindet sich noch in einer frühen Entwicklungsstufe.
            Feedback durch unsere Nutzer*innen hilft uns dabei die Nutzbarkeit
            unserer Software dauerhaft zu gewährleisten.
          </Text>
          <Text>
            Bei Fehlern oder Feedback jeglicher Art, schreib uns bitte hier:{" "}
            <ErrorReportLink />
          </Text>
          <Text size="large">Vielen Dank!</Text>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
};

export const LayoutImpl = (
  { children, ...props }: React.ComponentProps<typeof AppContainer>,
  ref: React.Ref<HTMLElement>
): JSX.Element => {
  return (
    <>
      <React.Suspense fallback={<Loading {...props} />}>
        <AppContainer {...props} ref={ref}>
          {children}
        </AppContainer>
      </React.Suspense>
    </>
  );
};

export const Layout = React.forwardRef(LayoutImpl);
