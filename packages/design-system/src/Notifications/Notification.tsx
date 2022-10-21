import * as React from "react";
import { Notification as NotificationType } from "@open-decision/design-system/src/Notifications/NotificationState";
import { motion, useAnimation, Variants } from "framer-motion";
import { Cross2Icon } from "@radix-ui/react-icons";
import { InfoBox } from "@open-decision/design-system/src/Notifications/InfoBox";
import { Button } from "@open-decision/design-system/src/Button";
import { Icon } from "@open-decision/design-system/src/Icon/Icon";

type NotificationProps = {
  notification: NotificationType;
  id: string;
  removeNotification: (id: string) => void;
  closeLabel?: string;
};

export const Notification = ({
  notification,
  id,
  removeNotification,
  closeLabel,
}: NotificationProps) => {
  const animation = useAnimation();

  React.useEffect(() => {
    animation.start("empty");
  }, []);

  const container: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
    },
    exit: { opacity: 0, y: 10 },
  };

  const progress = {
    full: { width: "100%" },
    empty: { width: "0%" },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onPointerEnter={() => animation.stop()}
      onPointerLeave={() => animation.start("empty")}
      onClick={() => animation.set("full")}
      onFocus={() => animation.stop()}
      onBlur={() => animation.start("empty")}
    >
      <InfoBox
        CloseButton={
          <Button
            square
            variant="neutral"
            onClick={() => removeNotification(id)}
          >
            <Icon label={closeLabel ?? "Schließen"}>
              <Cross2Icon />
            </Icon>
          </Button>
        }
        css={{ boxShadow: "$6" }}
        variant="info"
        {...notification}
      />
      <motion.div
        variants={progress}
        transition={{ duration: notification.duration }}
        initial="full"
        animate={animation}
        onAnimationComplete={() => removeNotification(id)}
      />
    </motion.div>
  );
};
