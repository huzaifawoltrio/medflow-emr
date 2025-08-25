"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Settings, LogOut, User, Menu } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getUserDetails } from "@/app/redux/features/auth/authActions";
import { logout } from "@/app/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";

/**
 * The top navigation bar for the dashboard.
 * It includes a mobile menu trigger, search bar, and user profile menu.
 * It adapts its layout for different screen sizes.
 * @param {object} props - The component props.
 * @param {() => void} props.onSidebarOpen - Function to call when the mobile menu is clicked.
 */
export function Header({ onSidebarOpen }: { onSidebarOpen: () => void }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if there is a token but no user details, then fetch them
    if (accessToken && !user?.first_name) {
      dispatch(getUserDetails());
    }
  }, [accessToken, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const getInitials = () => {
    if (user && user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`;
    }
    return "U";
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Left side: Contains the mobile menu trigger and the search bar */}
      <div className="flex items-center space-x-2">
        {/* Hamburger Menu Button: Only visible on screens smaller than 'md' (768px) */}
        <Button
          onClick={onSidebarOpen}
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Search Bar: Hidden on extra-small screens to save space */}
        <div className="hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients..."
              className="pl-10 bg-gray-50 border-gray-200 w-full max-w-xs"
            />
          </div>
        </div>
      </div>

      {/* Right side: Contains actions, notifications, and the user menu */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notifications Button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
            3
          </Badge>
        </Button>

        {/* User Profile Menu */}
        <div className="flex items-center space-x-3">
          {/* User Info: Hidden on smaller screens */}
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.username || "Loading..."}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role || ""}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={
                      user?.profile_picture_url ||
                      "/placeholder.svg?height=32&width=32"
                    }
                    alt={user?.username || "User"}
                  />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.username || "Loading..."}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "..."}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
