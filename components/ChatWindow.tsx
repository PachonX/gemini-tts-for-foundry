
import React from 'react';
import type { ChatMessage } from '../types';
import { MicrophoneIcon, SpeakerIcon, SpinnerIcon } from './icons';

interface ChatWindowProps {
  messages: ChatMessage[];
  onOpenTTS: () => void;
  onReplay: (audioB64: string | undefined, messageId: number) => void;
  playingId: number | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onOpenTTS, onReplay, playingId }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-2xl flex flex-col w-full h-full border border-gray-700">
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-gray-200">Gemini TTS Chat</h1>
        <button
          onClick={onOpenTTS}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open Text-to-Speech Dialog"
        >
          <MicrophoneIcon />
        </button>
      </header>
      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.author === 'User' ? 'justify-end' : ''}`}>
            {msg.author === 'System' && (
               <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white flex-shrink-0">S</div>
            )}
            <div className={`flex flex-col ${msg.author === 'User' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-lg px-4 py-2 max-w-sm md:max-w-md ${msg.author === 'User' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <p>{msg.text}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {msg.audioB64 && (
                  <button 
                    onClick={() => onReplay(msg.audioB64, msg.id)} 
                    className="text-gray-400 hover:text-blue-400 transition-colors disabled:cursor-not-allowed"
                    aria-label="Replay audio"
                    disabled={playingId !== null}
                  >
                    {playingId === msg.id ? <SpinnerIcon /> : <SpeakerIcon />}
                  </button>
                )}
                <span className="text-xs text-gray-400">{msg.timestamp}</span>
              </div>
            </div>
             {msg.author === 'User' && (
               <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white flex-shrink-0">U</div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};
