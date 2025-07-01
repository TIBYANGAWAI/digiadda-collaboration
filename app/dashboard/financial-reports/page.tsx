"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { FinancialReports } from "@/components/financial-reports"
import { CurrencyConverter } from "@/components/currency-converter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FinancialReportsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Financial Reports"
        description="Comprehensive financial analytics and multi-currency support"
        showSearch={false}
      />

      <div className="flex-1 p-4 md:p-8 pt-6">
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
            <TabsTrigger value="currency">Currency Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <FinancialReports />
          </TabsContent>

          <TabsContent value="currency">
            <div className="grid gap-6 lg:grid-cols-2">
              <CurrencyConverter />
              {/* Additional currency tools can be added here */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
