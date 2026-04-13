// app/api/search/route.ts
import { NextResponse } from "next/server";
import routes from "@/lib/routes/generated-routes.json";

// const routes: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const label = searchParams.get("label");

  const results = routes.filter((route: any) => {
    if (label && route.label !== label) return false;
    const searchText = [
      route.name,
      route.label,
      route.description,
      ...(route.keywords || []),
    ]
      .join(" ")
      .toLowerCase();
    return searchText.includes(query);
  });

  return NextResponse.json({ results });
}
