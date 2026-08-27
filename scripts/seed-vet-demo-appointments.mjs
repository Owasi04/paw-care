/**
 * Demo data for verifying the vet dashboard's today + category filtering.
 *
 * Creates three appointments for Tanya Brooks (the groomer): two today in
 * different categories (Grooming and Boarding) and one tomorrow, which the
 * dashboard must exclude. Every document is tagged `demoSeed: true`.
 *
 * Seed:    node --env-file=.env.local scripts/seed-vet-demo-appointments.mjs
 * Remove:  node --env-file=.env.local scripts/seed-vet-demo-appointments.mjs --clean
 */
import { MongoClient, ServerApiVersion } from "mongodb";

const VET_ID = "60d5ec49f1b2c8b1f8e4e8a3"; // Tanya Brooks, groomer
const OWNER = { userMail: "fggnxx@gmail.com", userName: "Owasiul", userPhone: "01700000000" };

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

if (!uri || !dbName) {
  console.error("MONGO_URI and DB_NAME must be set (use --env-file=.env.local)");
  process.exit(1);
}

/** Local calendar date as "YYYY-MM-DD" — matches what the booking form writes. */
function localDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString("en-CA");
}

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

try {
  await client.connect();
  const db = client.db(dbName);
  const appointments = db.collection("appointments");
  const services = db.collection("services");

  if (process.argv.includes("--clean")) {
    const { deletedCount } = await appointments.deleteMany({ demoSeed: true });
    console.log(`Removed ${deletedCount} seeded appointment(s).`);
  } else {
    const vetServices = await services.find({ "vet._id": VET_ID }).toArray();
    const byCategory = (category) => vetServices.find((s) => s.category === category);

    const grooming = byCategory("Grooming");
    const boarding = byCategory("Boarding");
    if (!grooming || !boarding) {
      throw new Error(
        `Expected the vet to offer both Grooming and Boarding; found: ${vetServices
          .map((s) => s.category)
          .join(", ")}`,
      );
    }
    // A second grooming service for the tomorrow row, so the excluded one is
    // visibly distinct from the two that should show.
    const groomingAlt =
      vetServices.find((s) => s.category === "Grooming" && s._id !== grooming._id) ??
      grooming;

    const rows = [
      { service: grooming, date: localDate(0), time: "09:30", status: "confirmed", pet: { petName: "Mochi", petType: "Dog", petBreed: "Shiba Inu" } },
      { service: boarding, date: localDate(0), time: "14:00", status: "pending", pet: { petName: "Pepper", petType: "Cat", petBreed: "Persian" } },
      { service: groomingAlt, date: localDate(1), time: "11:00", status: "pending", pet: { petName: "Biscuit", petType: "Dog", petBreed: "Beagle" } },
    ];

    await appointments.deleteMany({ demoSeed: true }); // keep re-runs from piling up
    const docs = rows.map(({ service, date, time, status, pet }) => ({
      ...OWNER,
      ...pet,
      serviceID: service._id,
      serviceName: service.name,
      serviceCategory: service.category,
      vetID: service.vet._id,
      vetName: service.vet.name,
      appointmentDate: date,
      appointmentTime: time,
      status,
      demoSeed: true,
    }));

    const { insertedCount } = await appointments.insertMany(docs);
    console.log(`Inserted ${insertedCount} appointment(s):`);
    for (const d of docs) {
      console.log(`  ${d.appointmentDate} ${d.appointmentTime}  ${d.serviceCategory.padEnd(9)} ${d.serviceName}`);
    }
    console.log(`\nToday is ${localDate(0)} — expect 2 today, 1 excluded.`);
  }
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
