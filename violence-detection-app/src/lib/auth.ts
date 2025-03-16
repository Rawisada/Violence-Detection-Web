import { signIn, signOut } from 'next-auth/react';

export const handleSignIn = async (): Promise<void> => {
  await signIn('google');
};

export const handleSignOut = async (): Promise<void> => {
  await signOut();
};
