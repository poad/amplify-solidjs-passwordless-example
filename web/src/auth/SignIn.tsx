import { Button } from "@kobalte/core/button";
import { confirmSignIn, ConfirmSignInOutput, signIn, SignInOutput } from 'aws-amplify/auth';
import { JSX, createSignal } from 'solid-js';
import { Alert } from '../ui/Alert';
import { Flex } from '../ui/Flex';
import { TextInput } from "../ui/TextInput";
import { EmailInput } from "../ui/EmailInput";

export function SignIn(props: {
  onSignedIn: () => void;
  onError?: (error: Error) => void;
}): JSX.Element {

  const [email, setEmail] = createSignal<string>('');
  const [otp, setOtp] = createSignal<string>('');
  const [error, setError] = createSignal<{ message?: string }>();

  const [signInResult, setSignInResult] = createSignal<SignInOutput | ConfirmSignInOutput | undefined>();

  async function handleClickNext() {
    const input = email();
    if (input.length === 0) {
      setError(() => new Error('Email is must not be empty.'));
      return;
    }
    setError(() => undefined);
    setEmail('');

    try {
      const result = await signIn({
        username: input,
        options: {
          authFlowType: 'USER_AUTH',
          preferredChallenge: 'EMAIL_OTP',
        },
      });
      setSignInResult(() => result);
    } catch (e) {
      setError(() => e);
      props.onError?.(e as Error);
    }
  }

  async function handleClickSignIn() {
    const input = otp();
    if (input.length === 0) {
      setError(() => new Error('Confirmation Code is must not be empty.'));
      return;
    }

    setOtp('');
    setError(() => undefined);

    try {
      const result = await confirmSignIn({
        challengeResponse: input,
      });
      setSignInResult(result);
      if (result.nextStep.signInStep === 'DONE') {
        props.onSignedIn();
      }
    } catch (e) {
      setError(e);
      props.onError?.(e as Error);
    }
  }

  if (signInResult()?.nextStep.signInStep === 'DONE') {
    return <Alert variation="success">Success</Alert>;
  }

  return (
    <Flex>
      {
        signInResult()?.nextStep.signInStep !== 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE' ? (
          <>
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
          </>
        ) : (
          <>
            <TextInput
              label="One Time Password"
              id="code"
              type="text"
              value={otp()}
              onChange={(e) => setOtp(() => e.currentTarget.value)}
              required
            />
            <Button
              onClick={handleClickSignIn}
              class='bg-orange-400 text-white w-fit px-6 py-1 mx-auto rounded-md'
            >
              Sign In
            </Button>
          </>
        )
      }

      {
        error() ? <Alert variation="error">{error().message}</Alert> : <></>
      }
    </Flex>
  );
}
