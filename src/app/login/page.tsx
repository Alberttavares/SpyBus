"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { loginWithEmail } from "@/services/auth";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  if (authLoading) return null;
  if (user) return null;

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      await loginWithEmail(data.email, data.password);
      toast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso.",
        variant: "success",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Erro ao entrar",
        description:
          error.code === "auth/invalid-credential"
            ? "Email ou senha incorretos."
            : "Verifique suas credenciais.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:p-6 md:p-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center">
                <Logo variant="light" className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SpyBus</h1>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo ao SpyBus
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Ajude milhares de passageiros compartilhando informações em tempo
              real.
            </p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
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
                  placeholder="Sua senha"
                  {...register("password")}
                  className={errors.password ? "border-red-300 pr-10" : "pr-10"}
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Entrar <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </motion.form>

          <motion.div variants={itemVariants} className="mt-4">
            <Link href="/register">
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium"
              >
                Criar Conta
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="my-6">
            <Separator />
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
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
                Entrar com Google
              </span>
            </Button>
            <span className="absolute -top-2 -right-2 bg-warning-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              EM BREVE!
            </span>
          </motion.div>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-500 via-brand-600 to-cyber-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <Logo variant="light" className="h-32 w-auto text-white/90 mx-auto" />
          </motion.div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Mobilidade Urbana Inteligente
          </h3>
          <p className="text-white/80 text-lg max-w-md mx-auto leading-relaxed">
            Descubra onde está seu ônibus através da colaboração de outros
            passageiros. Sem GPS. Apenas a inteligência da comunidade.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { value: "+1K", label: "Usuários" },
              { value: "+5K", label: "Atualizações" },
              { value: "24h", label: "Tempo Real" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
