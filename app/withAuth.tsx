"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { Loader2 } from "lucide-react";
import { rehydrateAuth } from "./redux/features/auth/authSlice";

// Define an enum for clear and readable state management
enum AuthStatus {
  LOADING,
  AUTHENTICATED,
  UNAUTHENTICATED,
}

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const {
      user,
      accessToken,
      loading: reduxLoading,
    } = useAppSelector((state) => state.auth);
    const [authStatus, setAuthStatus] = useState<AuthStatus>(
      AuthStatus.LOADING
    );

    useEffect(() => {
      // If a token is already in the Redux store, the user is authenticated.
      if (accessToken) {
        // If the user object is also loaded, we can check their role.
        if (user?.role) {
          if (user.role === "patient" && pathname === "/") {
            router.push("/patient-portal");
            // Keep loading until redirect is complete
            return;
          }
          // If the user has the correct role for the page, mark as authenticated.
          setAuthStatus(AuthStatus.AUTHENTICATED);
        }
        // If the user object is not yet loaded, we remain in the LOADING state,
        // which is handled by the reduxLoading check below.
        return;
      }

      // If there's no token in Redux, check localStorage.
      const localToken = localStorage.getItem("accessToken");
      if (localToken) {
        // If a token is found, rehydrate the Redux store with it.
        // The component will then re-run this effect, and the first condition (if (accessToken)) will be met.
        dispatch(rehydrateAuth());
      } else {
        // If there's no token anywhere, the user is unauthenticated.
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
        router.push("/login");
      }
    }, [accessToken, user, pathname, dispatch, router]);

    // Show a loading screen under these conditions:
    // 1. The initial auth status check is still running.
    // 2. Redux is busy with an async action (like fetching user details).
    if (authStatus === AuthStatus.LOADING || reduxLoading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
        </div>
      );
    }

    // If the user is authenticated and authorized, render the requested page.
    // Otherwise, the redirect to /login is already in progress, so we show a loader.
    return authStatus === AuthStatus.AUTHENTICATED ? (
      <WrappedComponent {...props} />
    ) : (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
      </div>
    );
  };

  return AuthComponent;
};

export default withAuth;
