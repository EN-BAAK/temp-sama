import { Loader2 } from 'lucide-react'
import React from 'react'

const PropertyImageLoading: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/20 animate-pulse">
      <Loader2 className="h-6 w-6 animate-spin text-muted" />
    </div>
  )
}

export default PropertyImageLoading