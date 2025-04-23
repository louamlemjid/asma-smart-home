'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Home, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const { user, userData, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span className="text-lg font-semibold">Asma's Smart Home</span>
          </Link>

          {/* Right side navigation */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {user ? (
              <>
                {/* User profile */}
                <Link href="/profile">
                  <Avatar>
                    <AvatarFallback>
                      {userData?.displayName
                        ? getInitials(userData.displayName)
                        : user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                {/* Logout button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}