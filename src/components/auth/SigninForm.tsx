"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authenticate } from "@/actions/auth.actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SigninFormSchema } from "@/models/signinForm.schema";
import Loading from "../Loading";
import { Eye, EyeOff, Sparkles } from "lucide-react";

// Demo credentials are shown as a one-click login unless explicitly disabled
// (NEXT_PUBLIC_DEMO_LOGIN=false). They must match `npm run db:seed`.
const DEMO_LOGIN_ENABLED = process.env.NEXT_PUBLIC_DEMO_LOGIN !== "false";
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@jobsync.dev";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "demo1234";

function SigninForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [errorMessage, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const login = (email: string, password: string) => {
    startTransition(async () => {
      setError("");
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      const errorResponse = await authenticate("", formData);
      if (errorResponse) {
        setError(errorResponse);
      } else {
        router.push("/dashboard");
      }
    });
  };

  const onSubmit = async (data: z.infer<typeof SigninFormSchema>) =>
    login(data.email, data.password);

  const onDemoLogin = () => {
    form.setValue("email", DEMO_EMAIL);
    form.setValue("password", DEMO_PASSWORD);
    login(DEMO_EMAIL, DEMO_PASSWORD);
  };

  return (
    <>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          // className="w-2/3 space-y-6"
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="id@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          spellCheck={false}
                          autoCorrect="off"
                          autoCapitalize="off"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loading /> : "Login"}
            </Button>
            {DEMO_LOGIN_ENABLED && (
              <>
                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={onDemoLogin}
                  className="w-full"
                >
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                  Try the demo account
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Explore with sample data — {DEMO_EMAIL} / {DEMO_PASSWORD}
                </p>
              </>
            )}
            <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage && (
                <>
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

export default SigninForm;
