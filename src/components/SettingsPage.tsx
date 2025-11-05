export interface CurrencySettings {
  mainCurrency: string;
  exchangeRates: Record<string, number>;
}

interface SettingsPageProps {
  settings: CurrencySettings;
  onSettingsChange: (settings: CurrencySettings) => void;
  // onNavigateToSplit: () => void;
  // onNavigateToHistory: () => void;
}

export default function SettingsPage({
  settings,
  onSettingsChange,
  // onNavigateToSplit,
  // onNavigateToHistory,
}: SettingsPageProps) {
  const currencies: Array<string> = ["USD", "PLN", "EUR", "GBP"];

  const handleMainCurrencyChange = (currency: string) => {
    onSettingsChange({
      ...settings,
      mainCurrency: currency,
    });
  };

  const handleExchangeRateChange = (currency: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;

    onSettingsChange({
      ...settings,
      exchangeRates: {
        ...settings.exchangeRates,
        [currency]: numValue,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mx-auto flex w-full max-w-[612px] flex-col content-stretch items-start gap-5 px-4 py-5">
          <p className="font-['Roboto_Flex:Regular',sans-serif] text-[56px] leading-[normal] font-normal text-black not-italic">
            Settings
          </p>

          {/* Currencies Section */}
          <div className="max-w-[700px]">
            <p className="mb-6 font-['Roboto_Flex:Regular',sans-serif] text-[24px] leading-[normal] font-normal text-black not-italic">
              Currencies
            </p>

            {/* Main Currency */}
            <div className="mb-6 flex items-center gap-4">
              <div className="relative box-border flex w-[200px] content-stretch items-center justify-between rounded-xl p-2.5">
                <p className="relative shrink-0 font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-nowrap whitespace-pre text-black not-italic">
                  Main currency
                </p>
              </div>

              <select
                value={settings.mainCurrency}
                onChange={(e) =>
                  handleMainCurrencyChange(e.target.value as string)
                }
                className="relative box-border flex w-[120px] cursor-pointer content-stretch items-center justify-between rounded-lg border border-solid border-black bg-white p-[10px] font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-black not-italic"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            {/* Exchange Rates */}
            <div className="space-y-4">
              {currencies
                .filter((c) => c !== settings.mainCurrency)
                .map((currency) => (
                  <div key={currency} className="flex items-center gap-4">
                    <div className="relative box-border flex w-[200px] content-stretch items-center justify-between rounded-lg p-[10px]">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-lg border border-solid border-black"
                      />
                      <p className="relative shrink-0 font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-nowrap whitespace-pre text-black not-italic">
                        Exchange rate
                      </p>
                    </div>

                    <div className="relative box-border flex w-[180px] content-stretch items-center gap-2 rounded-xl p-2.5">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-xl border border-solid border-black"
                      />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={settings.exchangeRates[currency]}
                        onChange={(e) =>
                          handleExchangeRateChange(currency, e.target.value)
                        }
                        className="relative w-20 shrink-0 bg-transparent font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-black not-italic outline-none"
                      />
                      <p className="relative shrink-0 font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-nowrap whitespace-pre text-[rgba(0,0,0,0.5)] not-italic">
                        {settings.mainCurrency}
                      </p>
                    </div>

                    <div className="relative box-border flex w-[120px] content-stretch items-center justify-between rounded-xl p-2.5">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-xl border border-solid border-black"
                      />
                      <p className="relative shrink-0 font-['Roboto_Flex:Regular',sans-serif]  leading-[normal] font-normal text-nowrap whitespace-pre text-black not-italic">
                        {currency}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="mb-2 text-sm text-gray-600">
                💡 <strong>How exchange rates work:</strong>
              </p>
              <p className="text-sm text-gray-600">
                Enter how much of the main currency ({settings.mainCurrency})
                equals 1 unit of the target currency. For example, if 1 PLN =
                0.27 USD, enter 0.27 for PLN when USD is your main currency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
