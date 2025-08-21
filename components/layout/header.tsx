"use client";

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

/**
 * The top navigation bar for the dashboard.
 * It includes a mobile menu trigger, search bar, and user profile menu.
 * It adapts its layout for different screen sizes.
 * @param {object} props - The component props.
 * @param {() => void} props.onSidebarOpen - Function to call when the mobile menu is clicked.
 */
export function Header({ onSidebarOpen }: { onSidebarOpen: () => void }) {
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
        {/* Quick Action Button: Hidden on smaller screens for a cleaner look */}
        <Button className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700">
          Quick Action
        </Button>

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
          {/* Role Text: Hidden on smaller screens */}
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900">Role: Provider</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="Dr. Johnson"
                  />
                  <AvatarFallback>DJ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Dr. Johnson
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    provider@medflow.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
