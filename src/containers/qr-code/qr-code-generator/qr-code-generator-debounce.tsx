function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;

  const debouncedFunction = (...args: Parameters<T>): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };

  return debouncedFunction;
}

export default debounce;
