"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EstimationResult } from "@/services/estimation";

interface EstimationCardProps {
  estimation: EstimationResult;
}

export function EstimationCard({ estimation }: EstimationCardProps) {
  const confidenceConfig = {
    high: {
      label: "Alta confiabilidade",
      color: "bg-green-100 text-green-700 border-green-200",
      icon: CheckCircle2,
    },
    medium: {
      label: "Média confiabilidade",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: AlertTriangle,
    },
    low: {
      label: "Baixa confiabilidade",
      color: "bg-gray-100 text-gray-600 border-gray-200",
      icon: HelpCircle,
    },
  };

  const conf = confidenceConfig[estimation.confidence];
  const ConfIcon = conf.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-brand-500 to-cyber-500 text-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-white/80" />
              <CardTitle className="text-white text-base font-medium">
                Localização Estimada
              </CardTitle>
            </div>
            <Badge
              variant="outline"
              className={`border text-xs font-medium ${conf.color}`}
            >
              <ConfIcon className="h-3 w-3 mr-1 inline" />
              {conf.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <motion.p
            key={estimation.estimatedLocation}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl md:text-2xl font-bold text-white mt-2"
          >
            {estimation.estimatedLocation === "Nenhuma informação disponível" ? (
              <span className="flex items-center gap-2 text-white/70">
                <HelpCircle className="h-5 w-5" />
                Nenhuma informação disponível
              </span>
            ) : (
              <span className="flex items-start gap-2">
                <MapPin className="h-6 w-6 mt-1 shrink-0 text-white/70" />
                {estimation.estimatedLocation}
              </span>
            )}
          </motion.p>
          {estimation.betweenPoints &&
            estimation.fromPoint &&
            estimation.toPoint && (
              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-white/70 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-green-300" />
                  <span className="truncate max-w-[130px] sm:max-w-none">{estimation.fromPoint}</span>
                </span>
                <span className="text-white/40 shrink-0">——</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-cyber-300" />
                  <span className="truncate max-w-[130px] sm:max-w-none">{estimation.toPoint}</span>
                </span>
              </div>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
