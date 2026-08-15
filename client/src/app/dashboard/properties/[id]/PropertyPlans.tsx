import { useGetPropertyPlans } from '@/features/useProperties';
import { DashboardPropertyPlansProps } from '@/types/components';
import { PropertyPlanEntity } from '@/types/entities';
import Loading from "./PropertyPlansLoading"
import React from 'react'
import PlanCard from './plan';

const PropertyPlans: React.FC<DashboardPropertyPlansProps> = ({ id }) => {
  const { data, isLoading } = useGetPropertyPlans(id);
  const plans: PropertyPlanEntity[] = data?.data || [];

  if (isLoading)
    return <Loading />

  if (plans.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 font-heading font-bold text-text">مخططات العقار</h3>
      <div className="sm:space-y-2 sm:block flex items-center gap-2">
        {plans.map((plan) => (
          <PlanCard key={`plan-${plan.id}`} plan={plan} />
        ))}
      </div>
    </div>
  );
}

export default PropertyPlans