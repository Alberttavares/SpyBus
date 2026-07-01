"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Bus,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Report, LOTACAO_LABELS, LOTACAO_COLORS, Lotacao } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface LineStatusCardsProps {
  reports: Report[];
  collaborators: number;
  lastUpdate: number | null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function getStatusInfo(reports: Report[]) {
  if (reports.length === 0)
    return { label: "Sem informações", variant: "gray" as const, icon: Bus };

  const last = reports[0];
  if (last.entrou)
    return {
      label: "Em andamento",
      variant: "green" as const,
      icon: CheckCircle2,
    };
  if (last.passou)
    return {
      label: "Passou pelo ponto",
      variant: "cyan" as const,
      icon: Bus,
    };
  if (last.atrasado)
    return {
      label: "Atrasado",
      variant: "red" as const,
      icon: AlertTriangle,
    };
  return { label: "Operando", variant: "default" as const, icon: Bus };
}

function getLotacaoInfo(reports: Report[]): {
  label: string;
  variant: "green" | "default" | "yellow" | "red";
} {
  if (reports.length === 0)
    return { label: "Sem info", variant: "gray" as any };
  const lotacao = reports[0].lotacao;
  const map: Record<Lotacao, { label: string; variant: "green" | "default" | "yellow" | "red" }> =
    {
      vazio: { label: "Vazio", variant: "green" },
      pouco_cheio: { label: "Pouco Cheio", variant: "default" },
      cheio: { label: "Cheio", variant: "yellow" },
      lotado: { label: "Lotado", variant: "red" },
    };
  return map[lotacao] || { label: "Sem info", variant: "gray" as any };
}

export function LineStatusCards({
  reports,
  collaborators,
  lastUpdate,
}: LineStatusCardsProps) {
  const status = getStatusInfo(reports);
  const lotacao = getLotacaoInfo(reports);
  const StatusIcon = status.icon;

  const cards = [
    {
      icon: Clock,
      label: "Última atualização",
      value: lastUpdate ? formatRelativeTime(lastUpdate) : "Nenhuma",
      sub: lastUpdate ? "atrás" : "Aguardando",
      color: "text-brand-500",
      bg: "bg-brand-50",
    },
    {
      icon: status.icon,
      label: "Situação",
      value: status.label,
      badge: (
        <Badge variant={status.variant}>
          <StatusIcon className="h-3 w-3 mr-1 inline" />
          {status.label}
        </Badge>
      ),
      color: "text-cyber-500",
      bg: "bg-cyber-50",
    },
    {
      icon: Users,
      label: "Colaboradores",
      value: `${collaborators}`,
      sub: collaborators === 1 ? "pessoa" : "pessoas",
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      icon: Bus,
      label: "Lotação",
      value: "",
      badge: (
        <Badge variant={lotacao.variant}>{lotacao.label}</Badge>
      ),
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {cards.map((card, index) => (
        <motion.div key={index} variants={item}>
          <Card className="hover:shadow-md transition-all duration-200 h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.bg}`}
                >
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {card.label}
                </span>
              </div>
              <div className="ml-0">
                {card.badge ? (
                  <div className="mt-1">{card.badge}</div>
                ) : (
                  <p className="text-xl font-bold text-gray-900">
                    {card.value}
                  </p>
                )}
                {card.sub && (
                  <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
