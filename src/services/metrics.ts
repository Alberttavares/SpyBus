import {
  collection,
  collectionGroup,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export interface DashboardMetrics {
  activeUsers: number;
  totalUpdates: number;
  reportedRows: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [usersSnap, linesSnap, reportsSnap] = await Promise.all([
    getCountFromServer(query(collection(db, "users"))),
    getCountFromServer(
      query(collection(db, "lines"), where("collaborators", ">", 0))
    ),
    getCountFromServer(query(collectionGroup(db, "reports"))),
  ]);

  return {
    activeUsers: usersSnap.data().count,
    reportedRows: linesSnap.data().count,
    totalUpdates: reportsSnap.data().count,
  };
}
