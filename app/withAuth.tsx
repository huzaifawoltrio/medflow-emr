// app/withAuth.tsx

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { Loader2 } from "lucide-react";
import { rehydrateAuth } from "./redux/features/auth/authSlice";

enum AuthStatus {
  LOADING,
  AUTHENTICATED,
  UNAUTHENTICATED,
}

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[] = [] // Add allowedRoles parameter
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
      if (accessToken) {
        if (user?.role) {
          // Role-based access control check
          if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            // Redirect if the user's role is not allowed
            router.push(user.role === "patient" ? "/patient-portal" : "/");
            return;
          }

          if (user.role === "patient" && pathname === "/") {
            router.push("/patient-portal");
            return;
          }
          setAuthStatus(AuthStatus.AUTHENTICATED);
        }
        return;
      }

      const localToken = localStorage.getItem("accessToken");
      if (localToken) {
        dispatch(rehydrateAuth());
      } else {
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
        router.push("/login");
      }
    }, [accessToken, user, pathname, dispatch, router, allowedRoles]);

    if (authStatus === AuthStatus.LOADING || reduxLoading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
        </div>
      );
    }

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
