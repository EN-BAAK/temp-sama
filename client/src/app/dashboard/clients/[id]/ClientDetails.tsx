"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, DollarSign, Edit } from "lucide-react";
import { DashboardClientDetailsProps } from "@/types/components";
import { formatBalance, handlePhoneCall } from "@/utils/helpers";
import Button from "@/libraries/forms/components/Button";
import Avatar from "@/components/Avatar";

export const ClientDetails: React.FC<DashboardClientDetailsProps> = ({ client }) => {
  const contactInfo = [
    { Icon: Phone, val: client.phone },
    { Icon: Mail, val: client.email },
    { Icon: MapPin, val: client.city?.name },
    {
      Icon: DollarSign,
      val: client.budget ? `${formatBalance(client.budget)}` : "غير محدد",
      title: client.budget ? String(client.budget) : undefined
    },
  ];

  const onCall = () => client.phone ? handlePhoneCall(client.phone) : undefined;

  return (
    <div className="rounded-xl border border-border bg-reversed p-6 shadow-sm">
      <div>
        <div className="mb-5 text-center">
          <div className="flex items-center justify-center">
            <Avatar name={client.fullName} className="w-15 h-15 text-[18px]" />
          </div>
          <h2 className="mt-3 font-heading text-lg font-bold text-text">
            {client.fullName}
          </h2>
        </div>

        <div className="space-y-3 font-sans">
          {contactInfo.map(({ Icon, val, title }) => {
            if (!val) return null;
            else return (
              <div key={val} className="flex items-center gap-3 text-sm text-text" title={title}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background">
                  <Icon className="h-3.5 w-3.5 text-muted" />
                </div>
                <span>{val}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 space-y-2 font-heading">
        {client.phone && <Button
          type="button"
          onClick={onCall}
          variant="primary"
          icon={Phone}
          className="text-sm"
          iconClassName="h-4 w-4"
          label="اتصال"
        />}

        <Link
          href={`/dashboard/clients/edit/${client.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-text transition-colors hover:bg-muted/10"
        >
          <Edit className="h-4 w-4" />
          <span>تعديل</span>
        </Link>
      </div>
    </div>
  );
};