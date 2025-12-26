# 移行ガイド: @holykzm/use-liff から @kanketsu/use-liff へ

このガイドでは、既存の `@holykzm/use-liff` を使用しているプロジェクトを `@kanketsu/use-liff` に移行する方法を説明します。

## 概要

`@holykzm/use-liff` は `@kanketsu/use-liff` に移行されました。APIは完全に互換性があるため、パッケージ名とインポートパスの変更のみで移行できます。

## 自動移行（推奨）

### 方法1: 移行スクリプトを使用（最も簡単）

プロジェクトのルートディレクトリで以下のコマンドを実行してください：

```bash
npx @kanketsu/use-liff migrate
```

このコマンドは以下を自動的に実行します：
- `package.json` の依存関係を更新
- すべてのインポート文を更新
- 型定義の参照を更新

### 方法2: 手動で移行スクリプトを実行

移行スクリプトを直接ダウンロードして実行：

```bash
curl -fsSL https://raw.githubusercontent.com/kanketsu-jp/use-liff/main/scripts/migrate.sh | bash
```

## 手動移行

自動移行が使用できない場合、以下の手順で手動で移行できます。

### ステップ1: パッケージのアンインストールと再インストール

```bash
# 古いパッケージをアンインストール
npm uninstall @holykzm/use-liff

# 新しいパッケージをインストール
npm install @kanketsu/use-liff
```

または、`package.json` を直接編集：

```json
{
  "dependencies": {
    "@kanketsu/use-liff": "^1.0.1"
  }
}
```

その後：

```bash
npm install
```

### ステップ2: インポート文の更新

プロジェクト内のすべてのファイルで、インポート文を更新します：

**変更前：**
```typescript
import { LiffProvider, useLiffContext } from "@holykzm/use-liff";
import { verifyLiffToken } from "@holykzm/use-liff/server";
```

**変更後：**
```typescript
import { LiffProvider, useLiffContext } from "@kanketsu/use-liff";
import { verifyLiffToken } from "@kanketsu/use-liff/server";
```

### ステップ3: 型定義の更新

TypeScriptを使用している場合、型定義の参照も更新する必要があります：

**変更前：**
```typescript
import type { VerifyTokenResult } from "@holykzm/use-liff/server";
```

**変更後：**
```typescript
import type { VerifyTokenResult } from "@kanketsu/use-liff/server";
```

### ステップ4: 一括置換（推奨）

プロジェクト全体で一括置換を行う場合：

**macOS / Linux:**
```bash
# プロジェクトのルートディレクトリで実行
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" \) \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" \
  -exec sed -i '' 's/@holykzm\/use-liff/@kanketsu\/use-liff/g' {} +
```

**Windows (PowerShell):**
```powershell
Get-ChildItem -Recurse -Include *.ts,*.tsx,*.js,*.jsx,*.json | 
  Where-Object { $_.FullName -notmatch '\\node_modules\\' -and $_.FullName -notmatch '\\.git\\' } |
  ForEach-Object {
    (Get-Content $_.FullName) -replace '@holykzm/use-liff', '@kanketsu/use-liff' | 
    Set-Content $_.FullName
  }
```

**VS Code:**
1. `Ctrl+Shift+H` (Windows/Linux) または `Cmd+Shift+H` (macOS) で検索・置換を開く
2. 検索: `@holykzm/use-liff`
3. 置換: `@kanketsu/use-liff`
4. 「すべて置換」をクリック

## 変更点の確認

移行後、以下の点を確認してください：

### 1. パッケージのインストール確認

```bash
npm list @kanketsu/use-liff
```

### 2. ビルドの確認

```bash
npm run build
# または
npm run dev
```

### 3. 型チェック（TypeScriptを使用している場合）

```bash
npx tsc --noEmit
```

## 互換性

`@kanketsu/use-liff` は `@holykzm/use-liff` と完全に互換性があります：

- ✅ すべてのAPIは同じです
- ✅ 型定義は同じです
- ✅ 動作は同じです
- ✅ バージョン1.0.1は `@holykzm/use-liff@1.6.0` 以降のすべての機能を含みます

## トラブルシューティング

### 問題: 型エラーが発生する

**解決方法:**
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### 問題: インポートが見つからない

**解決方法:**
1. `package.json` に `@kanketsu/use-liff` が正しく追加されているか確認
2. `npm install` を実行
3. IDE/エディタを再起動

### 問題: ビルドエラーが発生する

**解決方法:**
1. すべてのインポート文が更新されているか確認
2. キャッシュをクリア：
   ```bash
   # Next.jsの場合
   rm -rf .next
   
   # その他の場合
   rm -rf node_modules/.cache
   ```

## よくある質問

### Q: なぜ移行が必要なのですか？

A: パッケージの管理を `@kanketsu` スコープに移行したためです。機能やAPIに変更はありません。

### Q: 移行後も古いパッケージは使えますか？

A: `@holykzm/use-liff` は引き続き利用可能ですが、新しい機能の追加や更新は `@kanketsu/use-liff` で行われます。

### Q: 移行にどれくらい時間がかかりますか？

A: 小規模なプロジェクトでは数分、大規模なプロジェクトでも自動移行スクリプトを使用すれば30分以内に完了します。

## サポート

移行に関する質問や問題がある場合は、[GitHub Issues](https://github.com/kanketsu-jp/use-liff/issues) でお知らせください。

