"use client";

import { DragEvent, useCallback, useState } from "react";

interface ReceiptDragDropProps {
  onFileDropped: (file: File) => void;
}

function createMockReceiptFile(): File {
  const content = [
    "Pizza Margherita 25.50",
    "Coca Cola 0.5L 8.00",
    "Frytki 12.00",
    "Tiramisu 14.90",
    "Zupa pomidorowa 9.50",
    "Piwo 0.5L 11.00",
    "Woda 0.5L 6.00",
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const file = new File([blob], "mock-receipt.txt", { type: "text/plain" });
  return file;
}

export default function ReceiptDragDrop({ onFileDropped }: ReceiptDragDropProps) {
  const [isOver, setIsOver] = useState(false);

  const onDragStartMock = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/x-receipt-mock", "1");
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsOver(false);

      const files = Array.from(e.dataTransfer.files || []);
      if (files.length > 0) {
        // OS file dropped
        onFileDropped(files[0]);
        return;
      }

      // App mock icon dropped
      const mockFlag = e.dataTransfer.getData("application/x-receipt-mock");
      if (mockFlag === "1") {
        onFileDropped(createMockReceiptFile());
      }
    },
    [onFileDropped],
  );

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Drag source */}
      <div className="flex items-center justify-center rounded-lg border border-dashed border-black p-4 bg-gray-50">
        <div
          draggable
          onDragStart={onDragStartMock}
          className="flex cursor-grab items-center gap-3 rounded-lg border border-solid border-black bg-white px-3 py-2 shadow-sm"
          title="Przeciągnij żeby zasymulować rachunek"
        >
          <div className="size-6 rounded bg-gray-900" />
          <span className="text-sm font-semibold text-black">Rachunek.png</span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-lg border border-dashed p-4 transition-colors ${
          isOver ? "border-custom-green bg-green-50" : "border-black bg-gray-50"
        }`}
        title="Upuść plik lub ikonę tutaj"
      >
        <p className="text-sm text-black">
          Upuść tutaj plik rachunku lub przeciągnij mock ikonę po lewej.
        </p>
      </div>
    </div>
  );
}
