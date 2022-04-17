import {
  Button,
  Icon,
  Row,
  styled,
  StyleObject,
} from "@open-decision/design-system";
import { ZoomInIcon, ZoomOutIcon } from "@radix-ui/react-icons";
import { useReactFlow } from "react-flow-renderer";

const Container = styled(Row, {
  layer: "1",
  borderRadius: "$md",
  padding: "$1",
  boxShadow: "$1",
});

type Props = { css?: StyleObject };

export function ZoomInOut({ css }: Props) {
  const { zoomIn, zoomOut } = useReactFlow();

  return (
    <Container css={css}>
      <Button
        onClick={() => zoomIn({ duration: 200 })}
        variant="neutral"
        css={{ colorScheme: "primary" }}
        square
      >
        <Icon>
          <ZoomInIcon />
        </Icon>
      </Button>
      <Button
        onClick={() => zoomOut({ duration: 200 })}
        variant="neutral"
        css={{ colorScheme: "primary" }}
        square
      >
        <Icon>
          <ZoomOutIcon />
        </Icon>
      </Button>
    </Container>
  );
}