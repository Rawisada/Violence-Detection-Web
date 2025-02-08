// lib/auth.ts
import { signIn, signOut } from 'next-auth/react';

/**
 * Handles Google Sign-In via NextAuth
 */
export const handleSignIn = async (): Promise<void> => {
  await signIn('google');
};

/**
 * Handles Sign-Out via NextAuth
 */
export const handleSignOut = async (): Promise<void> => {
  await signOut();
};
