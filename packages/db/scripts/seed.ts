import { db, farmSettings, farms, members, organizations } from "@bovion/db";
import { auth } from "../../../apps/web/server/auth";

async function seed() {
  const signUpResult = await auth.api.signUpEmail({
    body: {
      email: "dev@bovion.local",
      password: "devpass123",
      name: "Dev",
    },
  });

  if (!signUpResult?.user) {
    throw new Error("signUpEmail failed");
  }

  const userId = signUpResult.user.id;

  const [org] = await db
    .insert(organizations)
    .values({
      id: crypto.randomUUID(),
      name: "Fazenda Demo",
      slug: "demo",
      createdAt: new Date(),
    })
    .returning();

  if (!org) {
    throw new Error("org insert failed");
  }

  await db.insert(members).values({
    id: crypto.randomUUID(),
    organizationId: org.id,
    userId,
    role: "owner",
    createdAt: new Date(),
  });

  const [farm] = await db
    .insert(farms)
    .values({
      organizationId: org.id,
      name: "Fazenda Demo",
      slug: "demo",
    })
    .returning();

  if (!farm) {
    throw new Error("farm insert failed");
  }

  await db.insert(farmSettings).values({
    farmId: farm.id,
    kgPerArroba: 30,
  });

  console.log("seed ok:", {
    email: "dev@bovion.local",
    password: "devpass123",
    orgSlug: "demo",
  });
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("seed failed:", err);
    process.exit(1);
  });
