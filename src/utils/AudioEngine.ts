import * as Tone from "tone";
import { FINGERINGS } from "../data/fingerings";

type PlayCallback = (
  stepIndex: number,
  noteKey: string | null,
) => void;
type EndCallback = () => void;

class AudioEngine {
  private synth: Tone.PolySynth | null = null;
  private sequence: Tone.Sequence | null = null;
  private clickSynth: Tone.Synth | null = null;

  private clickLoop: Tone.Loop | null = null;

  constructor() {
    // インスタンス作成時は何もしない（ユーザー操作までAudioContextを作らないため）
  }

  init() {
    if (this.synth) return;

    // リコーダーに近い、少し空気感のある音色
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.04, // 立ち上がりを少しマイルドに
        decay: 0.2,
        sustain: 0.5,
        release: 1.2, // 余韻を長く
      },
      volume: -4,
    }).toDestination();

    // エフェクト: リバーブでホールのような響き
    const reverb = new Tone.Reverb({
      decay: 2.5,
      preDelay: 0.1,
      wet: 0.4,
    }).toDestination();

    this.synth.connect(reverb);

    // カウントイン（メトロノーム）用のシンセ
    this.clickSynth = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1,
      },
      volume: -10,
    }).toDestination();
  }

  /**
   * マスターボリュームの設定
   * @param decibels -60(mute) ~ 0(max)
   */
  setMasterVolume(decibels: number) {
    Tone.Destination.volume.value =
      decibels <= -30 ? -Infinity : decibels;
  }

  /**
   * ガイドメロディのミュート切り替え
   * @param muted trueならミュート
   */
  setMelodyMute(muted: boolean) {
    if (this.synth) {
      // 元のvolumeが-4なので、ミュート時は-Infinity、解除時は-4
      this.synth.volume.value = muted ? -Infinity : -4;
    }
  }

  /**
   * カウントイン（予備拍）を再生
   */
  playCountIn(bpm: number) {
    this.init();
    if (!this.clickSynth) return;

    if (Tone.context.state !== "running") {
      Tone.start();
    }

    const now = Tone.now();
    const beat = 60 / bpm;

    // 4拍カウント: 高・低・低・低 (1, 2, 3, 4)
    this.clickSynth.triggerAttackRelease("C6", "32n", now);
    this.clickSynth.triggerAttackRelease(
      "C5",
      "32n",
      now + beat,
    );
    this.clickSynth.triggerAttackRelease(
      "C5",
      "32n",
      now + beat * 2,
    );
    this.clickSynth.triggerAttackRelease(
      "C5",
      "32n",
      now + beat * 3,
    );
  }

  /**
   * 単音再生（プレビュー用）
   */
  playNote(pitch: string, duration: string = "8n") {
    this.init();
    if (Tone.context.state !== "running") {
      Tone.start();
    }
    // ミュート状態でもプレビューは鳴るべきなので、一時的にvolume戻す処理は入れない
    // (プレビュー操作時はミュート解除をUI側でやるか、別途プレビュー用シンセを作るのが正攻法だが今回は簡易的に)
    this.synth?.triggerAttackRelease(pitch, duration);
  }

  /**
   * シーケンス再生の開始
   * @param melodySteps 音階キーの配列 (例: ['C5', null, 'D5', ...])
   * @param bpm テンポ
   * @param onStep 現在のステップが再生される直前に呼ばれるコールバック
   * @param onEnd 再生終了時（またはループの区切れ）に呼ばれるコールバック
   * @param loop ループ再生するかどうか
   * @param enableMetronome 再生中にメトロノーム音を鳴らすか
   */
  startSequence(
    melodySteps: (string | null)[],
    bpm: number,
    onStep: PlayCallback,
    onEnd: EndCallback,
    loop: boolean = false,
    enableMetronome: boolean = false,
  ) {
    this.init();
    this.stop(); // 既存の再生があれば停止

    Tone.Transport.bpm.value = bpm;

    // メトロノームのループ設定
    if (enableMetronome && this.clickSynth) {
      // 4分音符ごとにクリック音を鳴らす
      this.clickLoop = new Tone.Loop((time) => {
        // 小節の頭かどうかを判定するのはTone.Transport.positionのパースが必要で複雑になるため
        // 今回は単純に全部 "C5" (低い音) で鳴らす、または 4拍ごとのアクセントは省略
        // Tone.Transportのビートに合わせて鳴らす
        this.clickSynth?.triggerAttackRelease(
          "C5",
          "32n",
          time,
        );
      }, "4n");
      this.clickLoop.start(0);
    }

    // シーケンスの作成
    // callbackは (time, note) を受け取る
    // noteには { noteKey: string|null, index: number } を渡すようにデータを整形
    const sequenceData = melodySteps.map((noteKey, index) => ({
      noteKey,
      index,
    }));

    this.sequence = new Tone.Sequence(
      (time, event) => {
        // 1. 音声をスケジュール
        if (event.noteKey) {
          const fingering = FINGERINGS[event.noteKey];
          if (fingering) {
            // 8n = 8分音符
            this.synth?.triggerAttackRelease(
              fingering.pitch,
              "8n",
              time,
            );
          }
        }

        // 2. UI描画をスケジュール (音声と完全に同期)
        Tone.Draw.schedule(() => {
          onStep(event.index, event.noteKey);
        }, time);
      },
      sequenceData,
      "8n",
    );

    // ループ設定
    this.sequence.loop = loop;

    // ループしない場合は、再生終了を検知して停止する必要がある
    if (!loop) {
      this.sequence.loop = false;

      // シーケンスの長さ(秒)を計算して、終了コールバックをスケジュール
      // 8分音符(8n) * ステップ数
      const totalDuration =
        Tone.Time("8n").toSeconds() * melodySteps.length;

      Tone.Transport.scheduleOnce((time) => {
        // UI側の終了処理
        Tone.Draw.schedule(() => {
          onEnd();
        }, time);
        this.stop();
      }, `+${totalDuration}`);
    }

    Tone.Transport.start();
    this.sequence.start(0);
  }

  stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel(); // 予定されていたイベントをクリア

    if (this.sequence) {
      this.sequence.dispose();
      this.sequence = null;
    }

    if (this.clickLoop) {
      this.clickLoop.dispose();
      this.clickLoop = null;
    }
  }

  setBpm(bpm: number) {
    Tone.Transport.bpm.value = bpm;
  }
}

export const audioEngine = new AudioEngine();