'use client';

import React from 'react';
import { DashboardCityProps } from '@/types/components';
import Badge from '@/components/Badge';

const City: React.FC<DashboardCityProps> = ({ city }) => {
  return (
    <Badge
      label={city.name}
      variant='transparent'
      className='text-[10px] font-medium text-text/80'
    />
  );
};

export default City;