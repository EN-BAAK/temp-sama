"use client"

import React from 'react'
import PageLayout from '../PageLayout'
import Password from './Password'
import PageHeader from '@/components/PageHeader'
import { useGetPageInfo } from '@/hooks/useHelpers'

const Page: React.FC = () => {
  const { subtitle, title } = useGetPageInfo();

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        sub={subtitle}
      />

      <PageLayout className='space-y-6'>
        <Password />
      </PageLayout>
    </div>
  )
}

export default Page