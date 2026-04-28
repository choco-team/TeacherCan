import { SavedPresentation } from '@/types/presentation-assistant';

const STORAGE_KEY = 'presentation-assistant-list';

export function loadPresentations(): SavedPresentation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePresentations(list: SavedPresentation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addPresentation(presentation: SavedPresentation) {
  const list = loadPresentations();
  list.unshift(presentation);
  savePresentations(list);
}

export function updatePresentation(presentation: SavedPresentation) {
  const list = loadPresentations().map((item) =>
    item.id === presentation.id ? presentation : item,
  );
  savePresentations(list);
}

export function deletePresentation(id: string) {
  const list = loadPresentations().filter((item) => item.id !== id);
  savePresentations(list);
}
