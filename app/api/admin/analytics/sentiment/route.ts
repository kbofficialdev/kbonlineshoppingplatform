import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    overall_rating: 4.8,
    verified_reviews_count: 872,
    metrics: [
      { label: "Fabric Softness", score: 98, description: "100% Combed Cotton feel" },
      { label: "Fit Accuracy", score: 96, description: "Matches standard measurement chart" },
      { label: "Color Retention", score: 95, description: "Zero fading after 20 washes" },
      { label: "Stitching Strength", score: 97, description: "Reinforced twin-needle hems" },
      { label: "Price-to-Value", score: 99, description: "Rated better value than high-street brands" }
    ]
  });
}
