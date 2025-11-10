"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSplitPayment } from "@/lib/api";
import { SplitPaymentResponseDto } from "@/types/api";
import PaymentDetails from "@/components/PaymentDetails";

export default function PaymentPage() {
  const params = useParams();
  const id = params.id as string;
  const [payment, setPayment] = useState<SplitPaymentResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getSplitPayment(id)
        .then((data) => {
          setPayment(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!payment) {
    return <div>No payment data found.</div>;
  }

  return <PaymentDetails payment={payment} />;
}
