import {
  Box,
  Icon,
  Link as SystemLink,
  Text,
} from "@open-legal-tech/design-system";
import { BaseHeader, MainContent } from "components";
import { TreeNameInput } from "features/Builder/components/TreeNameInput";
import { ExportButton } from "features/Builder/components/ExportButton";
import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "react-feather";
import { Preview } from "features/Preview/Preview";
import { useTree } from "features/Builder/state/useTree";
import { BuilderInterpreter } from "@open-decision/interpreter";

export default function Vorschau() {
  const [state] = useTree();

  if (state.matches("empty")) {
    return <Box>Empty</Box>;
  }

  if (state.matches("pending")) {
    return <Box>Loading...</Box>;
  }

  const InterpreterInstance = new BuilderInterpreter(state.context);

  return (
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
      <Box
        css={{
          $padding: "$space$4 $space$2",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderBottom: "1px solid $gray9",
        }}
      >
        <Link passHref href="/">
          <SystemLink
            css={{
              color: "$gray11",
              fontWeight: "$extra-small-heading",
              padding: "var(--padding)",
              maxWidth: "max-content",
              marginBottom: "-1px",
            }}
          >
            <Icon label="Zurück">
              <ChevronLeft />
            </Icon>
            Zurück zum Builder
          </SystemLink>
        </Link>
        <Box
          css={{
            display: "flex",
            gap: "$4",
            alignItems: "end",
            justifyContent: "center",
          }}
        >
          <Text
            css={{
              marginBottom: "-1px",
              padding: "var(--padding)",
              borderBottom: "3px solid $primary9",
            }}
          >
            Desktop
          </Text>
          <Text
            css={{
              padding: "var(--padding)",
              borderBottom: "3px solid transparent",
            }}
          >
            Mobile
          </Text>
        </Box>
        <Box />
      </Box>
      <Preview
        css={{ width: "100vw" }}
        InterpreterInstance={InterpreterInstance}
      />
    </MainContent>
  );
}
