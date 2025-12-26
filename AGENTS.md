# AGENTS.md - @holykzm/use-liff プロジェクト固有の指示

## プロジェクト概要

**@holykzm/use-liff** は、LINE Front-end Framework (LIFF) の使用を簡素化するための React カスタムフック/プロバイダーライブラリです。

| 項目 | 内容 |
|------|------|
| パッケージ名 | @holykzm/use-liff |
| 現在のバージョン | 1.6.0 |
| ライセンス | MIT |
| リポジトリ | https://github.com/holykzm/use-liff |

## 技術スタック

| 技術 | バージョン | 用途 |
|------|----------|------|
| React | ^18.2.0 | UIライブラリ（peerDependency） |
| TypeScript | ^4.9.5 | 型安全性 |
| @line/liff | ^2.23.2 | LINE LIFF SDK |

## プロジェクト構造

```
use-liff/
├── src/
│   ├── useLiff.tsx      # メインの実装ファイル
│   └── useLiff.d.ts     # 型定義ファイル
├── dist/                # ビルド出力（gitignore対象）
├── package.json
├── tsconfig.json
└── README.md
```

## 主要エクスポート

| エクスポート | 種類 | 説明 |
|-------------|------|------|
| `LiffProvider` | コンポーネント | LIFF SDKを初期化し、コンテキストを提供するプロバイダー |
| `useLiff` | フック | LIFF SDKを直接使用するためのカスタムフック |
| `useLiffContext` | フック | LiffProvider内でLIFF状態にアクセスするためのフック |

## 開発コマンド

```bash
# TypeScriptのビルド
npm run build
```

## コーディング規約

### TypeScript
- 型安全性を重視し、`any` 型の使用は避ける
- 不明な型には `unknown` を使用し、型ガードでチェックする
- インターフェースには JSDoc コメントを付ける

### React
- "use client" ディレクティブを使用（Next.js App Router対応）
- コンテキストパターンを使用してLIFF状態を共有
- エフェクトの依存配列を適切に設定

### LIFF SDK
- 動的インポート（`import("@line/liff")`）を使用してSSRエラーを回避
- モックモードをサポートし、開発時のテストを容易にする
- エラーハンドリングを適切に行う

## モックモードについて

開発時にLINEプラットフォームに接続せずにテストするためのモックモードをサポートしています。

### 有効化方法
1. 環境変数: `NEXT_PUBLIC_LIFF_MOCK=true`
2. プロップ: `<LiffProvider mock={true} />`

### モック時の動作
- LIFF SDKメソッドはモック化され、実際のAPI呼び出しを行わない
- ユーザープロフィールはダミーデータに設定される
- `sendMessages` や `shareTargetPicker` はアラートを表示

## リリース手順

1. `package.json` のバージョンを更新
2. `npm run build` でビルド
3. `npm publish` でnpmに公開

## 注意事項

- このライブラリはReact 18以上を前提としています
- Next.js App Routerで使用する場合は `"use client"` が必要です
- LIFF SDKはブラウザ環境でのみ動作するため、SSR時のエラーハンドリングが重要です
