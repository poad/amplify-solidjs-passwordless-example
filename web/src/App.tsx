import { confirmSignIn, ConfirmSignInOutput, signIn } from 'aws-amplify/auth';
import { createSignal, Show, type Component } from 'solid-js';
import * as auth from "./auth";

const App: Component = () => {
  const [session, {refetch}] = auth.useSession();

  const [username, setUsername] = createSignal<string>('');
  const [otp, setOtp] = createSignal<string>('');
  const [error, setError] = createSignal();

  const [signInResult, setSignInResult] = createSignal<ConfirmSignInOutput | undefined>();

  async function handleClickNext() {
    const input = username();
    if (input.length === 0) {
      return;
    }
    setUsername('');

    try {
      const result = await signIn({
        username: input,
        options: {
          authFlowType: 'USER_AUTH',
          preferredChallenge: 'EMAIL_OTP',
        },
      });
      setSignInResult(result);
    } catch (error) {
      setError(error);
    }

  }

  async function handleClickSignIn() {
    const input = otp();
    if (input.length === 0) {
      return;
    }

    setOtp('');

    try {
      const result = await confirmSignIn({
        challengeResponse: input,
      });
      setSignInResult(result);
    } catch (error) {
      setError(error);
    }
  }

  return (
    <>
      <Show
        when={(!session.loading && session().tokens) || signInResult()?.isSignedIn || signInResult()?.nextStep.signInStep === 'DONE'}
        fallback={(
          <>
            <Show
              when={signInResult()?.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE'}
              fallback={
                <>
                  <label for="username" class="pr-1">Username</label>
                  <input
                    id="username"
                    type="text"
                    class='border mr-1'
                    value={username()}
                    onInput={(e) => setUsername(e.currentTarget.value)} />
                  <button
                    onClick={handleClickNext}
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Next
                  </button>
                </>
              }
            >
              <>
                <label for="otp" class="pr-1">OTP</label>
                <input
                  id="otp"
                  type="text"
                  class='border mr-1'
                  value={otp()}
                  onInput={(e) => setOtp(e.currentTarget.value)} />
                <button
                  onClick={handleClickSignIn}
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Sign in
                </button>
              </>
            </Show>
          </>
        )}>
        <>
          <auth.SignOutButton onSignOut={() => {
            setSignInResult();
            refetch();
          }} />
        </>
      </Show>
      <Show when={error()}>
        <pre class="bg-red">
          {JSON.stringify(error(), null, 2)}
        </pre>
      </Show>
    </>
  );
};

export default App;
