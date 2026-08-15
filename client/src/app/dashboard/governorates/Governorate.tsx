import Button from "@/libraries/forms/components/Button";
import { DashboardGovernorateProps } from "@/types/components";
import { Edit, MapPin, Trash2 } from "lucide-react";
import React from "react";
import City from "./City";
import Badge from "@/components/Badge";

const Governorate: React.FC<DashboardGovernorateProps> = ({ governorate, handleDelete, handleEdit, isLoading = false, }) => {
  const onEdit = () => handleEdit(governorate.id);
  const onDelete = () => handleDelete(governorate.id, governorate.name);

  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
          
            <Badge
              variant="accent"
              className="text-xs font-semibold"
              icon={MapPin}
            />
            <div>
              <h3 className="font-heading text-base font-semibold text-text">
                {governorate.name}
              </h3>
              <p className="font-sans text-xs text-muted">
                {governorate.cities?.length || 0} مدن تابعة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="transparent-warning"
              onClick={onEdit}
              icon={Edit}
              disabled={isLoading}
              iconClassName="w-4 h-4"
              className="p-1"
              aria-label="تعديل المحافظة"
            />
            <Button
              variant="transparent-danger"
              onClick={onDelete}
              icon={Trash2}
              disabled={isLoading}
              iconClassName="w-4 h-4"
              className="p-1"
              aria-label="حذف المحافظة"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {(governorate.cities && governorate.cities.length > 0) && (
            governorate.cities.map((city) => (
              <City key={`go-${governorate.id}-city-${city.id}`} city={city} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Governorate;