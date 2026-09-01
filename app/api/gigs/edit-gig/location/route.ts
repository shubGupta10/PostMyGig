import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const query = req.nextUrl.searchParams.get("q")?.trim();
        if(!query){
            return NextResponse.json({
                message: "Query is not provided"
            }, {status: 400})
        }

        const apiKey = process.env.GEOAPIFY_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                message: "Location search is not configured"
            }, { status: 500 });
        }

        const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
        url.searchParams.set("text", query);
        url.searchParams.set("limit", "5");
        url.searchParams.set("apiKey", apiKey);

        const response = await fetch(url.toString());
        if(!response.ok){
            return NextResponse.json({
                message: "Failed to provide location"
            }, {status: 400})
        }

        const data = await response.json();
        const suggestions = (data.features || []).map((feature: any) => ({
            id: feature.properties?.place_id || `${feature.properties?.lat}-${feature.properties?.lon}`,
            label: feature.properties?.formatted,
        }));

        return NextResponse.json({ suggestions });
    } catch (error: any) {
        console.error("Failed to provide location", error.message)
        return NextResponse.json({
            message: "Server not responding"
        }, {status: 500})
    }
}