import { Flex } from '../ui/Flex';

import { type JSX } from '@solidjs/web';
import { signOut } from 'aws-amplify/auth';
import { ConsoleLogger } from 'aws-amplify/utils';

export function SignOutButton(props: { onSignOut?: () => void }): JSX.Element {
  const logger = new ConsoleLogger('SignOutButton');

  return (
    <Flex>
      <button
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
        class="bg-orange-400 text-white w-fit px-6 py-1 mx-auto rounded-md"
      >
        Sign out
      </button>
    </Flex>
  );
}

export default SignOutButton;
