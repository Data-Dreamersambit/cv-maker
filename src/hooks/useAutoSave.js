import { useState, useEffect, useRef } from 'react';
import { saveResume } from '../lib/storage';

/**
 * Custom hook to debounce and auto-save current resume changes to localStorage
 */
export function useAutoSave(resume, delay = 500) {
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'idle'
  const isFirstRender = useRef(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!resume || !resume.id) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Initial save to establish in localStorage
      saveResume(resume);
      setSaveStatus('saved');
      return;
    }

    setSaveStatus('saving');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveResume(resume);
      setSaveStatus('saved');
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resume, delay]);

  return saveStatus;
}
