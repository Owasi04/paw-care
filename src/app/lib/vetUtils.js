import { dbConnect } from "@/app/lib/dbConnect";

/**
 * Server-side helpers for resolving a logged-in vet to their `vet` profile.
 *
 * A vet account is linked two ways:
 *   1. `users.vetID` -> `vet._id` (primary; travels on the session token)
 *   2. `vet.email`   -> `users.email` (fallback; survives a missing vetID)
 *
 * Note every `_id` in `vet` and `services` is a plain string, not an ObjectId,
 * so these lookups need no casting.
 */

/**
 * Resolve the vet profile for a session.
 * @returns {Promise<{vetID: string|null, profile: object|null}>}
 *   Both null when the account isn't linked to any vet profile.
 */
export async function resolveVetProfile(session) {
  const email = session?.user?.email;
  const sessionVetID = session?.user?.vetID;
  const vetCollection = await dbConnect("vet");

  if (sessionVetID) {
    const profile = await vetCollection.findOne({ _id: sessionVetID });
    if (profile) return { vetID: sessionVetID, profile };
  }

  // Fallback: match the login email against the vet profile's email.
  if (email) {
    const profile = await vetCollection.findOne({ email });
    if (profile) return { vetID: profile._id, profile };
  }

  return { vetID: null, profile: null };
}

/**
 * The service categories a vet actually offers, e.g. ["Boarding", "Grooming"].
 * Drives the dashboard filter chips, including ones with a zero count today.
 *
 * Uses find + dedupe rather than `distinct`: the client runs with
 * `serverApi.strict`, and `distinct` isn't in Stable API V1.
 */
export async function getVetServiceCategories(vetID) {
  if (!vetID) return [];
  const servicesCollection = await dbConnect("services");
  const docs = await servicesCollection
    .find({ "vet._id": vetID }, { projection: { category: 1, _id: 0 } })
    .toArray();
  return [...new Set(docs.map((doc) => doc.category).filter(Boolean))].sort();
}
