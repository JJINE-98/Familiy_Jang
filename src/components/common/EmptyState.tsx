import type { ReactNode } from 'react';
import Card from './Card';

export default function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action}
    </Card>
  );
}
