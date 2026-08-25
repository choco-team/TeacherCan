'use client';

import { useEffect, useSyncExternalStore } from 'react';

let overrideLabel: string | null = null;
const listeners = new Set<() => void>();

export function setBreadcrumbOverride(label: string | null) {
  overrideLabel = label;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBreadcrumbOverride() {
  return useSyncExternalStore(
    subscribe,
    () => overrideLabel,
    () => null,
  );
}

export function useSetBreadcrumbOverride(label: string | null) {
  useEffect(() => {
    setBreadcrumbOverride(label);
    return () => setBreadcrumbOverride(null);
  }, [label]);
}
