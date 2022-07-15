import * as React from "react";
import { Heading, Form } from "@open-decision/design-system";
import { Card } from "../../components/Card";
import { useUserUpdateMutation } from "../Auth/settings.queries";
import { VerifiedSettingsChange } from "./VerifiedSettingsChange";
import { useUserQuery } from "../Data/useUserQuery";

export function ChangePassword() {
  const { data: user, isLoading: isLoadingUser } = useUserQuery();
  const formState = Form.useFormState({
    defaultValues: {
      newPassword: "",
    },
  });

  formState.useSubmit(() => {
    setNewPassword(formState.values.newPassword);
    setOpen(true);
  });

  const [newPassword, setNewPassword] = React.useState<string | undefined>(
    undefined
  );

  const { mutate, isLoading } = useUserUpdateMutation();
  const [open, setOpen] = React.useState(false);

  return (
    <VerifiedSettingsChange
      onVerify={() => (user ? mutate({ password: newPassword, user }) : null)}
      open={open}
      setOpen={setOpen}
      disabled={isLoadingUser}
    >
      <Card>
        <Heading as="h3" size="small">
          Passwort ändern
        </Heading>
        <Form.Root state={formState}>
          <Form.Field Label="Neues Passwort">
            <Form.Input
              name={formState.names.newPassword}
              required
              type="password"
              placeholder="********"
            />
          </Form.Field>
          <Form.Submit
            isLoading={isLoading}
            variant="secondary"
            css={{ marginLeft: "auto", marginTop: "$3" }}
          >
            Passwort ändern
          </Form.Submit>
        </Form.Root>
      </Card>
    </VerifiedSettingsChange>
  );
}
