import { Activity, History, HomeIcon, LogOut, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function DesktopNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleClick = () => {
    router.push("/login");
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "";
    // user.firstName and user.lastName are assumed to be available
    if (user.firstName && user.lastName) {
      return `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;
    }

    return user.email ? user.email[0].toUpperCase() : "U";
  };

  return (
    <div className="hidden items-center space-x-4 md:flex">
      <Button
        variant="ghost"
        className="hover:bg-secondary flex items-center gap-2 transition-colors duration-200"
        asChild
      >
        <Link href="/">
          <HomeIcon className="h-4 w-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="hover:bg-secondary flex items-center gap-2 transition-colors duration-200"
        asChild
      >
        <Link href="/analyse">
          <Activity className="h-4 w-4" />
          <span className="hidden lg:inline">Analyze</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="hover:bg-secondary flex items-center gap-2 transition-colors duration-200"
        asChild
      >
        <Link href="/history">
          <History className="h-4 w-4" />
          <span className="hidden lg:inline">History</span>
        </Link>
      </Button>
      {user ? (
        <>
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-8 cursor-pointer">
                <AvatarImage src={""} alt={"User"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user.firstName && user.lastName && (
                    <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                  )}
                  {user.email && (
                    <p className="text-muted-foreground truncate text-sm">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={"/"}
                  className="hover:bg-secondary focus:bg-secondary flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                }}
                className="group text-destructive data-[highlighted]:bg-destructive/90 focus:bg-destructive/10 flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 data-[highlighted]:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleClick}
          >
            Sign in
          </Button>
        </>
      )}
    </div>
  );
}
export default DesktopNavbar;
