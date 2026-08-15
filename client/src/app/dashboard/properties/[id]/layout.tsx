import FileViewerProvider from '@/contexts/FileViewerProvider'
import { CommonParentProps } from '@/types/global'
import React from 'react'

const PropertyDetailsLayout: React.FC<CommonParentProps> = ({ children }) => {
  return (
    <FileViewerProvider>
      {children}
    </FileViewerProvider>
  )
}

export default PropertyDetailsLayout