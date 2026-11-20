import { fetchAuthSession, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { createMemo } from 'solid-js';

export function useSession() {
  return createMemo(async () => await fetchAuthSession());
}

export function useCurrentUser() {
  return createMemo(async () => await getCurrentUser());
}

export function useUserAttributes() {
  return createMemo(async () => await fetchUserAttributes());
}
