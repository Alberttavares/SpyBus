"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  TrendingUp,
  X,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTopUsers } from "@/services/firestore";
import { useAuth } from "@/contexts/AuthContext";

const medailhas = [
  <Crown key="1" className="h-5 w-5 text-yellow-500" />,
  <Medal key="2" className="h-5 w-5 text-gray-400" />,
  <Medal key="3" className="h-5 w-5 text-amber-600" />,
];

interface RankUser {
  uid: string;
  name: string;
  photo: string | null;
  score: number;
}

export function RankingDialog() {
  const { userData } = useAuth();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<RankUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getTopUsers(20)
        .then((data) => {
          setUsers(data as RankUser[]);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all duration-200"
      >
        <Trophy className="h-4 w-4 text-warning-500" />
        Ranking
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100">
                <Trophy className="h-5 w-5 text-warning-500" />
              </div>
              <div className="min-w-0">
                <DialogTitle>Ranking de Colaboradores</DialogTitle>
                <p className="text-sm text-gray-500">
                  Os melhores colaboradores da comunidade
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-2 space-y-1 max-h-[60vh] sm:max-h-96 overflow-y-auto scrollbar-thin">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                >
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              ))
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Users className="h-10 w-10 mx-auto mb-2 text-gray-200" />
                <p>Nenhum colaborador ainda</p>
                <p className="text-sm">
                  Seja o primeiro a ganhar pontos!
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {users.map((u, index) => {
                  const isMe = u.uid === userData?.uid;
                  return (
                    <motion.div
                      key={u.uid}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        isMe
                          ? "bg-brand-50 ring-1 ring-brand-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        {index < 3 ? (
                          medailhas[index]
                        ) : (
                          <span className="text-sm font-bold text-gray-400">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.photo || undefined} />
                        <AvatarFallback className="text-xs">
                          {u.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900 truncate">
                          {u.name}
                          {isMe && (
                            <Badge
                              variant="default"
                              className="text-[10px] px-1.5 py-0"
                            >
                              Você
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {u.score} pontos
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-warning-600">
                        <TrendingUp className="h-3 w-3" />
                        {u.score}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
