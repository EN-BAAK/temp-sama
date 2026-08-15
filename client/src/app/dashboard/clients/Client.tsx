"use client"

import Avatar from '@/components/Avatar'
import { Link } from '@/libraries/components/Link'
import Button from '@/libraries/forms/components/Button'
import { DashboardClientRowProps } from '@/types/components'
import { formatBalance, handlePhoneCall } from '@/utils/helpers'
import { Edit, Eye, Trash2 } from 'lucide-react'
import React from 'react'

const Client: React.FC<DashboardClientRowProps> = ({ client, handleDelete, handleEdit, handleView, isLoading = false }) => {
  const onView = () => handleView(client.id)
  const onEdit = () => handleEdit(client.id)
  const onDelete = () => handleDelete(client.id, client.fullName)
  const onCall = () => client.phone ? handlePhoneCall(client.phone) : undefined

  return (
    <tr className="group transition-colors hover:bg-background/70">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={client.fullName} />
          <div>
            <div className="font-heading font-medium text-text">
              {client.fullName}
            </div>
            {client.phone && (
              <div dir="ltr" className="font-sans text-xs text-muted text-right">
                <Link value={client.phone} action={onCall} />
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-4 text-text">
        {client.email || '-'}
      </td>

      <td className="px-5 py-4 text-text">
        {client.city?.name || '-'}
      </td>

      <td className="px-5 py-4 font-semibold text-text" title={client.budget ? String(client.budget) : '-'} >
        {client.budget ? `${formatBalance(client.budget)}` : '-'}
      </td>

      <td className="px-5 py-4 text-left">
        <div className="flex items-center justify-end gap-1 md:opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="transparent-info"
            onClick={onView}
            icon={Eye}
            disabled={isLoading}
            aria-label="عرض التفاصيل"
            className="w-fit"
            iconClassName="w-4 h-4"
          />
          <Button
            variant="transparent-warning"
            onClick={onEdit}
            icon={Edit}
            disabled={isLoading}
            aria-label="تعديل العميل"
            className="w-fit"
            iconClassName="w-4 h-4"
          />
          <Button
            variant="transparent-danger"
            onClick={onDelete}
            icon={Trash2}
            disabled={isLoading}
            aria-label="حذف العميل"
            className="w-fit"
            iconClassName="w-4 h-4"
          />
        </div>
      </td>
    </tr>
  )
}

export default Client