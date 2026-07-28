/**
 * AudioWorklet capture processor for the Macky voice demo.
 *
 * Runs on the audio thread. It receives mic input at the AudioContext's hardware
 * rate and posts each render quantum's mono Float32 samples to the main thread,
 * which downsamples to 24 kHz, converts to Int16, base64-encodes, and streams the
 * chunk to the Worker. ScriptProcessorNode is deprecated and glitches; this does
 * not. No resampling here — the main thread owns that so it can also RMS-gate.
 */
class MackyCaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0] && input[0].length > 0) {
      // Copy channel 0; the underlying buffer is reused across quanta.
      this.port.postMessage(input[0].slice(0));
    }
    return true; // keep the processor alive
  }
}

registerProcessor("macky-capture-processor", MackyCaptureProcessor);
