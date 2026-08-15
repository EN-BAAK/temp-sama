import { DashboardPageLayout } from '@/types/components'
import { cn } from '@/utils/tools'
import React from 'react'

const PageLayout: React.FC<DashboardPageLayout> = ({ children, className }) => {
  return (
    <section className={cn(
      "px-1 pb-1 sm:px-2 sm:pb-2 md:px-4 md:pb-4",
      className
    )}>
      {children}
    </section>
  )
}

export default PageLayout