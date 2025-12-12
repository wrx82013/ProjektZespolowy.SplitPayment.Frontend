import { NextRequest, NextResponse } from "next/server";
import {
  CreateSplitPaymentRequestDto,
  SplitPaymentResponseDto,
} from "@/types/api";

const API_BASE_URL = process.env.API_BASE_URL;
const FRONTEND_BASE_URL: string =
  process.env.NEXT_PUBLIC_FRONTEND_URL ?? "";

export async function POST(request: NextRequest) {
  try {
    const body: CreateSplitPaymentRequestDto = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/SplitPayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Frontend-Url": FRONTEND_BASE_URL,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to create split payment" },
        { status: response.status }
      );
    }

    const data: SplitPaymentResponseDto = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating split payment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Missing id parameter" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/SplitPayment/${id}`, {
      headers: {
        "X-Frontend-Url": FRONTEND_BASE_URL,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to get split payment" },
        { status: response.status }
      );
    }

    const data: SplitPaymentResponseDto = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting split payment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
