/**
 * Arabic Text-to-Speech utility using Web Speech API
 * with fallback voice selection for Arabic (ar-SA, ar-EG, ar).
 */

export const playArabicAudio = (
  text: string,
  rate = 0.85,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): (() => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    onError?.('Speech synthesis not supported');
    return () => {};
  }

  window.speechSynthesis.cancel();

  // Strip non-speech symbols if any
  const cleanText = text.replace(/[*_#`]/g, '').trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ar-SA';
  utterance.rate = rate; // slightly slower for language learners

  const voices = window.speechSynthesis.getVoices();
  const arabicVoice =
    voices.find((v) => v.lang.startsWith('ar') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
    voices.find((v) => v.lang.startsWith('ar')) ||
    null;

  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = (e) => {
    console.warn('TTS Error:', e);
    onError?.(e);
  };

  window.speechSynthesis.speak(utterance);

  // Return cancel function
  return () => {
    window.speechSynthesis.cancel();
  };
};

export const stopArabicAudio = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
