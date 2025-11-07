
import { SplitPaymentResponseDto, UserPaymentDto } from "@/types/api";

interface PaymentDetailsProps {
  payment: SplitPaymentResponseDto;
}

export default function PaymentDetails({ payment }: PaymentDetailsProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{payment.description}</h1>
      <div className="text-xl mb-2">
        Total Amount: {payment.totalAmount} {payment.currency}
      </div>
      <div className="mb-4">Status: {payment.status}</div>

      <h2 className="text-2xl font-bold mb-2">Users</h2>
      <ul>
        {payment.userPayments?.map((user: UserPaymentDto) => (
          <li key={user.id} className="mb-2 p-2 border rounded">
            <div>
              <strong>{user.userName}</strong>
            </div>
            <div>Amount: {user.amount}</div>
            <div>Status: {user.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
