import { StyleObject, Text } from "@open-decision/design-system";
import { InfoBox } from "../../features/Notifications/InfoBox";
import { ErrorReportLink } from "./ErrorReportLink";

export type ErrorCardProps = {
  title?: string;
  description?: string;
  css?: StyleObject;
};

export function ErrorCard({
  title = "Es ist ein unbekannter Fehler aufgetreten.",
  description = "Bitte lade die Seite neu.",
  css,
}: ErrorCardProps) {
  return (
    <InfoBox
      title={title}
      content={
        <>
          <Text size="large" css={{ marginBottom: "$6" }}>
            {description}
          </Text>
          <Text>
            Sollte der Fehler weiterhin auftreten dann erstelle bitte einen
            Bugreport hier: <ErrorReportLink />
          </Text>
        </>
      }
      variant="danger"
      css={{ boxShadow: "$1", ...css }}
    />
  );
}
