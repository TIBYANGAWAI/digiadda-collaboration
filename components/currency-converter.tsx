"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, TrendingUp, RefreshCw } from "lucide-react"
import { supportedCurrencies, CurrencyService } from "@/lib/currency"

export function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1000)
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [convertedAmount, setConvertedAmount] = useState<number>(0)
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const rate = CurrencyService.getExchangeRate(fromCurrency, toCurrency)
    const converted = CurrencyService.convert(amount, fromCurrency, toCurrency)

    setExchangeRate(rate)
    setConvertedAmount(converted)
  }, [amount, fromCurrency, toCurrency])

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const refreshRates = async () => {
    await CurrencyService.updateRates()
    setLastUpdated(new Date())

    // Recalculate with new rates
    const rate = CurrencyService.getExchangeRate(fromCurrency, toCurrency)
    const converted = CurrencyService.convert(amount, fromCurrency, toCurrency)

    setExchangeRate(rate)
    setConvertedAmount(converted)
  }

  return (
    <Card className="modern-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-pink-500" />
              Currency Converter
            </CardTitle>
            <CardDescription>Convert between different currencies with live rates</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshRates}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Rates
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
            className="text-lg font-medium"
          />
        </div>

        {/* Currency Selection */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedCurrencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-muted-foreground">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedCurrencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-muted-foreground">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={swapCurrencies}>
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Conversion Result */}
        <div className="space-y-4">
          <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border">
            <div className="text-3xl font-bold gradient-text">
              {CurrencyService.formatCurrency(convertedAmount, toCurrency)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {CurrencyService.formatCurrency(amount, fromCurrency)} ={" "}
              {CurrencyService.formatCurrency(convertedAmount, toCurrency)}
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Exchange Rate</p>
              <p className="text-xs text-muted-foreground">
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              Live Rate
            </Badge>
          </div>

          {/* Last Updated */}
          <div className="text-center text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* Popular Conversions */}
        <div className="space-y-2">
          <Label>Quick Conversions</Label>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              { from: "USD", to: "EUR" },
              { from: "USD", to: "GBP" },
              { from: "EUR", to: "GBP" },
              { from: "USD", to: "JPY" },
            ].map((conversion, index) => {
              const rate = CurrencyService.getExchangeRate(conversion.from, conversion.to)
              return (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">
                    {conversion.from} → {conversion.to}
                  </span>
                  <span className="text-sm font-medium">{rate.toFixed(4)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
