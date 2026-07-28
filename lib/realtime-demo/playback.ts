/**
 * Gapless PCM16 playback queue for the Macky voice demo.
 *
 * Azure streams audio deltas faster than realtime, so playing each base64 chunk on
 * arrival produces gaps and clicks. Instead we decode each chunk to a 24 kHz
 * Float32 AudioBuffer and schedule it back-to-back on a running AudioContext clock,
 * tracking the next start time so buffers butt up against each other seamlessly.
 * Barge-in flushes the queue and stops in-flight sources immediately.
 */

import { base64ToArrayBuffer, int16ToFloat32 } from "./pcm";
import { DEMO_SAMPLE_RATE } from "./config";

export class PlaybackQueue {
  private context: AudioContext;
  private sampleRate: number;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private onPlayingChange?: (playing: boolean) => void;

  constructor(
    context: AudioContext,
    onPlayingChange?: (playing: boolean) => void,
    sampleRate: number = DEMO_SAMPLE_RATE
  ) {
    this.context = context;
    this.onPlayingChange = onPlayingChange;
    this.sampleRate = sampleRate;
  }

  /** Decode a base64 PCM16 delta and schedule it after everything queued so far. */
  enqueue(base64: string): void {
    const int16 = new Int16Array(base64ToArrayBuffer(base64));
    if (int16.length === 0) return;
    const float32 = int16ToFloat32(int16);

    const buffer = this.context.createBuffer(
      1,
      float32.length,
      this.sampleRate
    );
    buffer.getChannelData(0).set(float32);

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);

    const now = this.context.currentTime;
    // If the queue has drained (or we never started), begin slightly in the
    // future to avoid scheduling in the past; otherwise chain onto the tail.
    const startAt = Math.max(this.nextStartTime, now + 0.02);
    source.start(startAt);
    this.nextStartTime = startAt + buffer.duration;

    const wasEmpty = this.sources.size === 0;
    this.sources.add(source);
    if (wasEmpty) this.onPlayingChange?.(true);

    source.onended = () => {
      this.sources.delete(source);
      if (this.sources.size === 0) this.onPlayingChange?.(false);
    };
  }

  /** True while any scheduled audio is still pending or playing. */
  get isPlaying(): boolean {
    return this.sources.size > 0;
  }

  /** Stop everything immediately and reset the clock (barge-in / turn end). */
  flush(): void {
    for (const source of this.sources) {
      try {
        source.onended = null;
        source.stop();
        source.disconnect();
      } catch {
        // already stopped
      }
    }
    const had = this.sources.size > 0;
    this.sources.clear();
    this.nextStartTime = 0;
    if (had) this.onPlayingChange?.(false);
  }
}
