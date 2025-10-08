import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return NextResponse.json(
        { error: "API Key o Place ID no configurados" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=es&key=${apiKey}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al obtener reseñas" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: `Google API Error: ${data.status}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      reviews: data.result.reviews || [],
      rating: data.result.rating || 0,
      user_ratings_total: data.result.user_ratings_total || 0,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
