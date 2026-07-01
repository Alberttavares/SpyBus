"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, MessageSquare, HelpCircle, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Report, LOTACAO_LABELS, LOTACAO_COLORS, Lotacao } from "@/types";
import { formatTime, formatRelativeTime } from "@/lib/utils";

interface ReportsTableProps {
  reports: Report[];
}

function getStatusBadge(report: Report) {
  if (report.entrou) return { label: "Embarcou", variant: "green" as const };
  if (report.passou) return { label: "Passou", variant: "cyan" as const };
  return { label: "Ponto", variant: "default" as const };
}

export function ReportsTable({ reports }: ReportsTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-brand-500 shrink-0" />
          <CardTitle className="text-base sm:text-lg">Atualizações Recentes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <HelpCircle className="h-12 w-12 text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">
              Nenhuma atualização ainda
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Seja o primeiro a compartilhar informações!
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Horário</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Usuário</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Ponto</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Lotação</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Observação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <AnimatePresence mode="popLayout">
                    {reports.map((report, index) => {
                      const statusBadge = getStatusBadge(report);
                      const lotacaoVariant = LOTACAO_COLORS[report.lotacao] as
                        | "green" | "default" | "yellow" | "red" | "gray" | "cyan" | "outline";

                      return (
                        <motion.tr
                          key={report.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                          className="hover:bg-gray-50/50 transition-colors duration-150"
                        >
                          <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{formatTime(report.timestamp)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7 shrink-0">
                                <AvatarImage src={report.userPhoto || undefined} />
                                <AvatarFallback className="text-[10px]">
                                  {report.userName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                                {report.userName?.split(" ")[0]}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[150px] truncate">{report.pointName}</td>
                          <td className="px-5 py-3.5">
                            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge variant={lotacaoVariant}>{LOTACAO_LABELS[report.lotacao]}</Badge>
                          </td>
                          <td className="px-5 py-3.5">
                            {report.observacao ? (
                              <span className="flex items-center gap-1 text-sm text-gray-500">
                                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate max-w-[120px]">{report.observacao}</span>
                              </span>
                            ) : (
                              <span className="text-sm text-gray-300">—</span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {reports.map((report, index) => {
                  const statusBadge = getStatusBadge(report);
                  const lotacaoVariant = LOTACAO_COLORS[report.lotacao] as
                    | "green" | "default" | "yellow" | "red" | "gray" | "cyan" | "outline";

                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="p-4 space-y-2 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarImage src={report.userPhoto || undefined} />
                            <AvatarFallback className="text-[10px]">
                              {report.userName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-700">{report.userName?.split(" ")[0]}</p>
                            <p className="text-xs text-gray-400">{formatTime(report.timestamp)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant={statusBadge.variant} className="text-[10px] px-1.5 py-0">{statusBadge.label}</Badge>
                          <Badge variant={lotacaoVariant} className="text-[10px] px-1.5 py-0">{LOTACAO_LABELS[report.lotacao]}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{report.pointName}</span>
                      </div>
                      {report.observacao && (
                        <div className="flex items-start gap-1.5 text-xs text-gray-400">
                          <MessageSquare className="h-3 w-3 shrink-0 mt-0.5" />
                          <span>{report.observacao}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
