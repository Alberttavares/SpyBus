"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bus, Users, Share2, Target, Award, TrendingUp, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/logo";
import { Header } from "@/components/layout/Header";
import { LineSelector } from "@/components/dashboard/LineSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardMetrics } from "@/services/metrics";
const steps = [
  {
    icon: MapPin,
    title: "Escolha sua linha",
    description: "Selecione o ônibus que você vai pegar",
    color: "text-brand-500",
    bg: "bg-brand-50",
  },
  {
    icon: Users,
    title: "Veja as informações",
    description: "Descubra onde o ônibus está agora",
    color: "text-cyber-500",
    bg: "bg-cyber-50",
  },
  {
    icon: Share2,
    title: "Atualize o status",
    description: "Compartilhe onde você está",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Target,
    title: "Ajude outras pessoas",
    description: "Ganha pontos e suba no ranking",
    color: "text-warning-500",
    bg: "bg-yellow-50",
  },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {
        import("@/services/metrics").then(({ getDashboardMetrics }) =>
          getDashboardMetrics().then(setStats)
        );
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container-main py-8 space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container-main py-4 sm:py-6 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-cyber-500 shadow-lg mx-auto mb-4 sm:mb-6"
          >
            <Logo variant="light" className="h-14 w-auto sm:h-16" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Bem-vindo ao <span className="text-gradient">SpyBus</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed px-2">
            A comunidade ajuda você a descobrir onde seu ônibus está antes mesmo
            dele chegar ao ponto.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <LineSelector />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.bg}`}
                      >
                        <step.icon className={`h-7 w-7 ${step.color}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-gradient-to-br from-brand-500 to-brand-700 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-6 w-6 text-white/80" />
              </div>
              <p className="text-3xl font-bold">{stats ? stats.activeUsers : "-"}</p>
              <p className="text-white/70 text-sm mt-1">Usuários ativos</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyber-500 to-cyber-700 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-white/80" />
              </div>
              <p className="text-3xl font-bold">{stats ? stats.totalUpdates : "-"}</p>
              <p className="text-white/70 text-sm mt-1">Atualizações</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Bus className="h-6 w-6 text-white/80" />
              </div>
              <p className="text-3xl font-bold">{stats ? stats.reportedRows : "-"}</p>
              <p className="text-white/70 text-sm mt-1">Linhas com reports</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
