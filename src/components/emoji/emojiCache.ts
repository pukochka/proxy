/// <reference lib="webworker" />

/**
 * Загружает байты `.tgs` (или JSON) по URL без Cache Storage.
 * Используется из `emojiRlottie.worker.ts`.
 */
export async function fetchTgsAsUint8Array(tgsUrl: string): Promise<Uint8Array> {
  const key = tgsUrl.trim();
  const response = await fetch(tgsUrl, { credentials: 'same-origin' });
  if (!response.ok) {
    throw new Error(`[emojiCache] Failed to fetch ${key}: HTTP ${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}
