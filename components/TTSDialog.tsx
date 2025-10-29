
import React, { useState } from 'react';
import type { VoiceOption } from '../types';
import { GeminiVoice } from '../types';

interface TTSDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeak: (text: string, voice: GeminiVoice) => void;
  voices: VoiceOption[];
  isLoading: boolean;
}

export const TTSDialog: React.FC<TTSDialogProps> = ({ isOpen, onClose, onSpeak, voices, isLoading }) => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<GeminiVoice>(voices[0].value);

  const handleSubmit = () => {
    if (!isLoading) {
      onSpeak(text, selectedVoice);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">Text-to-Speech</h2>
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to speak..."
            rows={5}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 resize-none"
            disabled={isLoading}
          />
          <div>
            <label htmlFor="voice-select" className="block text-sm font-medium text-gray-400 mb-2">
              Select Voice
            </label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as GeminiVoice)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              disabled={isLoading}
            >
              {voices.map((voice) => (
                <option key={voice.value} value={voice.value}>
                  {voice.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={isLoading || !text.trim()}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Generating...' : 'Speak'}
          </button>
        </div>
      </div>
    </div>
  );
};
