export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-60px)] my-0 mx-auto">
      <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-t-transparent border-primary" />
    </div>
  );
}
