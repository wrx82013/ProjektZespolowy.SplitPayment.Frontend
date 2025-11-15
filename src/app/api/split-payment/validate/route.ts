import { NextRequest, NextResponse } from "next/server";
import { CreateSplitPaymentRequestDto } from "@/types/api";

const API_BASE_URL = process.env.API_BASE_URL || "http://projektzespolowy_splitpayment:5000";

export async function POST(request: NextRequest) {
  try {
    const body: CreateSplitPaymentRequestDto = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/SplitPayment/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { errors: errorData.errors || ["Validation failed"] },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error validating split payment:", error);
    return NextResponse.json(
      { errors: ["Internal server error"] },
      { status: 500 }
    );
  }
}
