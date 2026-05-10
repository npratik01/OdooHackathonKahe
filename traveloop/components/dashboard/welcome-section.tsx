import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export async function WelcomeSection() {
  const session = await getServerSession(authOptions);
  const name = session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "Traveller";
  const firstName = name.split(" ")[0];
  const role = session?.user?.role;

  const hour = new Date().getUTCHours() + 5; // approx IST
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {greeting}, {firstName} 👋
          </h1>
          {role === "ADMIN" && (
            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400">
              Admin
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Here&apos;s what&apos;s happening with your travels today.
        </p>
      </div>

      <div className="text-muted-foreground text-sm">
        {new Date().toLocaleDateString("en", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
