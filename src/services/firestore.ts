import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Report, Lotacao } from "@/types";

export interface CreateReportData {
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
}

export async function createReport(data: CreateReportData): Promise<string> {
  const reportRef = await addDoc(
    collection(db, "lines", data.lineId, "reports"),
    {
      userId: data.userId,
      userName: data.userName,
      userPhoto: data.userPhoto,
      lineId: data.lineId,
      pointId: data.pointId,
      pointName: data.pointName,
      passou: data.passou,
      entrou: data.entrou,
      atrasado: data.atrasado,
      lotacao: data.lotacao,
      observacao: data.observacao,
      timestamp: Date.now(),
    }
  );

  await updateDoc(doc(db, "lines", data.lineId), {
    collaborators: increment(1),
    lastUpdate: Date.now(),
  });

  return reportRef.id;
}

export function subscribeToReports(
  lineId: string,
  callback: (reports: Report[]) => void
): Unsubscribe {
  const reportsQuery = query(
    collection(db, "lines", lineId, "reports"),
    orderBy("timestamp", "desc"),
    limit(50)
  );

  return onSnapshot(reportsQuery, (snapshot) => {
    const reports: Report[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Report[];
    callback(reports);
  });
}

export function subscribeToLineData(
  lineId: string,
  callback: (data: {
    collaborators: number;
    lastUpdate: number | null;
  }) => void
): Unsubscribe {
  return onSnapshot(doc(db, "lines", lineId), (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback({
        collaborators: data.collaborators || 0,
        lastUpdate: data.lastUpdate || null,
      });
    } else {
      callback({ collaborators: 0, lastUpdate: null });
    }
  });
}

export async function initializeLine(lineId: string, name: string) {
  const lineRef = doc(db, "lines", lineId);
  const lineDoc = await getDoc(lineRef);

  if (!lineDoc.exists()) {
    await setDoc(lineRef, {
      id: lineId,
      name,
      collaborators: 0,
      lastUpdate: null,
      estimatedLocation: null,
    });
  }
}

export async function updateUserScore(uid: string, points: number) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    score: increment(points),
  });
}

export async function getTopUsers(limitCount: number = 10) {
  const usersQuery = query(
    collection(db, "users"),
    orderBy("score", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(usersQuery);
  return snapshot.docs.map((doc) => doc.data());
}
