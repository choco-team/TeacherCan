import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from '@radix-ui/react-toast';

interface ToastMessageProps {
  message: { title: string; description: string } | null;
  onClose: () => void;
}

export function ToastMessage({ message, onClose }: ToastMessageProps) {
  return (
    <ToastProvider>
      {message && (
        <Toast
          open
          onOpenChange={onClose}
          className="bg-red-500 text-white p-4 rounded shadow-lg"
        >
          <ToastTitle>{message.title}</ToastTitle>
          <ToastDescription>{message.description}</ToastDescription>
        </Toast>
      )}
      <ToastViewport className="fixed bottom-4 right-4" />
    </ToastProvider>
  );
}
