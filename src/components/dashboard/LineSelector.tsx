"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bus, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUS_LINES } from "@/constants/lines";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function LineSelector() {
  const router = useRouter();
  const [lastLine, setLastLine, isLoaded] = useLocalStorage("lastLine", "");

  const handleLineChange = (value: string) => {
    setLastLine(value);
    router.push(`/line/${value}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="card-elevated p-4 sm:p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
          <MapPin className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Escolha sua linha
          </h2>
          <p className="text-sm text-gray-500">
            Selecione o ônibus que você vai pegar
          </p>
        </div>
      </div>

      {isLoaded ? (
        <Select value={lastLine || undefined} onValueChange={handleLineChange}>
          <SelectTrigger className="w-full text-base">
            <div className="flex items-center gap-2">
              <Bus className="h-4 w-4 text-gray-400 shrink-0" />
              <SelectValue placeholder="Qual ônibus você vai pegar hoje?" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {BUS_LINES.map((line) => (
              <SelectItem key={line.id} value={line.id}>
                <span className="font-medium">{line.number}</span>
                <span className="text-gray-500 ml-2">— {line.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
          <Bus className="h-4 w-4 text-gray-300" />
          <span className="text-sm text-gray-300">Carregando...</span>
        </div>
      )}
    </motion.div>
  );
}
