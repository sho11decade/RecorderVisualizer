import { Keyboard } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

interface KeyboardShortcutsHelpProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function KeyboardShortcutsHelp({ open, onOpenChange }: KeyboardShortcutsHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-indigo-600"
          title="キーボードショートカット (押すと「?」キー)"
        >
          <Keyboard className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-600" />
            キーボードショートカット
          </DialogTitle>
          <DialogDescription>
            効率的に操作するためのキーボードショートカット
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-700">再生/停止</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 rounded shadow-sm">
                Space
              </kbd>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-700">ヘルプを表示</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 rounded shadow-sm">
                ?
              </kbd>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-700">音符を配置</span>
              <span className="text-xs text-slate-500">グリッドをクリック</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">音階をプレビュー</span>
              <span className="text-xs text-slate-500">音階名をクリック</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              💡 <strong>ヒント:</strong> マウスホイールで3Dモデルを拡大/縮小<br/>
              ドラッグで回転できます
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
