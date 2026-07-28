/**
 * PCM / base64 helpers for the in-browser Macky voice demo.
 *
 * The realtime protocol is PCM16, 24 kHz, mono, little-endian, base64-encoded in
 * JSON frames. getUserMedia gives us Float32 at the hardware rate (usually 44.1 or
 * 48 kHz), so we downsample to 24 kHz mono and convert Float32 → Int16 before
 * base64-encoding for the mic path, and decode base64 → Int16 → Float32 for
 * playback. Pure functions only — no Web Audio, no React.
 */

import { DEMO_RMS_GATE } from "./config";

/** Linearly resample a mono Float32 buffer from `fromRate` to `toRate`. */
export function downsample(
  input: Float32Array,
  fromRate: number,
  toRate: number
): Float32Array {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const outLength = Math.floor(input.length / ratio);
  const output = new Float32Array(outLength);
  for (let i = 0; i < outLength; i += 1) {
    // Average the source window mapped to this output sample for a touch of
    // anti-aliasing rather than nearest-neighbour picking.
    const start = Math.floor(i * ratio);
    const end = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    let count = 0;
    for (let j = start; j < end; j += 1) {
      sum += input[j];
      count += 1;
    }
    output[i] = count > 0 ? sum / count : input[start] ?? 0;
  }
  return output;
}

/** Convert a Float32 (-1..1) buffer to little-endian Int16 PCM. */
export function floatTo16BitPCM(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i += 1) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}

/** Convert little-endian Int16 PCM back to Float32 (-1..1). */
export function int16ToFloat32(input: Int16Array): Float32Array {
  const output = new Float32Array(input.length);
  for (let i = 0; i < input.length; i += 1) {
    const s = input[i];
    output[i] = s < 0 ? s / 0x8000 : s / 0x7fff;
  }
  return output;
}

/** Base64-encode raw bytes (works on the main thread, no Buffer). */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000; // avoid arg-count limits on String.fromCharCode
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/** Decode base64 to an ArrayBuffer. */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer;
}

/**
 * True when an Int16 PCM chunk has enough RMS energy to plausibly contain speech.
 * Deliberately low threshold so quiet speech passes while an untouched mic's
 * near-silence does not (matches the Mac app's 0.008 gate).
 */
export function isAudible(pcm16: Int16Array): boolean {
  if (pcm16.length === 0) return false;
  let sum = 0;
  for (let i = 0; i < pcm16.length; i += 1) {
    const normalized = pcm16[i] / 0x7fff;
    sum += normalized * normalized;
  }
  return Math.sqrt(sum / pcm16.length) >= DEMO_RMS_GATE;
}
