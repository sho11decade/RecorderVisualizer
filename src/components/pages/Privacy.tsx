export const Privacy = () => {
  return (
    <div className="space-y-6 text-slate-600">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">プライバシーポリシー</h2>
        <p className="text-sm text-slate-400">最終更新日: 2026年1月14日</p>
      </div>

      <div className="prose prose-sm prose-slate max-w-none space-y-4 h-[60vh] overflow-y-auto pr-2">
        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">1. 収集する情報について</h3>
          <p>
            本アプリケーション（Recorder Viz）は、ユーザーのプライバシーを尊重します。
            当アプリは、以下の情報を扱いますが、これらはすべて<strong>ユーザーのブラウザ内（ローカル）でのみ処理され、外部サーバーへ送信・保存されることはありません。</strong>
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong>マイク音声データ:</strong> チューナー機能（音程判定）のためにマイク入力を使用します。音声データはリアルタイムで解析され、即座に破棄されます。録音やサーバーへの送信は一切行われません。
            </li>
            <li>
              <strong>作成したメロディデータ:</strong> ユーザーがエディターで作成したデータは、利便性向上のためブラウザのローカルストレージ（LocalStorage）に保存されます。
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">2. Google Analytics の使用について</h3>
          <p>
            当サイトでは、サイトの利用状況を把握するために Google Analytics を利用する場合があります。
            Google Analytics は Cookie を使用して匿名のトラフィックデータを収集しますが、個人を特定する情報は含まれません。
            この機能はブラウザの設定で無効にすることができます。
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">3. 免責事項</h3>
          <p>
            本アプリの利用により生じた、いかなる損害（直接的、間接的を問わず）についても、開発者は一切の責任を負いません。
            音程判定の精度は、使用環境やマイクの性能に依存するため、完全な正確性を保証するものではありません。
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">4. お問い合わせ</h3>
          <p>
            本ポリシーに関するお問い合わせは、GitHubのリポジトリまたは開発者SNSアカウントまでお願いいたします。
          </p>
        </section>
      </div>
    </div>
  );
};
