const MODULE_ID = 'gemini-tts-for-foundry';
const SOCKET_NAME = `module.${MODULE_ID}`;

// Helper to decode Base64 string to Uint8Array
function decodeBase64(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Creates a WAV file header for raw PCM data.
 * @param {number} pcmDataLength The length of the raw PCM data in bytes.
 * @returns {Uint8Array} A 44-byte WAV header.
 */
function createWavHeader(pcmDataLength) {
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);

  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmDataLength, true);
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size for PCM
  view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, pcmDataLength, true);

  return new Uint8Array(buffer);
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

async function playAudioFromBase64(base64Data) {
    const pcmData = decodeBase64(base64Data);
    const wavHeader = createWavHeader(pcmData.length);
    const wavData = new Uint8Array(wavHeader.length + pcmData.length);
    
    wavData.set(wavHeader, 0);
    wavData.set(pcmData, wavHeader.length);

    const blob = new Blob([wavData], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);

    AudioHelper.play({ src: url, volume: 1.0, autoplay: true, loop: false }, false);
}

async function openTtsDialog() {
  const voices = [
    { key: 'Zephyr', label: game.i18n.localize('GEMINI-TTS.Voices.Zephyr') },
    { key: 'Charon', label: game.i18n.localize('GEMINI-TTS.Voices.Charon') },
    { key: 'Kore', label: game.i18n.localize('GEMINI-TTS.Voices.Kore') },
    { key: 'Puck', label: game.i18n.localize('GEMINI-TTS.Voices.Puck') },
    { key: 'Fenrir', label: game.i18n.localize('GEMINI-TTS.Voices.Fenrir') },
  ];
  
  const content = await renderTemplate(`modules/${MODULE_ID}/templates/tts-dialog.hbs`, { voices });

  new Dialog({
    title: game.i18n.localize('GEMINI-TTS.DialogTitle'),
    content: content,
    buttons: {
      speak: {
        icon: '<i class="fas fa-microphone-alt"></i>',
        label: game.i18n.localize('GEMINI-TTS.SpeakButton'),
        callback: async (html) => {
          const text = html.find('[name="tts-text"]').val();
          const voiceName = html.find('[name="tts-voice"]').val();
          const apiKey = game.settings.get(MODULE_ID, 'apiKey');

          if (!apiKey) {
            ui.notifications.warn(game.i18n.localize('GEMINI-TTS.Notifications.ApiKeyMissing'));
            return;
          }

          if (!text || !text.trim()) {
            ui.notifications.warn(game.i18n.localize('GEMINI-TTS.Notifications.EmptyText'));
            return;
          }

          ui.notifications.info(game.i18n.localize('GEMINI-TTS.Notifications.Generating'));

          try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: text }] }],
                    config: {
                        responseModalities: ['AUDIO'],
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: { voiceName: voiceName }
                            }
                        }
                    }
                })
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const audioB64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

            if (audioB64) {
              game.socket.emit(SOCKET_NAME, { audioB64 });
            } else {
              throw new Error("No audio data received from API.");
            }
          } catch (err) {
            console.error(`${MODULE_ID} | API Error:`, err);
            ui.notifications.error(game.i18n.format('GEMINI-TTS.Notifications.ApiError', { error: err.message }));
          }
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize('GEMINI-TTS.CancelButton'),
      },
    },
    default: 'speak',
    render: html => {
        html.addClass('gemini-tts-dialog');
    }
  }).render(true);
}

Hooks.once('init', () => {
  game.settings.register(MODULE_ID, 'apiKey', {
    name: game.i18n.localize('GEMINI-TTS.Settings.ApiKey.Name'),
    hint: game.i18n.localize('GEMINI-TTS.Settings.ApiKey.Hint'),
    scope: 'world',
    config: true,
    type: String,
    default: '',
  });
});

Hooks.on('renderChatLog', (app, html) => {
  const button = $(`<a class="chat-control-icon gemini-tts-button" title="${game.i18n.localize('GEMINI-TTS.ButtonTitle')}"><i class="fas fa-microphone-alt"></i></a>`);
  button.on('click', () => openTtsDialog());
  html.find('.chat-controls').prepend(button);
});

Hooks.once('ready', () => {
    game.socket.on(SOCKET_NAME, (data) => {
        if (data.audioB64) {
            playAudioFromBase64(data.audioB64);
        }
    });
});