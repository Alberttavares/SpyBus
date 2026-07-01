"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bus,
  Users,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/logo";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { LineStatusCards } from "@/components/line/LineStatusCards";
import { EstimationCard } from "@/components/line/EstimationCard";
import { ReportsTable } from "@/components/line/ReportsTable";
import { LineUpdateForm } from "@/components/line/LineUpdateForm";
import { BUS_LINES } from "@/constants/lines";
import { getPointsByLineId } from "@/constants/points";
import {
  subscribeToReports,
  subscribeToLineData,
  initializeLine,
} from "@/services/firestore";
import { estimateBusLocation } from "@/services/estimation";
import { Report } from "@/types";

export function LinePageClient() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const lineId = params.id as string;
  const line = BUS_LINES.find((l) => l.id === lineId);

  const [reports, setReports] = useState<Report[]>([]);
  const [collaborators, setCollaborators] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!line || !user) return;

    setLoading(true);
    initializeLine(lineId, line.fullName);

    const unsubReports = subscribeToReports(lineId, (newReports) => {
      setReports(newReports);
      setLoading(false);
    });

    const unsubLine = subscribeToLineData(lineId, (data) => {
      setCollaborators(data.collaborators);
      setLastUpdate(data.lastUpdate);
    });

    return () => {
      unsubReports();
      unsubLine();
    };
  }, [lineId, line, user]);

  const points = useMemo(() => getPointsByLineId(lineId), [lineId]);
  const estimation = useMemo(
    () => estimateBusLocation(reports, points),
    [reports, points]
  );

  const handleUpdateSuccess = useCallback(() => {
    toast({
      title: "Obrigado por colaborar!",
      description: "As informações foram atualizadas para todos.",
      variant: "success",
    });
  }, []);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen">
        <div className="container-main py-8 space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!line) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-main py-16 text-center">
          <Logo variant="dark" className="h-16 w-auto opacity-20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Linha não encontrada
          </h2>
          <p className="text-gray-500 mb-6">
            A linha que você procura não existe.
          </p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container-main py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 sm:mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center">
                <Logo variant="light" className="h-10 sm:h-14 w-auto" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {line.number}
                  </span>
                  <span className="text-base sm:text-lg text-gray-500 shrink-0">—</span>
                  <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                    {line.name}
                  </h1>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                    {collaborators} colaboradores
                  </span>
                  {lastUpdate && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                      Atualizado recentemente
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <EstimationCard estimation={estimation} />

            <LineStatusCards
              reports={reports}
              collaborators={collaborators}
              lastUpdate={lastUpdate}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <ReportsTable reports={reports} />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <LineUpdateForm
                  lineId={lineId}
                  onUpdateSuccess={handleUpdateSuccess}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
