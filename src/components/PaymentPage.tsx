export default function PaymentPage() {
  return (
    <div
      className="relative min-h-screen w-full bg-white"
      data-name="Pay for splited payment"
    >
      {/* Content */}
      <div className="relative">
        {/* Title */}
        <div className="absolute top-[69px] left-[276px]">
          <p className="font-['Roboto_Flex:Regular',sans-serif] text-[56px] leading-[normal] font-normal text-nowrap whitespace-pre text-black not-italic">
            Zapłać
          </p>
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center justify-center pt-[200px] pb-[100px]">
          {/* Emoji */}
          <p className="mb-8 font-['Roboto_Flex:Regular',sans-serif] text-[160px] leading-[normal] font-normal text-nowrap whitespace-pre text-black not-italic">
            💰
          </p>

          {/* Image */}
          <div className="mb-8 h-[307px] w-[265px]">
            <img
              alt="Payment coming soon"
              className="size-full max-w-none object-cover"
              src={"imgMoney"}
            />
          </div>

          {/* Message */}
          <p className="font-['Roboto_Flex:Regular',sans-serif] text-[28px] leading-[normal] font-normal text-nowrap whitespace-pre text-black not-italic">
            Sorry, we&apos;re working on it...
          </p>
        </div>
      </div>
    </div>
  );
}
