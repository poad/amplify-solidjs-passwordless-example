import './Auth.css';
import { Alert } from '../ui/Alert.jsx';
import { Tab } from '../ui/Tab.jsx';
import { View } from '../ui/View.jsx';
import * as auth from './hooks.js';
import { SignIn } from './SignIn.jsx';
import { SignOutButton } from './SignOutButton.jsx';
import { SignUp } from './SignUp.jsx';

import { createSignal, Errored, Loading, Match, refresh, Switch } from 'solid-js';

export function Auth() {
  const session = auth.useSession();
  const [tab, setTab] = createSignal('signIn');

  return (
    <Errored
      fallback={() => (
        <View>
          <Alert variation="error">Amplify authentication configuration is unavailable.</Alert>
        </View>
      )}
    >
      <Loading fallback={<div class="mx-auto p-1 h-fit">loading...</div>}>
        <Switch
          fallback={
            <View>
              <Tab
                tabs={[
                  {
                    id: 'signIn',
                    name: 'Sign In',
                    content: <SignIn onSignedIn={() => void refresh(session)} />,
                  },
                  { id: 'signUp', name: 'Sign Up', content: <SignUp /> },
                ]}
                value={tab()}
                onChange={setTab}
              />
            </View>
          }
        >
          <Match when={session()?.tokens}>
            <div class="mx-auto p-1 h-fit">
              <SignOutButton
                onSignOut={() => {
                  void refresh(session);
                }}
              />
            </div>
          </Match>
        </Switch>
      </Loading>
    </Errored>
  );
}
