import { Button } from "@kobalte/core/button";
import { confirmSignUp, signUp } from 'aws-amplify/auth';
import { createSignal, JSX, Match, Show, Switch } from "solid-js";
import { Flex } from "../ui/Flex";
import { Alert } from "../ui/Alert";
import { EmailInput } from "../ui/EmailInput";
import { TextInput } from "../ui/TextInput";

export function SignUp(props: {
  onSignedUp?: () => void;
  onError?: (error: Error) => void;
}): JSX.Element {
  const [email, setEmail] = createSignal('');
  const [code, setCode] = createSignal('');
  const [error, setError] = createSignal<Error | undefined>();
  const [signUpNextStep, setSignUpNextStep] = createSignal<string | undefined>();

  async function handleClickNext() {
    const value = email();
    try {
      if (value.length === 0) {
        setError(() => new Error('Email is must not be empty.'));
        return;
      }

      const { nextStep } = await signUp({
        username: value,
        options: {
          userAttributes: {
            email: value,
          },
        },
      });
      setError(() => undefined);
      setSignUpNextStep(() => nextStep.signUpStep);
    } catch (e) {
      setError(() => e as Error);
      props.onError?.(e as Error);
    }
  }

  async function handleClickSignUp() {
    const value = code();
    if (value.length === 0) {
      setError(new Error('Confirmation Code is must not be empty.'));
      return;
    }
    try {
      const { nextStep: { signUpStep } } = await confirmSignUp({
        username: email(),
        confirmationCode: value,
      });
      setError(undefined);
      setSignUpNextStep(() => signUpStep);
      if (signUpStep === 'DONE') {
        setEmail('');
        setCode('');
        if (props.onSignedUp) {
          props.onSignedUp?.();
        }
      }
    } catch (e) {
      setError(() => e as Error);
      props.onError?.(e as Error);
    }
  }

  return (
    <Flex>
      <Switch>
        <Match when={signUpNextStep() === 'DONE'}>
          <Alert variation="success">Success</Alert>;
        </Match>
        <Match when={signUpNextStep() !== 'CONFIRM_SIGN_UP'}>
          <EmailInput
            value={email()}
            onChange={(value) => setEmail(() => value)}
            required
          />
          <Button
            onClick={handleClickNext}
            class='bg-orange-400 text-white w-fit px-6 py-1 mx-auto rounded-md'
          >
            Next
          </Button>
        </Match>
        <Match when={signUpNextStep() === 'CONFIRM_SIGN_UP'}>
        <TextInput
              label="Confirmation Code"
              id="code"
              type="text"
              value={code()}
              onChange={(e) => setCode(() => e.currentTarget.value)}
              required
            />
            <Button
              onClick={handleClickSignUp}
              class='bg-orange-400 text-white w-fit px-6 py-1 mx-auto rounded-md'
            >
              Create Account
            </Button>
        </Match>
      </Switch>
      <Show when={error()}>
        <Alert variation="error">{error().message}</Alert>
      </Show>
    </Flex>
  );
}
