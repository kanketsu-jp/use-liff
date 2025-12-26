# CLAUDE.md - Claude Code 向け指示

このファイルはClaude Codeがこのプロジェクトで作業する際の指示を提供します。

## 必須ルール

- 会話は必ず日本語で行ってください
- プロジェクトに関係ない一時ファイルは `.temp/` ディレクトリに保存してください
- 変更を行う前に、必ず既存のコードを確認してください

## プロジェクト情報

詳細は `AGENTS.md` を参照してください。

## 作業開始時の確認事項

1. `package.json` でバージョンと依存関係を確認
2. `tsconfig.json` でTypeScript設定を確認
3. `src/useLiff.tsx` でメイン実装を確認

## 重要な注意点

- このプロジェクトはnpmライブラリです（Webアプリではありません）
- ビルドは `npm run build` (tsc) のみです
- Next.js、Firebase、Biome等は使用していません
