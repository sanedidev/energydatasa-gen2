"use client";

import "@/app/ConfigureAmplify";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
    signIn as cognitoSignIn,
    signOut as cognitoSignOut,
    confirmSignIn,
    getCurrentUser,
    fetchUserAttributes,
} from "aws-amplify/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [booted, setBooted] = useState(false);

    // Restore session from Cognito on page load
    useEffect(() => {
        async function loadUser() {
            try {
                const cognitoUser = await getCurrentUser();
                const attributes = await fetchUserAttributes();

                setUser({
                    id: cognitoUser.userId,
                    email: attributes.email,
                    name:
                        attributes.name ||
                        attributes.email?.split("@")[0] ||
                        "User",
                });
            } catch {
                // not signed in — this is normal
                setUser(null);
            } finally {
                setBooted(true);
            }
        }

        loadUser();
    }, []);

    // REAL Cognito sign-in
    async function signIn({ email, password }) {
        let result;
        try {
            result = await cognitoSignIn({ username: email, password });
        } catch (err) {
            // Amplify can leave a stale session in storage after signOut()
            // (token-refresh race) and then refuse to sign in with
            // "There is already a signed in user." Force-clear and retry once.
            if (err.name === "UserAlreadyAuthenticatedException") {
                await cognitoSignOut();
                result = await cognitoSignIn({ username: email, password });
            } else {
                throw err;
            }
        }

        // Cognito requires a new password on first login after AdminCreateUser
        if (!result.isSignedIn && result.nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
            return { requiresNewPassword: true };
        }

        const cognitoUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        const appUser = {
            id: cognitoUser.userId,
            email: attributes.email,
            name: attributes.name || attributes.email?.split("@")[0] || "User",
        };

        setUser(appUser);
        return appUser;
    }

    // Called after signIn returns requiresNewPassword — completes the challenge
    async function completeNewPassword({ newPassword }) {
        await confirmSignIn({ challengeResponse: newPassword });

        const cognitoUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        const appUser = {
            id: cognitoUser.userId,
            email: attributes.email,
            name: attributes.name || attributes.email?.split("@")[0] || "User",
        };

        setUser(appUser);
        return appUser;
    }

    async function signOut() {
        try {
            await cognitoSignOut();
        } finally {
            setUser(null);
        }
    }

    const value = useMemo(
        () => ({
            user,
            booted,
            signIn,
            completeNewPassword,
            signOut,
            setUser,
            isAuthenticated: !!user,
        }),
        [user, booted]
    );

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) {
        throw new Error("useAuth must be used within <AuthProvider>");
    }
    return ctx;
}
