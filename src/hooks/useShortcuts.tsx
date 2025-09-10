import { useEffect } from 'react';

interface ShortcutHandlers {
  onSave?: () => void;
  onSaveAndNext?: () => void;
  onClear?: () => void;
  onTemplate?: () => void;
}

export const useShortcuts = (handlers: ShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Save and Next: Ctrl+Enter
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        handlers.onSaveAndNext?.();
        return;
      }

      // Template: /
      if (event.key === '/' && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement;
        // Only trigger if we're in a text input area
        if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
          event.preventDefault();
          handlers.onTemplate?.();
          return;
        }
      }

      // Clear: Escape
      if (event.key === 'Escape') {
        event.preventDefault();
        handlers.onClear?.();
        return;
      }

      // Tab navigation is handled by browser naturally
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};