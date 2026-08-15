import { Skeleton } from '@/libraries/components/Skeleton'
import React from 'react'

const CitiesOptionsLoading:React.FC = () => {
  return (
    <div className="flex items-end">
      <Skeleton className="h-[50px] rounded-xl" />
    </div>
  )
}

export default CitiesOptionsLoading