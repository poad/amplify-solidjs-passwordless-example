import { Button } from "@kobalte/core/button";
import { signOut } from "aws-amplify/auth";
import { ConsoleLogger } from "aws-amplify/utils";

import { type JSX } from "solid-js/jsx-runtime";
import { Flex } from "../ui/Flex";

export function SignOutButton(props: { onSignOut?: () => void }): JSX.Element {
  const logger = new ConsoleLogger("SignOutButton");

  return (
    <Flex>
      <Button
        onClick={() =>
          void signOut({ global: true })
            .then(() => {
              props.onSignOut?.();
            })
            .catch((err) => {
              /* Nothing to do */
              logger.error(err);
            })
        }
        class='bg-orange-400 text-white w-fit px-6 py-1 mx-auto rounded-md'
      >
        Sign out
      </Button>
    </Flex>
  );
};

export default SignOutButton;
