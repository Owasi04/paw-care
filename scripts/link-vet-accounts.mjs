/**
 * One-off, idempotent migration that links vet logins to vet profiles and
 * backfills appointments with the service data the dashboard filters on.
 *
 * Run:  node --env-file=.env.local scripts/link-vet-accounts.mjs
 *
 * Safe to re-run: every write is a targeted $set of a value derived from data
 * already in the database, and documents that already match are skipped.
 */
import { MongoClient, ServerApiVersion } from "mongodb";

// The vet account that exists for testing. Everyone else gets a generated
// address so the email fallback in resolveVetProfile() has something to match.
const EMAIL_OVERRIDES = {
  "60d5ec49f1b2c8b1f8e4e8a3": "test@test.com", // Tanya Brooks, groomer
};

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

if (!uri || !dbName) {
  console.error("MONGO_URI and DB_NAME must be set (use --env-file=.env.local)");
  process.exit(1);
}

/** "Dr. James Okafor" -> "james.okafor@pawcare.com" */
function generateVetEmail(vet) {
  const local = [vet.first_name, vet.last_name]
    .filter(Boolean)
    .join(".")
    .toLowerCase()
    .replace(/[^a-z.]/g, "");
  return `${local}@pawcare.com`;
}

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

try {
  await client.connect();
  const db = client.db(dbName);
  const vets = db.collection("vet");
  const users = db.collection("users");
  const services = db.collection("services");
  const appointments = db.collection("appointments");

  // ── 1. Give every vet profile an email ──────────────────────────────────
  const allVets = await vets.find().toArray();
  let emailsSet = 0;
  for (const vet of allVets) {
    const email = EMAIL_OVERRIDES[vet._id] ?? generateVetEmail(vet);
    if (vet.email === email) continue;
    await vets.updateOne({ _id: vet._id }, { $set: { email } });
    console.log(`  vet ${vet.display_name} -> ${email}`);
    emailsSet++;
  }
  console.log(`vet emails: ${emailsSet} updated, ${allVets.length - emailsSet} already correct`);

  // ── 2. Link each vet user account to its profile via users.vetID ────────
  let linked = 0;
  for (const vet of allVets) {
    const email = EMAIL_OVERRIDES[vet._id] ?? generateVetEmail(vet);
    const user = await users.findOne({ email });
    if (!user) continue;
    if (user.vetID === vet._id && user.role === "vet") {
      console.log(`  user ${email} already linked`);
      continue;
    }
    await users.updateOne(
      { _id: user._id },
      { $set: { vetID: vet._id, role: "vet" } },
    );
    console.log(`  user ${email} -> vetID ${vet._id} (role: vet)`);
    linked++;
  }
  console.log(`user links: ${linked} updated`);

  // ── 3. Backfill appointments with serviceID / serviceCategory / vet ─────
  // Older appointments predate these fields; without serviceCategory the
  // dashboard's category chips have nothing to group on.
  const allAppointments = await appointments.find().toArray();
  let backfilled = 0;
  let unmatched = 0;
  for (const apt of allAppointments) {
    const service = apt.serviceID
      ? await services.findOne({ _id: apt.serviceID })
      : await services.findOne({ name: apt.serviceName });

    if (!service) {
      console.warn(
        `  ! no service matches "${apt.serviceName}" (appointment ${apt._id}) — skipped`,
      );
      unmatched++;
      continue;
    }

    const updates = {};
    if (apt.serviceID !== service._id) updates.serviceID = service._id;
    if (apt.serviceCategory !== service.category)
      updates.serviceCategory = service.category;
    if (!apt.vetID && service.vet?._id) updates.vetID = service.vet._id;
    if (!apt.vetName && service.vet?.name) updates.vetName = service.vet.name;

    if (Object.keys(updates).length === 0) continue;

    await appointments.updateOne({ _id: apt._id }, { $set: updates });
    console.log(`  appointment ${apt._id}: ${Object.keys(updates).join(", ")}`);
    backfilled++;
  }
  console.log(
    `appointments: ${backfilled} backfilled, ${unmatched} unmatched, ` +
      `${allAppointments.length - backfilled - unmatched} already complete`,
  );

  // ── 4. Indexes for the queries the dashboard runs ───────────────────────
  await appointments.createIndex({ vetID: 1, appointmentDate: -1 });
  await appointments.createIndex({ userMail: 1, appointmentDate: -1 });
  await vets.createIndex({ email: 1 });
  console.log("indexes ensured");

  console.log("\nDone.");
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
