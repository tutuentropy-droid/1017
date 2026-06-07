import { X, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'default';
}

export default function ConfirmModal({
  isOpen,
  title = '确认操作',
  message,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  type = 'default',
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-vintage-brownDark/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md vintage-card animate-fade-in-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full text-vintage-brown/60 hover:text-vintage-brown hover:bg-vintage-brown/10 transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                type === 'danger'
                  ? 'bg-vintage-brick/15 text-vintage-brick'
                  : 'bg-vintage-gold/15 text-vintage-gold'
              }`}
            >
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-vintage-brown text-xl font-semibold mb-2">
                {title}
              </h3>
              <p
                className="font-serif text-vintage-inkLight leading-relaxed"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {message}
              </p>
            </div>
          </div>

          <div className="vintage-divider my-6" />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-vintage-inkLight hover:text-vintage-brown hover:bg-vintage-brown/10 transition-colors font-medium text-center"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 ${
                type === 'danger'
                  ? 'bg-gradient-to-br from-vintage-brick to-vintage-brick/80 text-vintage-paper border border-vintage-brick/50 hover:shadow-lg hover:-translate-y-0.5'
                  : 'vintage-btn-gold'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
