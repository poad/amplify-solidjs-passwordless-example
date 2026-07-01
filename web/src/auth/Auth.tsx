import './Auth.css';
import { SignOutButton } from './SignOutButton.jsx';
import { SignIn } from './SignIn.jsx';
import { SignUp } from './SignUp.jsx';
import { View } from '../ui/View.jsx';
import * as auth from './hooks.js';
import { Tab } from '../ui/Tab.jsx';
import { createSignal, Match, Switch } from 'solid-js';

export function Auth() {
  const [session, { refetch }] = auth.useSession();
  const [tab, setTab] = createSignal('signIn');

  return (
    <Switch fallback={
      <View>
        <Tab tabs={[
          { id: 'signIn', name: 'Sign In', content: <SignIn onSignedIn={() => refetch()} /> },
          { id: 'signUp', name: 'Sign Up', content: <SignUp /> },
        ]} value={tab()} onChange={setTab} />
      </View>

    }>
      <Match when={session.loading}>
        <div class='mx-auto p-1 h-fit'>
          loading...
        </div>
      </Match>
      <Match when={session()?.tokens}>
        <div class='mx-auto p-1 h-fit'>
          <SignOutButton onSignOut={() => {
            refetch();
          }} />
        </div>
      </Match>
    </Switch>
  );
}
