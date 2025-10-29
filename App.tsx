
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TTSDialog } from './components/TTSDialog';
import { ChatWindow } from './components/ChatWindow';
import { generateSpeech } from './services/geminiService';
import { playPcmAudio } from './utils/audioUtils';
import type { ChatMessage, VoiceOption } from './types';
import { GeminiVoice } from './types';

const VOICE_OPTIONS: VoiceOption[] = [
  { value: GeminiVoice.ZEPHYR, label: 'Zephyr (Deep Male)' },
  { value: GeminiVoice.CHARON, label: 'Charon (Male)' },
  { value: GeminiVoice.KORE, label: 'Kore (Female)' },
  { value: GeminiVoice.PUCK, label: 'Puck (Youthful Male)' },
  { value: GeminiVoice.FENRIR, label: 'Fenrir (Mature Male)' },
];

export default function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      author: 'System',
      text: 'Welcome! Click the microphone icon to generate speech.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on user interaction to comply with autoplay policies
    const initAudioContext = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioContextRef.current = new AudioContext({ sampleRate: 24000 });
            } else {
                setError("Web Audio API is not supported in this browser.");
            }
        }
        window.removeEventListener('click', initAudioContext);
        window.removeEventListener('keydown', initAudioContext);
    };
    
    window.addEventListener('click', initAudioContext);
    window.addEventListener('keydown', initAudioContext);

    return () => {
        window.removeEventListener('click', initAudioContext);
        window.removeEventListener('keydown', initAudioContext);
    }
  }, []);

  const handleSpeak = useCallback(async (text: string, voice: GeminiVoice) => {
    if (!text.trim()) {
      setError("Text cannot be empty.");
      return;
    }
    if (!audioContextRef.current) {
      setError("Audio context is not initialized. Please click anywhere on the page first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const audioB64 = await generateSpeech(text, voice);
      await playPcmAudio(audioB64, audioContextRef.current);

      const newMessage: ChatMessage = {
        id: Date.now(),
        author: 'User',
        text: `Spoke: "${text}"`,
        audioB64: audioB64,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, newMessage]);
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate audio. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleReplay = useCallback(async (audioB64: string | undefined, messageId: number) => {
    if (audioB64 && audioContextRef.current) {
      setPlayingId(messageId);
      setError(null);
      try {
        await playPcmAudio(audioB64, audioContextRef.current);
      } catch (err) {
         console.error(err);
         setError("Failed to replay audio.");
      } finally {
        setPlayingId(null);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[90vh] flex flex-col">
        <ChatWindow 
          messages={messages} 
          onOpenTTS={() => setIsDialogOpen(true)} 
          onReplay={handleReplay}
          playingId={playingId}
        />
      </div>
      {isDialogOpen && (
        <TTSDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSpeak={handleSpeak}
          voices={VOICE_OPTIONS}
          isLoading={isLoading}
        />
      )}
      {error && (
        <div 
          className="fixed bottom-5 right-5 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg animate-pulse z-50 cursor-pointer"
          onClick={() => setError(null)}
          role="alert"
          aria-live="assertive"
        >
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
    </div>
  );
}
