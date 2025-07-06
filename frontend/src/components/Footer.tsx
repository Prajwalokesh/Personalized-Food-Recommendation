import Link from "next/link";
import { Github, Twitter, Instagram, Mail } from "lucide-react";
import AppLogo from "@/components/AppLogo";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <AppLogo size="sm" variant="minimal" />
            <p className="text-muted-foreground text-sm">
              AI-powered food analysis for people with chronic diseases. Get
              personalized safety recommendations based on your health
              conditions.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* App */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">App</h3>
            <div className="space-y-2">
              <Link
                href="/analyse"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                Analyze Food
              </Link>
              <Link
                href="/history"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                History
              </Link>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company</h3>
            <div className="space-y-2">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                About
              </Link>
              <Link
                href="/careers"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                Careers
              </Link>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Support</h3>
            <div className="space-y-2">
              <Link
                href="/help"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} NutriScan. All rights reserved.
          </p>
          <p className="text-muted-foreground mt-2 text-sm md:mt-0">
            Built with ❤️ by the NutriScan Team
          </p>
        </div>
      </div>
    </footer>
  );
}
