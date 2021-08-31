import { createStitches, CSS } from "@stitches/react";
import { tokens, media } from "../internal/tokens";
import {
  slateDark,
  slateDarkA,
  indigoDark,
  indigoDarkA,
  amberDark,
  amberDarkA,
  redDark,
  redDarkA,
  greenDark,
  greenDarkA,
  blueDark,
  blueDarkA,
  yellowDark,
  yellowDarkA,
} from "@radix-ui/colors";
import { ColorKeys, aliasColor } from "../internal/utils";

const { colors, ...otherTokens } = tokens;

export const designSystem = createStitches({
  theme: {
    colors: {
      ...colors,
      colorScheme1: `$colors$gray1`,
      colorScheme2: `$colors$gray2`,
      colorScheme3: `$colors$gray3`,
      colorScheme4: `$colors$gray4`,
      colorScheme5: `$colors$gray5`,
      colorScheme6: `$colors$gray6`,
      colorScheme7: `$colors$gray7`,
      colorScheme8: `$colors$gray8`,
      colorScheme9: `$colors$gray9`,
      colorScheme10: `$colors$gray10`,
      colorScheme11: `$colors$gray11`,
      colorScheme12: `$colors$gray12`,
    },
    ...otherTokens,
    fonts: {
      sans:
        "-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif;",
      serif:
        "Iowan Old Style, Apple Garamond, Baskerville, Times New Roman, Droid Serif, Times, Source Serif Pro, serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
      heading: "$serif",
      text: "$sans",
    },
  },
  media,
  utils: {
    colorScheme: (_config) => (value: ColorKeys) => {
      let colorScheme = value;

      if (value === undefined) {
        console.error(
          "The value passed to colorScheme should not be undefined. The default gray colorScheme is returned."
        );

        colorScheme = "gray";
      }

      return {
        "--colors-colorScheme1": `$colors$${colorScheme}1`,
        "--colors-colorScheme2": `$colors$${colorScheme}2`,
        "--colors-colorScheme3": `$colors$${colorScheme}3`,
        "--colors-colorScheme4": `$colors$${colorScheme}4`,
        "--colors-colorScheme5": `$colors$${colorScheme}5`,
        "--colors-colorScheme6": `$colors$${colorScheme}6`,
        "--colors-colorScheme7": `$colors$${colorScheme}7`,
        "--colors-colorScheme8": `$colors$${colorScheme}8`,
        "--colors-colorScheme9": `$colors$${colorScheme}9`,
        "--colors-colorScheme10": `$colors$${colorScheme}10`,
        "--colors-colorScheme11": `$colors$${colorScheme}11`,
        "--colors-colorScheme12": `$colors$${colorScheme}12`,
      };
    },
  },
});

export type StyleObject = CSS<typeof designSystem>;

export * from "@stitches/react";

export const {
  styled,
  config,
  keyframes,
  css,
  globalCss,
  theme,
  createTheme,
  getCssText,
} = designSystem;

export const darkTheme = createTheme("dark", {
  colors: {
    ...aliasColor("gray", slateDark),
    ...aliasColor("grayA", slateDarkA),
    ...aliasColor("primary", indigoDark),
    ...aliasColor("primaryA", indigoDarkA),
    ...aliasColor("accent", amberDark),
    ...aliasColor("accentA", amberDarkA),
    ...aliasColor("error", redDark),
    ...aliasColor("errorA", redDarkA),
    ...aliasColor("success", greenDark),
    ...aliasColor("successA", greenDarkA),
    ...aliasColor("warning", yellowDark),
    ...aliasColor("warningA", yellowDarkA),
    ...aliasColor("info", blueDark),
    ...aliasColor("infoA", blueDarkA),
  },
});
