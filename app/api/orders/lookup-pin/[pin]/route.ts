import { NextRequest, NextResponse } from 'next/server';

const pinDatabase: Record<string, { city: string; state: string; slaDays: number }> = {
  "560038": { city: "Bengaluru", state: "Karnataka", slaDays: 2 },
  "560001": { city: "Bengaluru", state: "Karnataka", slaDays: 2 },
  "110001": { city: "New Delhi", state: "Delhi", slaDays: 3 },
  "400001": { city: "Mumbai", state: "Maharashtra", slaDays: 3 },
  "600001": { city: "Chennai", state: "Tamil Nadu", slaDays: 3 },
  "700001": { city: "Kolkata", state: "West Bengal", slaDays: 4 },
};

export async function GET(req: NextRequest, { params }: { params: { pin: string } }) {
  const pin = params.pin.trim();
  const info = pinDatabase[pin] || { city: "Bengaluru", state: "Karnataka", slaDays: 3 };
  return NextResponse.json({ success: true, ...info });
}
