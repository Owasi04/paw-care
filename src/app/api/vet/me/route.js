import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getVetServiceCategories,
  resolveVetProfile,
} from "@/app/lib/vetUtils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * The logged-in vet's own profile plus the service categories they offer.
 *
 * Separate from `GET /api/vet` (the public roster) because this is scoped to
 * the session and the dashboard needs the category list even for categories
 * with no appointments today, so the filter chips stay stable.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "vet") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { vetID, profile } = await resolveVetProfile(session);
    if (!vetID) {
      // 200 with linked:false — an unlinked account is a valid state the
      // dashboard renders an explanation for, not a request failure.
      return NextResponse.json({
        linked: false,
        vetID: null,
        profile: null,
        serviceCategories: [],
      });
    }

    const serviceCategories = await getVetServiceCategories(vetID);

    return NextResponse.json({
      linked: true,
      vetID,
      profile: {
        display_name: profile.display_name,
        type: profile.type,
        specializations: profile.specializations ?? [],
        images: profile.images ?? null,
        rating: profile.rating ?? null,
        experience_years: profile.experience_years ?? null,
      },
      serviceCategories,
    });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
