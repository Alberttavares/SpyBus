import { NextResponse } from "next/server";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminDb() {
  if (!getApps().length) {
    const envKey = process.env.SERVICE_ACCOUNT_KEY;
    if (envKey) {
      const serviceAccount = JSON.parse(envKey);
      initializeApp({ credential: cert(serviceAccount) });
    } else {
      initializeApp({ projectId: "spybus-c9a04" });
    }
  }

  return getFirestore();
}

export async function GET() {
  try {
    const db = getAdminDb();

    const [usersSnap, linesSnap, reportsSnap] = await Promise.all([
      db.collection("users").count().get(),
      db
        .collection("lines")
        .where("collaborators", ">", 0)
        .count()
        .get(),
      db.collectionGroup("reports").count().get(),
    ]);

    const metrics = {
      activeUsers: usersSnap.data().count,
      reportedRows: linesSnap.data().count,
      totalUpdates: reportsSnap.data().count,
    };

    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar métricas do dashboard:", error);

    return NextResponse.json(
      { error: "Erro interno ao buscar métricas." },
      { status: 500 }
    );
  }
}
