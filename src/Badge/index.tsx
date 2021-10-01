import * as React from "react";
import { styled } from "../stitches";

export const StyledBadge = styled("span", {
  colorScheme: "primary",
  textStyle: "badge",
  borderRadius: "$full",
  paddingBlock: "$1",
  paddingInline: "$3",
  border: "1px solid transparent",

  variants: {
    level: {
      primary: { backgroundColor: "$colorScheme9", color: "$colorScheme1" },
      secondary: { color: "$colorScheme11", borderColor: "currentcolor" },
    },
  },

  defaultVariants: {
    level: "primary",
  },
});

export type BadgeProps = React.ComponentProps<typeof StyledBadge>;

export const Badge = React.forwardRef<HTMLButtonElement, BadgeProps>(
  ({ ...props }, ref) => <StyledBadge ref={ref} {...props} />
);
