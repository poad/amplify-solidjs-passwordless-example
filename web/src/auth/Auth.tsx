// import { Tabs } from "@kobalte/core/tabs";
import SignOutButton from './SignOutButton';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { createSignal, Match, Switch } from 'solid-js';
import { View } from "../ui/View";
import * as auth from "./hooks";
import './Auth.css'
import { Tab } from "../ui/Tab";

export function Auth() {
  const [session, { refetch }] = auth.useSession();
  const [tab, setTab] = createSignal('signIn');

  return (
    <Switch fallback={
      <View>
        <Tab tabs={[
          { id: 'signIn', name: 'Sign In', content: <SignIn onSignedIn={() => refetch()} /> },
          { id: 'signUp', name: 'Sign Up', content: <SignUp /> }
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
