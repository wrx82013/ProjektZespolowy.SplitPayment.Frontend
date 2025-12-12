import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;
const FRONTEND_BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("receipt");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "A receipt file is required" },
      { status: 400 },
    );
  }

  const backendFormData = new FormData();
  backendFormData.append("receipt", file);

  const response = await fetch(`${API_BASE_URL}/api/receipt/recognize`, {
    method: "POST",
    headers: {
      "X-Frontend-Url": FRONTEND_BASE_URL,
    },
    body: backendFormData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return NextResponse.json(
      { message: errorData.message || "Failed to parse receipt" },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
