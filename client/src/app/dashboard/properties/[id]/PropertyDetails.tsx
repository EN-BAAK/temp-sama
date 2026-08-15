'use client';

import React from 'react';
import { CheckCircle, Map } from 'lucide-react';
import { PropertyFeatureEntity } from '@/types/entities';
import { useGetPropertyFeatures } from '@/features/useProperties';
import { DashboardPropertyDetailsProps } from '@/types/components';
import LeafletMap from '@/components/LeafletMap';

const PropertyDetails: React.FC<DashboardPropertyDetailsProps> = ({ property }) => {
  const { data: featuresData } = useGetPropertyFeatures(property.id);
  const features: PropertyFeatureEntity[] = featuresData?.data || [];

  const mapPosition = (() => {
    if (!property.map) return null;

    const [lat, lng] = property.map.split(",").map(Number);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return { lat, lng };
  })();

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h3 className="mb-2.5 font-heading font-semibold text-text">الوصف</h3>
        <p className="text-sm leading-8 text-muted">
          {property.desc || 'لا يوجد وصف متاح لهذا العقار.'}
        </p>
      </div>

      {features.length > 0 && (
        <div>
          <h3 className="mb-3 font-heading font-semibold text-text">المميزات</h3>
          <div className="flex flex-wrap gap-2">
            {features.map((f) => (
              <span
                key={`feature-${f.id}`}
                className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{f.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 font-heading font-semibold text-text">
          الموقع
        </h3>

        {property.location && (
          <div className="mb-3 text-xs">{property.location}</div>
        )}

        {mapPosition ? (
          <LeafletMap
            position={mapPosition}
            zoom={15}
            disabled
            onChange={() => { }}
          />
        ) : (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-border bg-background">
            <div className="text-center text-muted">
              <Map className="mx-auto mb-2 h-10 w-10 opacity-30" />

              <div className="text-sm font-medium">
                الموقع غير موضح على الخريطة
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;