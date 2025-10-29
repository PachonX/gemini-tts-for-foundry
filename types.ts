
export enum GeminiVoice {
  ZEPHYR = 'Zephyr',
  CHARON = 'Charon',
  KORE = 'Kore',
  PUCK = 'Puck',
  FENRIR = 'Fenrir',
}

export interface VoiceOption {
  value: GeminiVoice;
  label: string;
}

export interface ChatMessage {
  id: number;
  author: 'User' | 'System';
  text: string;
  audioB64?: string;
  timestamp: string;
}
