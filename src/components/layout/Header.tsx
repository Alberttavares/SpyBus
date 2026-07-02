"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, LogOut, User, Award, Menu, X, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RankingDialog } from "@/components/dashboard/RankingDialog";
import { Logo } from "@/components/ui/logo";

export function Header() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rankingOpen, setRankingOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initials = userData?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="container-main flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="flex h-9 w-9 items-center justify-center">
              <Logo variant="dark" className="h-8 w-8" />
            </div>
            <span className="text-lg font-bold text-gray-900">SpyBus</span>
          </motion.div>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          {userData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 mr-2"
            >
              <Award className="h-4 w-4 text-warning-500" />
              <span className="text-sm font-medium text-gray-600">
                {userData.score} pts
              </span>
            </motion.div>
          )}

          <RankingDialog open={rankingOpen} onOpenChange={setRankingOpen} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback>{initials || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback>{initials || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {userData?.name || "Usuário"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {userData?.score || 0} pontos
                  </span>
                </div>
              </div>
              <DropdownMenuItem onClick={() => router.push("/")}>
                <Bus className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <button
          className="md:hidden p-3 text-gray-600 active:bg-gray-100 rounded-xl transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 bg-white md:hidden"
          >
            <div className="container-main py-4 space-y-3">
              {userData && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoURL || undefined} />
                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userData.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userData.score} pontos
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push("/");
                  setMobileMenuOpen(false);
                }}
              >
                <Bus className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setRankingOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Trophy className="mr-2 h-4 w-4 text-warning-500" />
                Ranking
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
