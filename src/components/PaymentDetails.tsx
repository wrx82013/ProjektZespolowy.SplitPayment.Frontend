import { SplitPaymentResponseDto, UserPaymentDto, UserPaymentStatus } from "@/types/api";

interface PaymentDetailsProps {
  payment: SplitPaymentResponseDto;
}

const getStatusLabel = (status: UserPaymentStatus): string => {
  switch (status) {
    case UserPaymentStatus.Pending:
      return "Pending";
    case UserPaymentStatus.Paid:
      return "Paid";
    case UserPaymentStatus.Overdue:
      return "Overdue";
    case UserPaymentStatus.Cancelled:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

const getStatusColor = (status: UserPaymentStatus): string => {
  switch (status) {
    case UserPaymentStatus.Paid:
      return "bg-custom-green text-black";
    case UserPaymentStatus.Pending:
      return "bg-yellow-100 text-yellow-800";
    case UserPaymentStatus.Overdue:
      return "bg-red-100 text-red-800";
    case UserPaymentStatus.Cancelled:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function PaymentDetails({ payment }: PaymentDetailsProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto flex w-full max-w-[612px] flex-col content-stretch items-start gap-5 px-2 sm:px-4 py-5">
          {/* Title */}
          <p className="font-['Roboto_Flex:Regular',sans-serif] text-3xl sm:text-4xl md:text-[56px] leading-[normal] font-normal text-black not-italic">
            {payment.description || "Payment Details"}
          </p>

          {/* Total Amount */}
          <div className="w-full rounded-lg bg-gray-900 p-4">
            <div className="flex items-center justify-between">
              <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green text-lg sm:text-xl">
                Total Amount
              </p>
              <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-custom-green text-lg sm:text-xl">
                {payment.totalAmount} {payment.currency}
              </p>
            </div>
          </div>

          {/* User Payments */}
          <div className="flex w-full flex-col gap-3">
            <p className="font-['Roboto_Flex:Regular',sans-serif] text-xl sm:text-2xl font-normal text-black">
              Split Details
            </p>

            {payment.userPayments?.map((user: UserPaymentDto) => (
              <div
                key={user.id}
                className="w-full rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-black text-base sm:text-lg">
                      {user.userName || "Unnamed User"}
                    </p>
                    {user.userEmail && (
                      <p className="font-['Roboto_Flex:Regular',sans-serif] text-sm text-gray-600">
                        {user.userEmail}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="font-['Roboto_Flex:Bold',sans-serif] font-bold text-black text-base sm:text-lg">
                      {user.amount.toFixed(2)} {payment.currency}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(user.status)}`}
                    >
                      {getStatusLabel(user.status)}
                    </span>
                  </div>
                </div>

                {user.percentage && (
                  <p className="mt-2 font-['Roboto_Flex:Regular',sans-serif] text-sm text-gray-600">
                    Percentage: {user.percentage}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
