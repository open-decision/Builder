import { styled } from "../stitches";

export type TextProps = React.ComponentProps<typeof Text>;
export const Text = styled("p", {
  color: "var(--color, $gray12)",
  margin: "unset",

  variants: {
    size: {
      large: { textStyle: "large-text" },
      medium: { textStyle: "medium-text" },
      small: { textStyle: "small-text" },
      "extra-small": { textStyle: "extra-small-text" },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});