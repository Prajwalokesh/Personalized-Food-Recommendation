import Link from "next/link";
import DesktopNavbar from "./deskTopNavbar";
import MobileNavbar from "./mobileNavbar";
import { useTheme } from "next-themes";
import Image from "next/image";
import AppLogo from "./AppLogo";

function Navbar() {
  const { theme } = useTheme();
  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto max-w-full px-4">
        <div className="flex h-16 items-center justify-between">
          <AppLogo />

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
