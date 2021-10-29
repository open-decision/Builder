import * as React from "react";

import { Meta, Story } from "@storybook/react";
import { Badge, BadgeProps } from "./index";
import { Box } from "../Box";

export default {
  component: Badge,
  title: "Components/Badge",
} as Meta;

const BadgeGrid: Story<BadgeProps> = (props) => (
  <Box css={{ display: "grid", gap: "$4", maxWidth: "max-content" }}>
    <Badge size="small" {...props}>
      Badge
    </Badge>
    <Badge {...props}>Badge</Badge>
    <Badge size="large" {...props}>
      Badge
    </Badge>
  </Box>
);

export const Primary = BadgeGrid.bind({});

export const Secondary = BadgeGrid.bind({});
Secondary.args = {
  level: "secondary",
};