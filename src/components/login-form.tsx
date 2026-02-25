"use client";

import { useRole } from "@/src/components/role-context";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useI18n } from "@/src/lib/i18n";
import { useAuthStore } from "../hooks/useAuthStore";

export function LoginForm() {
  const router = useRouter();
  const { setRole } = useRole();
  const { t } = useI18n();
  const { startLogin, checkAuthToken, status, user, errorMessage } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    checkAuthToken();
  }, []);

  // Redirigir cuando el usuario esté autenticado
  useEffect(() => {
    if (status === "authenticated" && user) {
      setRole(user.role as "admin" | "coordinador" | "tutor" | "operador");
      router.push("/");
    }
  }, [status, user, router, setRole]);

  // Mostrar errores del backend
  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage);
    }
  }, [errorMessage]);

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    await startLogin({
      email: form.email,
      password: form.password,
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            {t("login.welcome")}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("login.subtitle")}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t("login.signIn")}</CardTitle>
            <CardDescription>
              {t("login.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("login.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("login.emailPlaceholder")}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("login.password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.passwordPlaceholder")}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={form.rememberMe}
                    onCheckedChange={(checked) =>
                      update("rememberMe", !!checked)
                    }
                  />
                  <Label htmlFor="remember" className="cursor-pointer">
                    {t("login.remember")}
                  </Label>
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={!form.email || !form.password}
                className="w-full h-10 text-base font-semibold"
              >
                {status === "checking" ? t("login.signing") : t("login.signIn")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
