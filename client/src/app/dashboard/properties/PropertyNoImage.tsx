import { ImageOff } from 'lucide-react'
import React from 'react'

const PropertyNoImage: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/20 text-muted">
      <ImageOff className="h-8 w-8" />
      <span className="text-xs">لا توجد صورة</span>
    </div>
  )
}

export default PropertyNoImage