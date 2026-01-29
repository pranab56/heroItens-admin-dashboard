interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ open, onOpenChange, children, className = '' }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/20 backdrop-blur-lg">
      <div
        className="fixed inset-0 bg-black/70 animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />
      <div className={`relative z-50 w-full max-w-3xl animate-in zoom-in-95 fade-in duration-200 ${className}`}>
        {children}
      </div>
    </div>
  );
};