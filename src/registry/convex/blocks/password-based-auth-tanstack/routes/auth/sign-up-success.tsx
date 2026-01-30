import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-up-success")({
  component: SignUpSuccessPage,
});

function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-center">
            Account created!
          </CardTitle>
          <CardDescription className="text-center">
            Your account has been successfully created
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            You can now sign in with your email and password.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link to="/auth/login">Continue to login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
