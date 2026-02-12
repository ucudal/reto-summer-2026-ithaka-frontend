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
import React, { useState } from "react";

const roles = ["admin", "coordinador", "tutor", "operador"];

export function LoginForm() {
  const router = useRouter();
  const { setRole } = useRole();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Credenciales hardcodeadas para testing
      const validUsers: { [key: string]: { password: string; role: "admin" | "coordinador" | "tutor" | "operador" } } = {
        "admin@ithaka.com": { password: "admin123", role: "admin" },
        "coordinador@ithaka.com": { password: "coord123", role: "coordinador" },
        "tutor@ithaka.com": { password: "tutor123", role: "tutor" },
        "operador@ithaka.com": { password: "oper123", role: "operador" },
      };

      const user = validUsers[form.email];
      
      if (!user || user.password !== form.password) {
        alert("Email o contraseña inválidos");
        setLoading(false);
        return;
      }

      // Setear rol según las credenciales
      setRole(user.role);
      
      // Redirigir al dashboard
      router.push("/");
    } catch (error) {   
      console.error("Login error:", error);
      alert("Error al intentar loguearse");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to Ithaka's Backoffice
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                    Remember me
                  </Label>
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={loading || !form.email || !form.password}
                className="w-full h-10 text-base font-semibold"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
