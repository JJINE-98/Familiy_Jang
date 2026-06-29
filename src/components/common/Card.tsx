import type { HTMLAttributes } from 'react';

export default function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-soft ${className}`} {...props} />;
}
