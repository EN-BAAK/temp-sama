"use client";

import React from "react";
import { X, Users, BriefcaseBusiness } from "lucide-react";
import Button from "@/libraries/forms/components/Button";
import Entity from "./Entity";
import { useGetClientsIdentifiers } from "@/features/useClients";
import { useGetEmployeesIdentifiers } from "@/features/useEmployees";
import { formatBalance } from "@/utils/helpers";
import { DashboardSharePropertyModalProps } from "@/types/components";
import { ClientEntityIdentifier, EmployeeEntityIdentifier } from "@/types/entities";

const SharePropertyModal: React.FC<DashboardSharePropertyModalProps> = ({ property, onClose }) => {
  const { data: clientsData, isLoading: isLoadingClients, } = useGetClientsIdentifiers({});
  const { data: employeesData, isLoading: isLoadingEmployees, } = useGetEmployeesIdentifiers({});

  const clients = clientsData?.data || [];
  const employees = employeesData?.data || [];

const normalizePhone = (phone: string) => {
  let normalized = phone.replace(/\D/g, "");

  if (normalized.startsWith("0")) {
    normalized = `963${normalized.slice(1)}`;
  }

  return normalized;
};

  const buildPropertyMessage = (
    includePrice: boolean
  ): string => {
    const lines: string[] = [];

    lines.push(`العقار: ${property.title || "بدون عنوان"}`);

    if (property.category) {
      lines.push(`النوع: ${property.category}`);
    }

    if (property.location) {
      lines.push(`الموقع: ${property.location}`);
    }

    if (property.city) {
      lines.push(`المدينة: ${property.city}`);
    }

    if (property.area) {
      lines.push(`المساحة: ${property.area} م²`);
    }

    if (property.bedrooms) {
      lines.push(`غرف النوم: ${property.bedrooms}`);
    }

    if (property.bathrooms) {
      lines.push(`دورات المياه: ${property.bathrooms}`);
    }

    if (property.desc) {
      lines.push("");
      lines.push(property.desc);
    }

    if (includePrice) {
      lines.push("");
      lines.push(`السعر: ${formatBalance(property.price)}`);
    }

    return lines.join("\n");
  };

  const shareProperty = (
    phone?: string,
    includePrice: boolean = false
  ) => {
    if (!phone) return;

    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) return;

    const message = buildPropertyMessage(includePrice);

    const whatsappUrl =
      `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="sticky z-50 top-0 h-screen flex items-center inset-0 justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-bold text-text">
              مشاركة العقار
            </h2>

            <p className="mt-1 text-sm text-muted">
              اختر العميل أو الموظف الذي تريد مشاركة العقار معه
            </p>
          </div>

          <Button
            type="button"
            icon={X}
            onClick={onClose}
            variant="transparent"
            className="w-fit rounded-full p-2"
          />
        </div>

        <div className="grid max-h-[75vh] grid-cols-1 gap-5 overflow-y-auto p-5 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />

              <h3 className="font-semibold text-text">
                العملاء
              </h3>
            </div>

            {isLoadingClients ? (
              <div className="text-sm text-muted">
                جاري تحميل العملاء...
              </div>
            ) : clients.length === 0 ? (
              <div className="text-sm text-muted">
                لا يوجد عملاء
              </div>
            ) : (
              <div className="space-y-2">
                {clients.map((client: ClientEntityIdentifier) => (
                  <Entity
                    key={String(client.id)}
                    fullName={client.fullName}
                    phone={client.phone}
                    onClick={() =>
                      shareProperty(
                        client.phone,
                        false
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-4 flex items-center gap-2">
              <BriefcaseBusiness className="h-5 w-5 text-primary" />

              <h3 className="font-semibold text-text">
                الموظفون
              </h3>
            </div>

            {isLoadingEmployees ? (
              <div className="text-sm text-muted">
                جاري تحميل الموظفين...
              </div>
            ) : employees.length === 0 ? (
              <div className="text-sm text-muted">
                لا يوجد موظفون
              </div>
            ) : (
              <div className="space-y-2">
                {employees.map((employee: EmployeeEntityIdentifier) => (
                  <Entity
                    key={String(employee.id)}
                    fullName={employee.fullName}
                    phone={employee.phone}
                    onClick={() =>
                      shareProperty(
                        employee.phone,
                        true
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePropertyModal;