// /hooks/useSignup.ts
import { useState } from "react";

interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organization:string;

}

interface UseSignupReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  signup: (payload: SignupPayload) => Promise<void>;
}

export default function useSignup(): UseSignupReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const signup = async ({ email, password, firstName, lastName, organization }: SignupPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, organization }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, signup };
}
