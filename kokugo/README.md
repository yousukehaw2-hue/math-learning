# 国語まなび
中学1年生向けの国語学習アプリ。東京書籍の学習領域を想定した独自作成の問題100問を収録。
- 3段階の難易度、読解・漢字・文法・記述、5〜20問のセッション
- タブレットのペン・指による手書きキャンバス、キーボード入力
- 記述の模範解答と自己評価ルーブリック
- 選択式の正答率、復習対象、記述の自己評価を端末内に保存
- 未出題を優先し、誤答内容に応じた前提問題へ案内
- 教科書本文は転載しない

## 実行
ブラウザで `index.html` を開く。公開URLは既存の `/math-learning/kokugo/` を維持する。

## 品質チェック
Node.js 22 で次を実行する。

```sh
node --test kokugo/tests/content-quality.check.cjs
node --test kokugo/tests/progress-review.check.cjs
node --test kokugo/tests/mobile-usability.check.cjs
node --test kokugo/tests/smoke.check.cjs
```

教材本文を意図的に変更する場合は、問題・正答・解説を再確認したうえで `content-quality.check.cjs` の監査値を更新する。GitHub Actions の `Kokugo CI` は、教材整合性・重複、学習履歴と復習、スマホ操作性、起動と出題操作を個別に表示する。

## 未実装・未検証
東京書籍の正式単元マッピング、教員・教材専門家による監修、OCR/AI採点、実機を使った全端末検証。
