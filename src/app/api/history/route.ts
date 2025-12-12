import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { HistoryCalculation } from "@/types/history";

const HISTORY_FILE_PATH = path.join(process.cwd(), ".data", "history.json");

async function ensureHistoryFile(
  calculations: HistoryCalculation[] = [],
): Promise<void> {
  await fs.mkdir(path.dirname(HISTORY_FILE_PATH), { recursive: true });
  await fs.writeFile(
    HISTORY_FILE_PATH,
    JSON.stringify(calculations, null, 2),
    "utf-8",
  );
}

async function readHistoryFile(): Promise<HistoryCalculation[]> {
  try {
    const fileContent = await fs.readFile(HISTORY_FILE_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await ensureHistoryFile([]);
      return [];
    }
    throw error;
  }
}

export async function GET() {
  try {
    const history = await readHistoryFile();
    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to read history file", error);
    return NextResponse.json(
      { message: "Unable to fetch history" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const calculations = body?.calculations;

    if (!Array.isArray(calculations)) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 },
      );
    }

    await ensureHistoryFile(calculations);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to persist history", error);
    return NextResponse.json(
      { message: "Unable to persist history" },
      { status: 500 },
    );
  }
}
