export interface Currency {
  code: string
  name: string
  symbol: string
  rate: number // Exchange rate to USD
}

export interface CurrencyRate {
  from: string
  to: string
  rate: number
  lastUpdated: Date
}

// Mock currency data
export const supportedCurrencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1.0 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.85 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.73 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.25 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.35 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 110.0 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.92 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 6.45 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 74.5 },
]

export class CurrencyService {
  private static rates: Map<string, number> = new Map(
    supportedCurrencies.map((currency) => [currency.code, currency.rate]),
  )

  static async updateRates(): Promise<void> {
    // In a real application, this would fetch from a currency API like:
    // - https://api.exchangerate-api.com/
    // - https://openexchangerates.org/
    // - https://fixer.io/

    console.log("Updating currency rates...")

    // Mock rate updates with small variations
    supportedCurrencies.forEach((currency) => {
      if (currency.code !== "USD") {
        const variation = (Math.random() - 0.5) * 0.02 // ±1% variation
        const newRate = currency.rate * (1 + variation)
        this.rates.set(currency.code, newRate)
      }
    })
  }

  static convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount

    const fromRate = this.rates.get(fromCurrency) || 1
    const toRate = this.rates.get(toCurrency) || 1

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate
    return usdAmount * toRate
  }

  static formatCurrency(amount: number, currencyCode: string): string {
    const currency = supportedCurrencies.find((c) => c.code === currencyCode)
    if (!currency) return `${amount.toFixed(2)} ${currencyCode}`

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  static getCurrencySymbol(currencyCode: string): string {
    const currency = supportedCurrencies.find((c) => c.code === currencyCode)
    return currency?.symbol || currencyCode
  }

  static getExchangeRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1

    const fromRate = this.rates.get(fromCurrency) || 1
    const toRate = this.rates.get(toCurrency) || 1

    return toRate / fromRate
  }
}

// Auto-update rates every hour
if (typeof window !== "undefined") {
  setInterval(
    () => {
      CurrencyService.updateRates()
    },
    60 * 60 * 1000,
  ) // 1 hour
}
