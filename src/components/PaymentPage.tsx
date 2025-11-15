export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto flex w-full max-w-[612px] flex-col content-stretch items-start gap-5 px-2 sm:px-4 py-5">
          <p className="font-['Roboto_Flex:Regular',sans-serif] text-3xl sm:text-4xl md:text-[56px] leading-[normal] font-normal text-black not-italic">
            Zapłać
          </p>

          {/* Center content */}
          <div className="flex w-full flex-col items-center justify-center py-10 sm:py-20">
            {/* Emoji */}
            <p className="mb-6 sm:mb-8 font-['Roboto_Flex:Regular',sans-serif] text-7xl sm:text-8xl md:text-[160px] leading-[normal] font-normal text-black not-italic">
              💰
            </p>

            {/* Message */}
            <p className="text-center font-['Roboto_Flex:Regular',sans-serif] text-xl sm:text-2xl md:text-[28px] leading-[normal] font-normal text-black not-italic px-4">
              Sorry, we&apos;re working on it...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
