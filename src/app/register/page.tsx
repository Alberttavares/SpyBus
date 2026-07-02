"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, UserPlus } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { registerWithEmail } from "@/services/auth";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  if (authLoading) return null;
  if (user) return null;

  const onSubmit = async (data: RegisterData) => {
    setLoading(true);
    try {
      await registerWithEmail(data.name, data.email, data.password);
      toast({
        title: "Conta criada!",
        description: "Bem-vindo ao SpyBus!",
        variant: "success",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description:
          error.code === "auth/email-already-in-use"
            ? "Este email já está em uso."
            : "Verifique os dados e tente novamente.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-cyber-600 via-brand-600 to-brand-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <UserPlus className="h-32 w-32 text-white/90 mx-auto" />
          </motion.div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Junte-se à Comunidade
          </h3>
          <p className="text-white/80 text-lg max-w-md mx-auto leading-relaxed">
            Ao criar uma conta, você pode compartilhar informações e ajudar
            outros passageiros a saberem onde o ônibus está.
          </p>
          <div className="mt-10 space-y-4 max-w-sm mx-auto">
            {[
              "Compartilhe a localização do ônibus",
              "Ganhe pontos e suba no ranking",
              "Receba atualizações em tempo real",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <div className="h-2 w-2 rounded-full bg-cyan-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center">
                <Logo variant="light" className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SpyBus</h1>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Criar Conta
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Comece a colaborar com a comunidade.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                {...register("name")}
                className={errors.name ? "border-red-300" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className={errors.email ? "border-red-300" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  {...register("password")}
                  className={
                    errors.password ? "border-red-300 pr-10" : "pr-10"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Repita a senha"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-300" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Criar Conta <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full h-12 text-base">
                Já tenho conta
              </Button>
            </Link>
          </div>

          <div className="my-6">
            <Separator />
          </div>

          <div className="relative">
            <Button
              disabled
              variant="google"
              className="w-full h-12 text-base font-medium opacity-60 cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Criar com Google
              </span>
            </Button>
            <span className="absolute -top-2 -right-2 bg-warning-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              EM BREVE!
            </span>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Ao criar uma conta, você concorda com nossos Termos de Uso.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
