/**
 * 自己相関法によるピッチ検出クラス
 */
export class PitchDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private buffer: Float32Array = new Float32Array(2048);
  private isListening: boolean = false;
  
  // 音階と周波数の対応表 (A4 = 440Hz)
  // リコーダーの音域 C5(523.25) ~ D7 程度をカバー
  private readonly NOTE_FREQUENCIES: Record<string, number> = {
    'C5': 523.25,
    'C#5': 554.37,
    'D5': 587.33,
    'D#5': 622.25,
    'E5': 659.25,
    'F5': 698.46,
    'F#5': 739.99,
    'G5': 783.99,
    'G#5': 830.61,
    'A5': 880.00,
    'A#5': 932.33,
    'B5': 987.77,
    'C6': 1046.50,
    'C#6': 1108.73,
    'D6': 1174.66,
    'D#6': 1244.51,
    'E6': 1318.51,
    'F6': 1396.91,
    'G6': 1567.98,
    'A6': 1760.00
  };

  async start(): Promise<void> {
    if (this.isListening) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
      this.mediaStreamSource.connect(this.analyser);
      this.isListening = true;
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      throw err;
    }
  }

  stop() {
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.isListening = false;
    this.audioContext = null;
    this.analyser = null;
  }

  /**
   * 現在のピッチを検出する
   * @returns { note: string, diff: number } | null
   * note: 最も近い音階名 (例: 'C5')
   * diff: セント単位のズレ (負なら低い、正なら高い)
   */
  detect(): { note: string, diff: number, frequency: number } | null {
    if (!this.analyser || !this.isListening) return null;

    this.analyser.getFloatTimeDomainData(this.buffer as any);
    const frequency = this.autoCorrelate(this.buffer, this.audioContext!.sampleRate);

    if (frequency === -1) return null; // 音量が小さいか検出不能

    // 最も近い音階を探す
    const result = this.getClosestNote(frequency);
    return { ...result, frequency };
  }

  // 自己相関関数
  private autoCorrelate(buf: Float32Array, sampleRate: number): number {
    // RMS (音量) を計算して、小さすぎる場合は無視
    let rms = 0;
    for (let i = 0; i < buf.length; i++) {
      rms += buf[i] * buf[i];
    }
    rms = Math.sqrt(rms / buf.length);
    if (rms < 0.01) return -1;

    // 自己相関の計算
    // 簡単のため、中心部分のみで計算
    let thres = 0.2;
    for (let i = 0; i < buf.length / 2; i++) {
      if (Math.abs(buf[i]) < thres) { break; }
    }
    for (let i = 1; i < buf.length / 2; i++) {
      if (Math.abs(buf[i]) < thres) { break; }
    }
    
    // YIN algorithmの簡易版のようなアプローチ、あるいは単純な自己相関
    // ここではWeb Audio APIのサンプルによくある単純な自己相関を使用
    let bestOffset = -1;
    let bestCorrelation = 0;
    let foundGoodCorrelation = false;
    let correlations = new Array(buf.length).fill(0);

    for (let offset = 0; offset < buf.length; offset++) {
      let correlation = 0;

      for (let i = 0; i < buf.length; i++) {
        correlation += Math.abs((buf[i]) - (buf[i + offset]));
      }
      correlation = 1 - (correlation / buf.length);
      correlations[offset] = correlation; 
      
      if ((correlation > 0.9) && (correlation > bestCorrelation)) {
        foundGoodCorrelation = true;
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      } else if (foundGoodCorrelation) {
        // ピークを過ぎたので、ここで少し補正して終了
        // (厳密なガウス補間などは省略)
        const shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / 8;
        return sampleRate / (bestOffset + shift);
      }
    }
    
    if (bestCorrelation > 0.01) {
      return sampleRate / bestOffset;
    }
    
    return -1;
  }

  private getClosestNote(freq: number): { note: string, diff: number } {
    let minDiff = Infinity;
    let closestNote = '';
    
    for (const [note, noteFreq] of Object.entries(this.NOTE_FREQUENCIES)) {
      const diff = Math.abs(freq - noteFreq);
      if (diff < minDiff) {
        minDiff = diff;
        closestNote = note;
      }
    }

    // セント差分の計算
    const targetFreq = this.NOTE_FREQUENCIES[closestNote];
    // 1200 * log2(f1 / f2)
    const cents = 1200 * Math.log2(freq / targetFreq);

    return { note: closestNote, diff: cents };
  }
}

export const pitchDetector = new PitchDetector();
