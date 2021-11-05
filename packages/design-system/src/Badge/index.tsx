import * as React from "react";
import { styled } from "../stitches";

export const StyledBadge = styled("span", {
  colorScheme: "primary",
  borderRadius: "$full",
  border: "1px solid transparent",
  textAlign: "center",
  maxWidth: "max-content",

  variants: {
    level: {
      primary: { backgroundColor: "$colorScheme9", color: "$colorScheme1" },
      secondary: { color: "$colorScheme11", borderColor: "currentcolor" },
    },
    size: {
      small: {
        paddingBlock: "$1",
        paddingInline: "$2",
        textStyle: "extra-small-text",
        letterSpacing: "0.0625em",
        fontWeight: 500,
        lineHeight: "1.25em",
      },
      medium: {
        paddingBlock: "$2",
        paddingInline: "$4",
        textStyle: "small-text",
        letterSpacing: "0.0625em",
        fontWeight: 500,
        lineHeight: "1.25em",
      },
      large: {
        paddingBlock: "$2",
        paddingInline: "$6",
        textStyle: "small-text",
        letterSpacing: "0.0625em",
        fontWeight: 500,
        lineHeight: "1.25em",
      },
    },
  },

  defaultVariants: {
    level: "primary",
    size: "medium",
  },
});

export type BadgeProps = React.ComponentProps<typeof StyledBadge>;

export const BadgeComponent = (
  props: BadgeProps,
  ref: React.Ref<HTMLSpanElement>
) => <StyledBadge ref={ref} {...props} />;

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  BadgeComponent
);