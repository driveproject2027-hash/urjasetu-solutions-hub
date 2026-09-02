// Auth storage - uses localStorage for session persistence
// (Previously used Lovable preview brokering, now simplified to localStorage)

export function brokeredPreviewStorage() {
  if (typeof window === 'undefined') return undefined;
  return localStorage;
}
