import { Music, Github } from 'lucide-react';
import { Button } from '../ui/button';

export const About = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
          <Music className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Recorder Viz について</h2>
          <p className="text-slate-500 mt-1">
            リコーダー練習を、もっと楽しく、もっと直感的に。
          </p>
        </div>
      </div>

      <div className="prose prose-sm prose-slate max-w-none text-slate-600 space-y-4">
        <p>
          Recorder Vizは、教育現場や独学でリコーダーを学ぶ方々のために開発された、
          完全無料・ブラウザ完結型の練習支援ツールです。
        </p>

        <h3 className="text-lg font-semibold text-slate-800">主な機能</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>3D運指ガイド:</strong> 楽譜だけでは分かりにくい指の動きを、立体のリコーダーモデルで確認できます。
          </li>
          <li>
            <strong>リアルタイム・チューナー:</strong> マイクを使って、自分の吹いている音が合っているか判定します。
          </li>
          <li>
            <strong>メロディエディター:</strong> 自分で曲を作ったり、課題曲を入力して練習できます。
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800">開発背景</h3>
        <p>
          「指使いが覚えられない」「音が合っているか分からない」という初心者の悩みを、
          最新のWeb技術（Three.js, Web Audio API）で解決したいという思いから生まれました。
          インストール不要で、タブレットやPCからすぐに使い始められます。
        </p>
        <h3 className="text-lg font-semibold text-slate-800">開発者</h3>
        <p>
          このアプリは個人開発者のRiceZeroが制作・公開しています。<br />
          WebSite: <a href="https://ricezero.fun/" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">ricezero.fun</a><br />
          Twitter: <a href="https://twitter.com/ricezero21" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">@ricezero21</a><br />
          E-mail: <a href="mailto:contact@ricezero.fun" className="text-indigo-600 hover:underline">contact@ricezero.fun</a>
        </p>
        
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
          <p className="text-xs text-slate-500 mb-2">
            ※ 本アプリは現在ベータ版です。動作の不具合やご要望がありましたら、開発者までご連絡ください。
          </p>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 pt-4 border-t border-slate-100">
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <a href="https://github.com/sho11decade/RecorderVisualizer" target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </Button>
      </div>
    </div>
  );
};
