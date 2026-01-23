import { db } from "./src/db/index.js";
import { customers } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

async function checkAndSeedCustomer() {
  console.log("🔍 Checking for Customer ID 1...");
  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, 1)
  });

  if (customer) {
    console.log("✅ Customer found:", customer);
  } else {
    console.log("⚠️  Customer 1 NOT found. Creating default customer...");
    const [newCustomer] = await db.insert(customers).values({
      fullName: "Test User",
      email: "testuser@example.com",
      phone: "9876543210",
      gender: "Male"
    }).returning();
    console.log("✅ Created Customer:", newCustomer);
  }
  process.exit(0);
}

checkAndSeedCustomer().catch(console.error);
