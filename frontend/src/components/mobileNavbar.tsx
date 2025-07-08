"use client";

import {
  HomeIcon,
  MenuIcon,
  UserIcon,
  LogOut,
  History,
  Brain,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AppLogo from "./AppLogo";

function MobileNavbar() {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleLoginClick = () => {
    setShowMobileMenu(false);
    router.push("/login");
  };

  return (
    <div className="z-50 flex items-center space-x-2 md:hidden">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-blue-100/50 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] border-blue-200/50 bg-white/90 px-2 backdrop-blur-sm dark:border-blue-900/50 dark:bg-slate-950/90"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 font-bold dark:text-blue-400">
              <AppLogo />
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col space-y-2">
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 font-medium transition-all duration-200 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
              asChild
            >
              <Link href="/" onClick={() => setShowMobileMenu(false)}>
                <HomeIcon className="h-5 w-5" />
                Home
              </Link>
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-3 font-medium transition-all duration-200 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  asChild
                >
                  <Link
                    href="/analyse"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Brain className="h-5 w-5" />
                    Analyze Food
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-3 font-medium transition-all duration-200 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  asChild
                >
                  <Link
                    href="/history"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <History className="h-5 w-5" />
                    Analysis History
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-3 font-medium transition-all duration-200 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  asChild
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="mt-4 flex w-full items-center justify-start gap-3 font-medium text-red-600 transition-all duration-200 hover:bg-red-500 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                    router.push("/");
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-400"
                onClick={handleLoginClick}
              >
                <UserIcon className="mr-2 h-5 w-5" />
                Sign In
              </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
