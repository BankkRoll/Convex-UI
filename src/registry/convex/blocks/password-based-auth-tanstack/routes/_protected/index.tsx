import { createFileRoute, redirect } from "@tanstack/react-router";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LogoutButton } from "../../components/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_protected/")({
  component: ProtectedPage,
});

function ProtectedPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.users.current);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/20 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    throw redirect({ to: "/auth/login" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.image} alt={user?.name || "User"} />
              <AvatarFallback className="text-lg">
                {user?.name?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-xl">
                {user?.name || "Welcome!"}
              </CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You're signed in and viewing a protected page. Only authenticated
            users can see this content.
          </p>
          <LogoutButton className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
