import { styled } from "../stitches";

export type ButtonProps = React.ComponentProps<typeof Button>;
export const Button = styled("button", {
  $$borderWidth: "1px",
  $$paddingInline: "$space$6",
  $$paddingBlock: "$space$3",
  $$YTranslation: "0px",
  $$XTranslation: "0px",
  //Mini reset
  appearance: "none",
  colorScheme: "primary",
  borderRadius: "$md",
  textStyle: "button",
  maxWidth: "max-content",

  //The small animation pressing the Button down on click.
  transition: "transform background-color",
  transitionDuration: "0.1s",
  transform: "translate($$XTranslation, $$YTranslation)",

  "&:disabled": {
    opacity: 0.4,
  },

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "$$borderWidth solid transparent",
  padding: "$$paddingBlock $$paddingInline",

  variants: {
    size: {
      small: {
        $$paddingInline: "$space$4",
        $$paddingBlock: "$space$2",
        fontSize: "$small-text",
      },
      medium: {
        fontSize: "$medium-text",
      },
      large: {
        $$paddingInline: "$space$8",
        $$paddingBlock: "$space$4",
        fontSize: "$large-text",
      },
    },

    variant: {
      primary: {
        boxShadow: "$3",
        backgroundColor: "$colorScheme9",
        color: "$colorScheme1",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme10",
        },

        "&:active": {
          backgroundColor: "$colorScheme11",
        },

        "&:disabled": {
          opacity: 0.2,
        },
      },
      secondary: {
        backgroundColor: "$colorScheme3",
        color: "$colorScheme11",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme5",
        },

        "&:active": {
          backgroundColor: "$colorScheme7",
        },
      },
      tertiary: {
        backgroundColor: "$colorScheme1",
        color: "$colorScheme11",
        borderColor: "currentcolor",

        "&:hover, &:focus-visible": {
          backgroundColor: "$colorScheme3",
        },

        "&:active": {
          backgroundColor: "$colorScheme5",
        },
      },
      ghost: {
        colorScheme: "gray",
        color: "$colorScheme10",
        backgroundColor: "unset",
        boxShadow: "unset",

        "&:hover, &:focus": {
          backgroundColor: "unset",
          boxShadow: "unset",
          color: "$colorScheme11",
        },
      },
    },

    pressable: {
      true: {
        "&:active": {
          $$YTranslation: "1px",
          boxShadow: "none",
        },
      },
    },

    alignContent: {
      left: {
        $$XTranslation: "calc(($$borderWidth + $$paddingInline) * -1)",
      },
      right: {
        $$XTranslation: "calc($$borderWidth + $$paddingInline)",
      },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "medium",
    pressable: true,
  },
});
