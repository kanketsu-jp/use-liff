/**
 * 踏み台LIFF - サーバーサイドのAPIエンドポイント例
 * 
 * このサンプルでは、クライアントから送信されたIDトークンを検証し、
 * LINE IDとクエリパラメータをデータベースに保存する方法を示します。
 */

import { verifyLiffToken, getLineUserIdFromToken } from "@holykzm/use-liff/server";
import type { VerifyTokenResult, TokenVerificationError } from "@holykzm/use-liff/server";

/**
 * リクエストボディの型定義
 */
interface AuthRequest {
  idToken: string;
  queryParams: Record<string, string>;
  userId?: string; // 参考情報（サーバー側で検証するため、この値は信用しない）
}

/**
 * Next.js API Routes の例
 */
export async function POST(request: Request) {
  try {
    // リクエストボディを取得
    const body: AuthRequest = await request.json();
    const { idToken, queryParams } = body;

    // バリデーション
    if (!idToken) {
      return new Response(
        JSON.stringify({ error: "idToken is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // チャネルIDを環境変数から取得
    const channelId = process.env.LINE_CHANNEL_ID;
    if (!channelId) {
      console.error("LINE_CHANNEL_ID is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // トークンを検証してLINE IDを取得
    let lineUserId: string;
    let tokenResult: VerifyTokenResult;

    try {
      // 方法1: 完全なユーザー情報を取得する場合
      tokenResult = await verifyLiffToken(idToken, channelId);
      lineUserId = tokenResult.userId;

      // または、方法2: ユーザーIDのみが必要な場合
      // lineUserId = await getLineUserIdFromToken(idToken, channelId);
    } catch (error) {
      // トークン検証エラーの処理
      const verificationError = error as TokenVerificationError;
      console.error("Token verification failed:", {
        error: verificationError.error,
        message: verificationError.message,
        details: verificationError.details,
      });

      return new Response(
        JSON.stringify({ 
          error: "Token verification failed",
          // 本番環境では詳細なエラー情報を返さない
          // details: process.env.NODE_ENV === "development" ? verificationError.details : undefined
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // ここでLINE IDを使用できます
    console.log("Verified LINE User ID:", lineUserId);
    console.log("Query Parameters:", queryParams);

    // データベースに保存
    // この部分は、使用するデータベースに応じて実装してください
    // 例: await saveToDatabase(lineUserId, queryParams);
    
    // データベース保存の例は database-examples.ts を参照してください

    // 成功レスポンスを返す
    return new Response(
      JSON.stringify({
        success: true,
        userId: lineUserId,
        // 必要に応じて追加情報を返す
        // name: tokenResult.name,
        // picture: tokenResult.picture,
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    // 予期しないエラーの処理
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        // 本番環境では詳細なエラー情報を返さない
        // message: process.env.NODE_ENV === "development" 
        //   ? (error instanceof Error ? error.message : "Unknown error")
        //   : undefined
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * Express.js の例
 */
export function expressHandler(req: any, res: any) {
  (async () => {
    try {
      const body: AuthRequest = req.body;
      const { idToken, queryParams } = body;

      // バリデーション
      if (!idToken) {
        return res.status(400).json({ error: "idToken is required" });
      }

      // チャネルIDを環境変数から取得
      const channelId = process.env.LINE_CHANNEL_ID;
      if (!channelId) {
        console.error("LINE_CHANNEL_ID is not set");
        return res.status(500).json({ error: "Server configuration error" });
      }

      // トークンを検証してLINE IDを取得
      let lineUserId: string;
      try {
        lineUserId = await getLineUserIdFromToken(idToken, channelId);
      } catch (error) {
        const verificationError = error as TokenVerificationError;
        console.error("Token verification failed:", verificationError);
        return res.status(401).json({ 
          error: "Token verification failed"
        });
      }

      // ここでLINE IDを使用できます
      console.log("Verified LINE User ID:", lineUserId);
      console.log("Query Parameters:", queryParams);

      // データベースに保存
      // await saveToDatabase(lineUserId, queryParams);

      // 成功レスポンスを返す
      res.json({
        success: true,
        userId: lineUserId,
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })();
}

/**
 * 使用例:
 * 
 * Next.js App Router:
 * - ファイル: app/api/auth/line/route.ts
 * - エンドポイント: POST /api/auth/line
 * 
 * Next.js Pages Router:
 * - ファイル: pages/api/auth/line.ts
 * - エンドポイント: POST /api/auth/line
 * 
 * Express.js:
 * - app.post("/api/auth/line", expressHandler);
 * 
 * 環境変数:
 * - LINE_CHANNEL_ID=your_channel_id_here
 */

