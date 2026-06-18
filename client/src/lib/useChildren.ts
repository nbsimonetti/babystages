import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import type { Child, ChildInput } from '../types';

const SELECTED_KEY = 'babystages.selectedChild';

export function useChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    localStorage.getItem(SELECTED_KEY)
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { children: list } = await api.listChildren();
      // Stable order: youngest-added last; sort by birthday (oldest child first).
      list.sort((a, b) => a.birthday.localeCompare(b.birthday));
      setChildren(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load children.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const select = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) localStorage.setItem(SELECTED_KEY, id);
    else localStorage.removeItem(SELECTED_KEY);
  }, []);

  const add = useCallback(async (input: ChildInput) => {
    const { child } = await api.createChild(input);
    setChildren((prev) => [...prev, child].sort((a, b) => a.birthday.localeCompare(b.birthday)));
    return child;
  }, []);

  const update = useCallback(async (id: string, input: Partial<ChildInput>) => {
    const { child } = await api.updateChild(id, input);
    setChildren((prev) =>
      prev.map((c) => (c.id === id ? child : c)).sort((a, b) => a.birthday.localeCompare(b.birthday))
    );
    return child;
  }, []);

  const remove = useCallback(
    async (id: string) => {
      await api.deleteChild(id);
      setChildren((prev) => prev.filter((c) => c.id !== id));
      if (selectedId === id) select(null);
    },
    [selectedId, select]
  );

  const toggleObserved = useCallback(
    async (id: string, key: string, observed: boolean) => {
      // Optimistic: update UI immediately, then sync with the server.
      setChildren((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const set = new Set(c.observed || []);
          if (observed) set.add(key);
          else set.delete(key);
          return { ...c, observed: [...set] };
        })
      );
      try {
        const { child } = await api.toggleMilestone(id, key, observed);
        setChildren((prev) => prev.map((c) => (c.id === id ? child : c)));
      } catch {
        refresh(); // revert to server truth on failure
      }
    },
    [refresh]
  );

  const selected = children.find((c) => c.id === selectedId) || null;

  return {
    children,
    selected,
    selectedId,
    loading,
    error,
    refresh,
    select,
    add,
    update,
    remove,
    toggleObserved,
  };
}
