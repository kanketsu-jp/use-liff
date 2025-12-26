# サーバーサイドでの使用方法

`@kanketsu/use-liff` は、サーバーサイド（Node.js）でも使用できます。サーバーサイドでは、クライアントから送信されたIDトークンを検証し、LINEユーザーIDを取得する機能を提供します。

## インストール

```bash
npm install @kanketsu/use-liff
```

## 基本的な使い方

### トークンの検証とユーザーIDの取得

```typescript
import { verifyLiffToken, getLineUserIdFromToken } from "@kanketsu/use-liff/server";

// 方法1: 完全なユーザー情報を取得
try {
  const result = await verifyLiffToken(idToken, channelId);
  console.log("User ID:", result.userId);
  console.log("Name:", result.name);
  console.log("Picture:", result.picture);
  console.log("Email:", result.email);
} catch (error) {
  console.error("Token verification failed:", error);
}

// 方法2: ユーザーIDのみを取得
try {
  const userId = await getLineUserIdFromToken(idToken, channelId);
  console.log("User ID:", userId);
} catch (error) {
  console.error("Failed to get user ID:", error);
}
```

## APIリファレンス

### `verifyLiffToken(idToken, channelId)`

IDトークンを検証し、ユーザー情報を取得します。

**パラメータ:**
- `idToken` (string): LIFFから取得したIDトークン
- `channelId` (string): LINE Developers Consoleで取得したチャネルID

**戻り値:**
- `Promise<VerifyTokenResult>`: 検証成功時はユーザー情報を含むオブジェクト

**戻り値の型:**
```typescript
interface VerifyTokenResult {
  userId: string;      // LINEユーザーID
  iss: string;         // 発行者
  aud: string;         // 対象者（チャネルID）
  exp: number;         // 有効期限（Unix時刻）
  iat: number;         // 発行時刻（Unix時刻）
  nonce?: string;      // ノンス（指定した場合）
  name?: string;        // ユーザー名
  picture?: string;     // プロフィール画像URL
  email?: string;       // メールアドレス
}
```

**エラー:**
- `TokenVerificationError`: トークン検証に失敗した場合

```typescript
interface TokenVerificationError {
  error: string;       // エラーコード
  message: string;      // エラーメッセージ
  details?: unknown;   // 詳細情報
}
```

### `getLineUserIdFromToken(idToken, channelId)`

IDトークンからLINEユーザーIDのみを取得します。`verifyLiffToken` のラッパー関数です。

**パラメータ:**
- `idToken` (string): LIFFから取得したIDトークン
- `channelId` (string): LINE Developers Consoleで取得したチャネルID

**戻り値:**
- `Promise<string>`: LINEユーザーID

**エラー:**
- `TokenVerificationError`: トークン検証に失敗した場合

## 使用例

### Next.js API Routes

```typescript
// app/api/auth/line/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyLiffToken } from "@kanketsu/use-liff/server";

export async function POST(request: NextRequest) {
  try {
    const { idToken, queryParams } = await request.json();
    
    // チャネルIDは環境変数から取得
    const channelId = process.env.LINE_CHANNEL_ID;
    if (!channelId) {
      return NextResponse.json(
        { error: "LINE_CHANNEL_ID is not set" },
        { status: 500 }
      );
    }

    // トークンを検証してLINE IDを取得
    const result = await verifyLiffToken(idToken, channelId);
    
    // ここでデータベースに保存
    // await saveToDatabase(result.userId, queryParams);
    
    return NextResponse.json({
      success: true,
      userId: result.userId,
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 401 }
    );
  }
}
```

### Express.js

```typescript
import express from "express";
import { verifyLiffToken } from "@kanketsu/use-liff/server";

const app = express();
app.use(express.json());

app.post("/api/auth/line", async (req, res) => {
  try {
    const { idToken, queryParams } = req.body;
    
    const channelId = process.env.LINE_CHANNEL_ID;
    if (!channelId) {
      return res.status(500).json({ error: "LINE_CHANNEL_ID is not set" });
    }

    const result = await verifyLiffToken(idToken, channelId);
    
    // ここでデータベースに保存
    // await saveToDatabase(result.userId, queryParams);
    
    res.json({
      success: true,
      userId: result.userId,
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Token verification failed" });
  }
});
```

## エラーハンドリング

トークン検証は以下の理由で失敗する可能性があります：

1. **無効なトークン** - トークンが改ざんされている、または期限切れ
2. **チャネルIDの不一致** - トークンが別のチャネルで発行された
3. **ネットワークエラー** - LINE APIへの接続に失敗

適切なエラーハンドリングを行ってください：

```typescript
try {
  const result = await verifyLiffToken(idToken, channelId);
  // 成功時の処理
} catch (error) {
  if (error && typeof error === 'object' && 'error' in error) {
    // TokenVerificationErrorの場合
    const verificationError = error as TokenVerificationError;
    console.error("Error code:", verificationError.error);
    console.error("Error message:", verificationError.message);
    console.error("Details:", verificationError.details);
  } else {
    // その他のエラー
    console.error("Unexpected error:", error);
  }
}
```

## 環境変数の設定

サーバーサイドで使用する場合は、以下の環境変数を設定してください：

```bash
LINE_CHANNEL_ID=your_channel_id_here
```

LINE Developers ConsoleでチャネルIDを取得できます。

## セキュリティのベストプラクティス

1. **チャネルIDは環境変数で管理** - コードに直接書かないでください
2. **HTTPSを使用** - トークンの送信は必ずHTTPSで行ってください
3. **トークンの有効期限を確認** - `exp` フィールドをチェックしてください
4. **エラーメッセージを公開しない** - 本番環境では詳細なエラーメッセージを返さないでください

## 関連ドキュメント

- [踏み台LIFFの使い方](./stepping-stone-liff.md)
- [サンプルコード](./examples/)

