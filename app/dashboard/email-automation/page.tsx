"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { EmailAutomationManager } from "@/components/email-automation-manager"

export default function EmailAutomationPage() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Email Automation"
        description="Automate your client communications with smart email workflows"
        showSearch={false}
      />

      <div className="flex-1 p-4 md:p-8 pt-6">
        <EmailAutomationManager />
      </div>
    </div>
  )
}
