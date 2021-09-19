import { Box, IconButton, styled } from "@open-legal-tech/design-system";
import * as React from "react";
import * as Separator from "@radix-ui/react-separator";
import { insertLink } from "./utils";
import { useSlateStatic } from "slate-react";
import {
  toggleBooleanMark,
  toggleElement,
  toggleElementUnionMark,
} from "./formatting";
import {
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link,
  List,
  Type,
  Underline,
} from "react-feather";

const ToolbarIconButton = IconButton;
ToolbarIconButton.defaultProps = { variant: "ghost" };

const StyledSeparator = styled(Separator.Root, {
  backgroundColor: "$gray8",
  "&[data-orientation=horizontal]": { height: 1 },
  "&[data-orientation=vertical]": { width: 1 },
});

export function Toolbar(): JSX.Element {
  const editor = useSlateStatic();
  const toggleEditorMark = toggleBooleanMark(editor);
  const toggleEditorElement = toggleElement(editor);
  const toggleEditorElementUnionMark = toggleElementUnionMark(editor);

  return (
    <Box css={{ display: "flex", backgroundColor: "$gray6", padding: "$1" }}>
      <ToolbarIconButton
        label="Füge einen neuen Link hinzu"
        onClick={() =>
          insertLink(editor, prompt("url") ?? "www.open-decision.org")
        }
        Icon={<Link />}
      />
      <StyledSeparator orientation="vertical" decorative />
      <ToolbarIconButton
        label="Konvertiere den ausgewählten Text in eine Überschrift"
        onClick={() => toggleEditorElement("h1")}
        Icon={<Type />}
      />
      <ToolbarIconButton
        label="Erstelle eine unnumerierte Liste"
        onClick={() => toggleEditorElement("ul")}
        Icon={<List />}
      />
      <StyledSeparator orientation="vertical" decorative />
      <ToolbarIconButton
        label="Markiere den ausgewählten Text dick"
        onClick={() => toggleEditorMark("bold")}
        Icon={<Bold />}
      />
      <ToolbarIconButton
        label="Markiere den ausgewählten Text kursiv"
        onClick={() => toggleEditorMark("italic")}
        Icon={<Italic />}
      />
      <ToolbarIconButton
        label="Unterstreiche den ausgewählten Text"
        onClick={() => toggleEditorMark("underline")}
        Icon={<Underline />}
      />
      <ToolbarIconButton
        label="Orientiere den ausgewählten Block links"
        onClick={() => toggleEditorElementUnionMark("justify", "left")}
        Icon={<AlignLeft />}
      />
      <ToolbarIconButton
        label="Orientiere den ausgewählten Block mittig"
        onClick={() => toggleEditorElementUnionMark("justify", "center")}
        Icon={<AlignJustify />}
      />
      <ToolbarIconButton
        label="Orientiere den ausgewählten Block rechts"
        onClick={() => toggleEditorElementUnionMark("justify", "right")}
        Icon={<AlignRight />}
      />
    </Box>
  );
}
