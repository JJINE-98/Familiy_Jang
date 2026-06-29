import Button from './Button';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onCancel, onConfirm }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <p className="mb-6 text-sm leading-6 text-slate-600">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>취소</Button>
        <Button variant="danger" onClick={onConfirm}>삭제</Button>
      </div>
    </Modal>
  );
}
