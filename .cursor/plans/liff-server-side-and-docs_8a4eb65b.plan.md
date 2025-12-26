---
name: liff-server-side-and-docs
overview: サーバーサイド機能追加とドキュメント作成プラン
todos:
  - id: server-functions
    content: src/server.tsにサーバーサイド関数（verifyLiffToken, getLineUserIdFromToken）を実装
    status: pending
  - id: update-exports
    content: useLiff.tsxとuseLiff.d.tsにサーバー関数のエクスポートと型定義を追加
    status: pending
    dependencies:
      - server-functions
  - id: docs-structure
    content: docsディレクトリと基本ドキュメント構造を作成
    status: pending
  - id: stepping-stone-doc
    content: 踏み台リフの説明書とフローをdocs/stepping-stone-liff.mdに作成
    status: pending
    dependencies:
      - docs-structure
  - id: client-example
    content: クライアントサイドのサンプルコード（docs/examples/stepping-stone-client.tsx）を作成
    status: pending
    dependencies:
      - stepping-stone-doc
  - id: server-example
    content: サーバーサイドのAPIエンドポイント例（docs/examples/stepping-stone-server.ts）を作成
    status: pending
    dependencies:
      - client-example
  - id: database-example
    content: データベース保存の汎用的な例（docs/examples/database-examples.ts）を作成
    status: pending
    dependencies:
      - server-example
  - id: server-usage-doc
    content: サーバーサイド使用方法のドキュメント（docs/server-side-usage.md）を作成
    status: pending
    dependencies:
      - database-example
---

# サ

ーバーサイド機能追加とドキュメント作成プラン

## 方針

- クライアントサイド（既存のuseLiff）とサーバーサイド（新規追加）の両方に対応
- サーバーサイドではトークンからLINE IDを取得する機能を提供
- 踏み台リフとして使うための完全なサンプルコードとドキュメントを作成

## 実装ステップ

### 1. サーバーサイド関数の追加

- `src/server.ts` を新規作成
- `verifyLiffToken()` 関数を追加（LINE APIのverifyIdTokenを使用）
- `getLineUserIdFromToken()` 関数を追加（トークンからLINE IDを取得）
- Try-Catchエラーハンドリングを含める
- 型定義も追加

### 2. メインファイルの更新

- `src/useLiff.tsx` からサーバー関数をエクスポート（必要に応じて）
- `src/useLiff.d.ts` にサーバー関数の型定義を追加

### 3. ドキュメント構造の作成

- `docs/` ディレクトリを作成
- `docs/README.md` - ドキュメントのインデックス
- `docs/stepping-stone-liff.md` - 踏み台リフの説明とサンプル
- `docs/server-side-usage.md` - サーバーサイドでの使用方法
- `docs/examples/` - サンプルコードディレクトリ

### 4. 踏み台リフサンプルの作成

- `docs/examples/stepping-stone-client.tsx` - クライアントサイドの実装例
- `docs/examples/stepping-stone-server.ts` - サーバーサイドのAPIエンドポイント例
- `docs/examples/database-examples.ts` - データベース保存の汎用的な例（コメント付き）

### 5. 完全なフローの説明

- クライアント側：LINEログイン → トークン取得 → サーバーに送信
- サーバー側：トークン検証 → LINE ID取得 → クエリパラメータと共にデータベース保存
- 各ステップでのエラーハンドリング

### 6. 依存関係の確認

- サーバーサイドで必要なパッケージ（axios/fetchなど）を確認
- 必要に応じてpeerDependenciesに追加

## ファイル構成

```javascript
src/
  useLiff.tsx (既存)
  useLiff.d.ts (既存)
  server.ts (新規) - サーバーサイド関数

docs/
  README.md (新規)
  stepping-stone-liff.md (新規)
  server-side-usage.md (新規)
  examples/
    stepping-stone-client.tsx (新規)
    stepping-stone-server.ts (新規)
    database-examples.ts (新規)




```