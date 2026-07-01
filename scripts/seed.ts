import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

const SERVICE_ACCOUNT_PATH = resolve(process.cwd(), ".service-account.json");
const DEFAULT_USER = {
  name: "Usuário SpyBus",
  email: "user@spybus.com",
  password: "123456",
};

async function main() {
  if (!getApps().length) {
    const serviceAccount = JSON.parse(
      readFileSync(SERVICE_ACCOUNT_PATH, "utf-8")
    );
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  const auth = getAuth();
  const db = getFirestore();

  try {
    const userRecord = await auth.getUserByEmail(DEFAULT_USER.email);
    console.log(`Usuário já existe: ${userRecord.uid}`);
    console.log(`Email: ${DEFAULT_USER.email}`);
    console.log(`Senha: ${DEFAULT_USER.password}`);
    return;
  } catch {
    // User doesn't exist, create them
  }

  const userRecord = await auth.createUser({
    displayName: DEFAULT_USER.name,
    email: DEFAULT_USER.email,
    password: DEFAULT_USER.password,
  });

  console.log(`Usuário criado no Auth: ${userRecord.uid}`);

  await db.collection("users").doc(userRecord.uid).set({
    uid: userRecord.uid,
    name: DEFAULT_USER.name,
    email: DEFAULT_USER.email,
    photo: null,
    score: 0,
    createdAt: Date.now(),
  });

  console.log(`Documento Firestore criado em users/${userRecord.uid}`);
  console.log("");
  console.log("Usuário padrão criado com sucesso!");
  console.log(`  Email: ${DEFAULT_USER.email}`);
  console.log(`  Senha: ${DEFAULT_USER.password}`);
}

main().catch((err) => {
  console.error("Erro ao criar usuário padrão:", err);
  process.exit(1);
});
