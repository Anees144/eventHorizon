
'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ThemeToggle } from './theme-toggle';
import { useUser } from '@/firebase';
import { UserNav } from './user-nav';

export function MainHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`/?${createQueryString('search', e.target.value)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Event Horizon
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-primary"
            >
              Discover
            </Link>
            <Link
              href="/dashboard/create"
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              Create Event
            </Link>
             {user && (
                <Link
                href="/dashboard"
                className="transition-colors hover:text-primary text-muted-foreground"
                >
                Dashboard
                </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events..."
                  className="w-full bg-muted pl-9 md:w-[200px] lg:w-[300px]"
                  onChange={handleSearch}
                  defaultValue={searchParams.get('search') ?? ''}
                />
              </div>
            </form>
          </div>
          <nav className="flex items-center gap-2">
            {!isUserLoading && (
                user ? <UserNav /> : (
                    <>
                        <ThemeToggle />
                        <Button variant="ghost" asChild>
                            <Link href="/login">Log In</Link>
                        </Button>
                        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                    </>
                )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
