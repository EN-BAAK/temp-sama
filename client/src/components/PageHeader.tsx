import Button from '@/libraries/forms/components/Button'
import { PageHeaderProps } from '@/types/components'
import React from 'react'

const PageHeader: React.FC<PageHeaderProps> = ({ title, actions, sub }) => {
  return (
    <div className="p-2 md:p-4 flex items-center justify-between bg-background2">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">{title}</h1>
        {sub && <p className="mt-1 font-sans text-sm text-muted md:block hidden">{sub}</p>}
      </div>
      {(actions && actions.length > 0) &&
        <div className="flex items-center gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              label={action.label}
              icon={action.icon}
              onClick={action.onClick}
              variant={action.variant}
              reverse={action.reverse}
              iconClassName='w-4 h-4 md:w-6 md:h-6'
              className='text-xs md:text-sm rounded-sm md:rounded-md'
            />
          ))}
        </div>
      }
    </div>
  )
}

export default PageHeader