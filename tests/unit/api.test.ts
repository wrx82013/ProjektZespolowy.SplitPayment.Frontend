import {
  createSplitPayment,
  fetchHistoryCalculations,
  getSplitPayment,
  syncHistoryCalculations,
  validateSplitPayment,
} from "@/lib/api";
import { SplitType } from "@/types/api";
import type { HistoryCalculation } from "@/types/history";
import { vi } from "vitest";

const buildMockResponse = (
  ok: boolean,
  jsonData: any,
  status = 200,
): Response =>
  ({
    ok,
    status,
    json: vi.fn().mockResolvedValue(jsonData),
  }) as unknown as Response;

const mockFetch = (response: Response) => {
  const fetchMock = vi.fn().mockResolvedValue(response);
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
};

describe("API client helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const requestPayload = {
    totalAmount: 100,
    currency: "PLN",
    splitType: SplitType.Percentage,
    description: "Dinner",
    users: [],
  };

  test("createSplitPayment posts data to proxy route", async () => {
    const serverResponse = {
      requestId: "abc",
      totalAmount: 100,
      currency: "PLN",
      splitType: SplitType.Percentage,
      description: "Dinner",
      status: 0,
      createdAt: new Date().toISOString(),
      userPayments: [],
    };
    const fetchSpy = mockFetch(buildMockResponse(true, serverResponse));

    const result = await createSplitPayment(requestPayload);

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/SplitPayment",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(result).toEqual(serverResponse);
  });

  test("createSplitPayment throws when server responds with error", async () => {
    mockFetch(
      buildMockResponse(false, { message: "Failed to create split payment" }, 500),
    );

    await expect(createSplitPayment(requestPayload)).rejects.toThrow(
      "Failed to create split payment",
    );
  });

  test("getSplitPayment fetches by id", async () => {
    const serverResponse = { requestId: "abc" };
    const fetchSpy = mockFetch(buildMockResponse(true, serverResponse));

    const result = await getSplitPayment("abc");

    expect(fetchSpy).toHaveBeenCalledWith("/api/SplitPayment?id=abc");
    expect(result).toEqual(serverResponse);
  });

  test("getSplitPayment throws when id not found", async () => {
    mockFetch(buildMockResponse(false, { message: "Not found" }, 404));

    await expect(getSplitPayment("missing")).rejects.toThrow("Not found");
  });

  test("validateSplitPayment resolves on success", async () => {
    mockFetch(buildMockResponse(true, { success: true }));
    await expect(validateSplitPayment(requestPayload)).resolves.toBeUndefined();
  });

  test("validateSplitPayment throws aggregated errors", async () => {
    mockFetch(buildMockResponse(false, { errors: ["User missing"] }, 400));

    await expect(validateSplitPayment(requestPayload)).rejects.toThrow(
      "User missing",
    );
  });

  test("fetchHistoryCalculations returns parsed history", async () => {
    const history: HistoryCalculation[] = [
      {
        id: "1",
        title: "Test",
        items: [],
        homies: [],
        total: "0 PLN",
        timestamp: Date.now(),
      },
    ];
    const fetchSpy = mockFetch(buildMockResponse(true, history));

    const result = await fetchHistoryCalculations();

    expect(fetchSpy).toHaveBeenCalledWith("/api/history");
    expect(result).toEqual(history);
  });

  test("fetchHistoryCalculations throws on server error", async () => {
    mockFetch(buildMockResponse(false, { message: "boom" }, 500));

    await expect(fetchHistoryCalculations()).rejects.toThrow("boom");
  });

  test("syncHistoryCalculations posts the full list", async () => {
    const payload: HistoryCalculation[] = [];
    const fetchSpy = mockFetch(buildMockResponse(true, { success: true }));

    await expect(syncHistoryCalculations(payload)).resolves.toBeUndefined();

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/history",
      expect.objectContaining({
        method: "POST",
      }),
    );

    const body = (fetchSpy.mock.calls[0]?.[1] as RequestInit)?.body as string;
    expect(JSON.parse(body)).toEqual({ calculations: payload });
  });

  test("syncHistoryCalculations throws when backend fails", async () => {
    mockFetch(buildMockResponse(false, { message: "persist error" }, 500));

    await expect(syncHistoryCalculations([])).rejects.toThrow("persist error");
  });
});
