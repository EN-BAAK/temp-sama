"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DashboardCityRowProps } from "@/types/components";
import Button from "@/libraries/forms/components/Button";

export const City: React.FC<DashboardCityRowProps> = ({
  city,
  handleEdit,
  handleDelete,
  isLoading = false,
}) => {
  const onEdit = () => handleEdit(city)
  const onDelete = () => handleDelete(city.id, city.name)

  return (
    <tr className="border-b border-border/60 transition-colors hover:bg-muted/10">
      <td className="px-4 py-3 font-mono text-xs text-muted">
        #{city.id}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-text">
        {city.name}
      </td>
      <td className="px-4 py-3 text-left">
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            onClick={onEdit}
            disabled={isLoading}
            icon={Pencil}
            iconClassName="w-4 h-4"
            className="w-fit"
            variant="transparent-warning"
          />

          <Button
            type="button"
            disabled={isLoading}
            onClick={onDelete}
            icon={Trash2}
            iconClassName="w-4 h-4"
            className="w-fit"
            variant="transparent-danger"
          />
        </div>
      </td>
    </tr>
  );
};

export default City;