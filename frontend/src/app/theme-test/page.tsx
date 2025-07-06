import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ThemeTestPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <h1 className="text-foreground mb-4 text-3xl font-bold">
                Theme Test Page
              </h1>
              <p className="text-muted-foreground">
                Test the theme switching functionality. Click the theme button
                in the navbar to switch between Light, Dark, and System themes.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Light Theme</CardTitle>
                  <CardDescription>Clean and bright interface</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    This theme provides a clean, bright interface perfect for
                    daytime use.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dark Theme</CardTitle>
                  <CardDescription>Easy on the eyes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Dark theme reduces eye strain and is perfect for low-light
                    environments.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Theme</CardTitle>
                  <CardDescription>Follows your OS preference</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Automatically switches between light and dark based on your
                    system settings.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Theme Features</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>✅ Smooth transitions between themes</li>
                <li>✅ Persistent theme selection</li>
                <li>✅ System theme respects OS preference</li>
                <li>✅ No hydration mismatch errors</li>
                <li>✅ Accessible design with proper contrast</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
