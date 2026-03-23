"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-neutral-900 group-[.toaster]:border-neutral-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl',
          success: 'group-[.toaster]:!bg-green-50 group-[.toaster]:!text-green-800 group-[.toaster]:!border-green-200',
          error: 'group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-800 group-[.toaster]:!border-red-200',
          description: 'group-[.toast]:text-neutral-500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
