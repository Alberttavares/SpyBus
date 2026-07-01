"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Users,
  MapPin,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createReport, updateUserScore } from "@/services/firestore";
import { getPointsByLineId } from "@/constants/points";
import { Lotacao } from "@/types";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  pointId: z.string().min(1, "Selecione o ponto onde você está"),
  passou: z.boolean(),
  entrou: z.boolean(),
  atrasado: z.boolean(),
  lotacao: z.enum(["vazio", "pouco_cheio", "cheio", "lotado"]),
  observacao: z.string().max(200, "Máximo de 200 caracteres").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface LineUpdateFormProps {
  lineId: string;
  onUpdateSuccess?: () => void;
}

const lotacaoOptions: { value: Lotacao; label: string; icon: string }[] = [
  { value: "vazio", label: "Vazio", icon: "🟢" },
  { value: "pouco_cheio", label: "Pouco Cheio", icon: "🔵" },
  { value: "cheio", label: "Cheio", icon: "🟡" },
  { value: "lotado", label: "Lotado", icon: "🔴" },
];

const points = getPointsByLineId;

export function LineUpdateForm({ lineId, onUpdateSuccess }: LineUpdateFormProps) {
  const { user, userData, refreshUserData } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPoints, setShowPoints] = useState(false);

  const linePoints = useMemo(() => getPointsByLineId(lineId), [lineId]);

  const filteredPoints = useMemo(
    () =>
      linePoints.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [linePoints, searchTerm]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passou: false,
      entrou: false,
      atrasado: false,
      lotacao: "pouco_cheio",
      pointId: "",
      observacao: "",
    },
  });

  const selectedPointId = watch("pointId");

  const selectedPointName = linePoints.find(
    (p) => p.id === selectedPointId
  )?.name;

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!user || !userData) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para atualizar.",
          variant: "error",
        });
        return;
      }

      setSubmitting(true);
      try {
        await createReport({
          userId: user.uid,
          userName: userData.name,
          userPhoto: userData.photo,
          lineId,
          pointId: data.pointId,
          pointName:
            linePoints.find((p) => p.id === data.pointId)?.name || "",
          passou: data.passou,
          entrou: data.entrou,
          atrasado: data.atrasado,
          lotacao: data.lotacao,
          observacao: data.observacao || "",
        });

        await updateUserScore(user.uid, 10);
        await refreshUserData();

        toast({
          title: "Atualização enviada!",
          description: "Você ganhou +10 pontos. Obrigado por colaborar!",
          variant: "success",
        });

        reset();
        setSearchTerm("");
        onUpdateSuccess?.();
      } catch (error) {
        toast({
          title: "Erro ao enviar",
          description: "Tente novamente.",
          variant: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [user, userData, lineId, linePoints, reset, onUpdateSuccess, refreshUserData]
  );

  const ToggleBtn = ({
    field,
    label,
    iconOn,
    iconOff,
  }: {
    field: "passou" | "entrou" | "atrasado";
    label: string;
    iconOn: React.ReactNode;
    iconOff: React.ReactNode;
  }) => (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={() => setValue(field, !watch(field), { shouldDirty: true })}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
        watch(field)
          ? "bg-brand-50 border-brand-200 text-brand-700 shadow-sm"
          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
      )}
    >
      {watch(field) ? iconOn : iconOff}
      {label}
    </motion.button>
  );

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-brand-50 to-cyber-50 border-b border-brand-100/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
            <Send className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <CardTitle>Atualizar Informações</CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">
              Compartilhe onde o ônibus está agora
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              O ônibus já passou?
            </Label>
            <div className="flex gap-2 flex-wrap">
              <ToggleBtn field="passou" label="Sim, passou" iconOn={<CheckCircle2 className="h-4 w-4" />} iconOff={<ThumbsUp className="h-4 w-4" />} />
              <ToggleBtn field="entrou" label="Sim, entrei" iconOn={<CheckCircle2 className="h-4 w-4" />} iconOff={<Users className="h-4 w-4" />} />
              <ToggleBtn field="atrasado" label="Está atrasado" iconOn={<AlertTriangle className="h-4 w-4" />} iconOff={<ThumbsDown className="h-4 w-4" />} />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Como está a lotação?
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {lotacaoOptions.map((opt) => (
                <motion.button
                  key={opt.value}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setValue("lotacao", opt.value, { shouldDirty: true })
                  }
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                    watch("lotacao") === opt.value
                      ? "bg-brand-50 border-brand-200 text-brand-700 shadow-sm ring-1 ring-brand-200"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  )}
                >
                  <span>{opt.icon}</span>
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Em qual ponto você está? <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="flex items-center border border-gray-200 rounded-xl bg-white px-4 py-2.5 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all duration-200">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Digite o nome do ponto..."
                  value={
                    selectedPointName
                      ? selectedPointName
                      : searchTerm
                  }
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowPoints(true);
                    if (selectedPointId) {
                      setValue("pointId", "");
                    }
                  }}
                  onFocus={() => setShowPoints(true)}
                  className="w-full bg-transparent text-base sm:text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>

              {showPoints && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg"
                >
                  {filteredPoints.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      Nenhum ponto encontrado
                    </div>
                  ) : (
                    filteredPoints.map((point) => (
                      <button
                        key={point.id}
                        type="button"
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-brand-50",
                          selectedPointId === point.id
                            ? "bg-brand-50 text-brand-700 font-medium"
                            : "text-gray-700"
                        )}
                        onClick={() => {
                          setValue("pointId", point.id, {
                            shouldDirty: true,
                          });
                          setSearchTerm(point.name);
                          setShowPoints(false);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          {point.name}
                        </span>
                      </button>
                    ))
                  )}
                </motion.div>
              )}

              {errors.pointId && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.pointId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Observação <span className="text-gray-400">(opcional)</span>
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                {...register("observacao")}
                placeholder="Ex: Motorista está devagar hoje..."
                className="w-full min-h-[80px] rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-base sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-200 resize-none"
                maxLength={200}
              />
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-brand-500 to-cyber-500 hover:from-brand-600 hover:to-cyber-600"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Compartilhar Atualização
                </span>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
