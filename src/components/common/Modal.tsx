import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  title: string;
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ title, isOpen, children, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <section className="max-h-[92vh] w-full overflow-auto rounded-t-3xl bg-white p-5 shadow-soft sm:max-w-2xl sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <Button variant="ghost" className="h-10 w-10 px-0" onClick={onClose} aria-label="닫기">
            <X size={18} />
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}
