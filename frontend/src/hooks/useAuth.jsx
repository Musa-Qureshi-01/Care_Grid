import { useUser, useClerk } from "@clerk/clerk-react";

export const useAuth = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut, openSignIn } = useClerk();

    return {
        user: user ? {
            id: user.id,
            name: user.fullName || user.username || "User",
            email: user.primaryEmailAddress?.emailAddress,
            imageUrl: user.imageUrl
        } : null,
        login: () => openSignIn(),
        logout: () => signOut(),
        loading: !isLoaded,
        isAuthenticated: isSignedIn
    };
};

// Deprecated: AuthProvider is no longer needed as ClerkProvider handles state
export const AuthProvider = ({ children }) => {
    return <>{children}</>;
};
