# @holykzm/use-liff ドキュメント

このディレクトリには、`@holykzm/use-liff` ライブラリの詳細なドキュメントとサンプルコードが含まれています。

## ドキュメント一覧

### 基本ガイド

- **[踏み台LIFFの使い方](./stepping-stone-liff.md)** - LIFFを踏み台として使用し、LINEログインとユーザーID取得を行う方法
- **[サーバーサイドでの使用方法](./server-side-usage.md)** - サーバーサイドでトークン検証とLINE ID取得を行う方法

### サンプルコード

- **[クライアントサイドの実装例](./examples/stepping-stone-client.tsx)** - Reactコンポーネントでの実装例
- **[サーバーサイドのAPIエンドポイント例](./examples/stepping-stone-server.ts)** - Next.js API RoutesやExpressなどの実装例
- **[データベース保存の例](./examples/database-examples.ts)** - Supabase、Firestoreなどへの保存例

## クイックスタート

### クライアントサイド

```tsx
import { LiffProvider, useLiffContext } from "@holykzm/use-liff";

function App() {
  return (
    <LiffProvider liffId="YOUR_LIFF_ID">
      <YourComponent />
    </LiffProvider>
  );
}
```

### サーバーサイド

```typescript
import { verifyLiffToken } from "@holykzm/use-liff/server";

const result = await verifyLiffToken(idToken, channelId);
console.log("User ID:", result.userId);
```

## 関連リンク

- [メインREADME](../README.md)
- [GitHubリポジトリ](https://github.com/holykzm/use-liff)

