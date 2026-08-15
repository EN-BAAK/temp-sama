'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileQuestion, Home, ArrowRight } from 'lucide-react';
import Button from '@/libraries/forms/components/Button';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4 font-sans text-center">
      <div className="w-full max-w-md space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary border border-primary/20">
          <FileQuestion className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="font-heading text-sm font-bold tracking-wider text-primary uppercase">
            خطأ 404
          </span>
          <h1 className="font-heading text-2xl font-bold text-text sm:text-3xl">
            الصفحة غير موجودة
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            عذراً، الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها إلى عنوان آخر.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="transparent"
            onClick={() => router.back()}
            icon={ArrowRight}
            className="w-full sm:w-auto"
            label='الرجوع للخلف' />


          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="primary"
              icon={Home}
              className="w-full sm:w-auto"
              label='الصفحة الرئيسية'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;