export interface BusLine {
  id: string;
  number: string;
  name: string;
  fullName: string;
}

export interface BusPoint {
  id: string;
  name: string;
  lineIds: string[];
  order: number;
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  lineId: string;
  pointId: string;
  pointName: string;
  passou: boolean;
  entrou: boolean;
  atrasado: boolean;
  lotacao: Lotacao;
  observacao: string;
  timestamp: number;
}

export type Lotacao = "vazio" | "pouco_cheio" | "cheio" | "lotado";

export interface LineData {
  id: string;
  name: string;
  number: string;
  collaborators: number;
  lastUpdate: number | null;
  estimatedLocation: string | null;
  reports: Report[];
}

export interface UserData {
  uid: string;
  name: string;
  email: string;
  photo: string | null;
  score: number;
  createdAt: number;
}

export const LOTACAO_LABELS: Record<Lotacao, string> = {
  vazio: "Vazio",
  pouco_cheio: "Pouco Cheio",
  cheio: "Cheio",
  lotado: "Lotado",
};

export const LOTACAO_COLORS: Record<Lotacao, string> = {
  vazio: "badge-green",
  pouco_cheio: "badge-blue",
  cheio: "badge-yellow",
  lotado: "badge-red",
};
