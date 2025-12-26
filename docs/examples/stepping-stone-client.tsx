/**
 * 踏み台LIFF - クライアントサイドの実装例
 * 
 * このサンプルでは、LIFFアプリでLINEログインを行い、
 * IDトークンとクエリパラメータをサーバーに送信する方法を示します。
 */

"use client";

import { useEffect, useState } from "react";
import { LiffProvider, useLiffContext } from "@holykzm/use-liff";

/**
 * メインコンポーネント
 * LiffProviderでアプリをラップします
 */
export default function SteppingStoneLiffApp() {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  
  if (!liffId) {
    return <div>Error: NEXT_PUBLIC_LIFF_ID is not set</div>;
  }

  return (
    <LiffProvider
      liffId={liffId}
      // クエリパラメータを引き継ぐために redirectUri を指定
      loginConfig={{
        redirectUri: typeof window !== "undefined" ? window.location.href : undefined,
      }}
    >
      <SteppingStoneContent />
    </LiffProvider>
  );
}

/**
 * 実際のコンテンツコンポーネント
 * useLiffContext を使用してLIFFの状態にアクセスします
 */
function SteppingStoneContent() {
  const { currentUser, liff, liffError } = useLiffContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // クエリパラメータを取得
  const queryParams = typeof window !== "undefined" 
    ? Object.fromEntries(new URLSearchParams(window.location.search))
    : {};

  useEffect(() => {
    // ログイン済みで、まだ送信していない場合
    if (currentUser && liff && !isSubmitting && !submitSuccess) {
      handleSubmit();
    }
  }, [currentUser, liff]);

  /**
   * IDトークンを取得してサーバーに送信
   */
  const handleSubmit = async () => {
    if (!liff || !currentUser) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // IDトークンを取得
      const idToken = liff.getIDToken();
      
      if (!idToken) {
        throw new Error("Failed to get ID token");
      }

      // サーバーAPIに送信
      const response = await fetch("/api/auth/line", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          // クエリパラメータを送信
          queryParams,
          // LINE IDも送信（サーバー側で検証するため、参考情報として）
          userId: currentUser.userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Failed to submit:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // エラー表示
  if (liffError) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Error</h1>
        <p>{liffError}</p>
      </div>
    );
  }

  // ローディング中
  if (!currentUser || isSubmitting) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Loading...</h1>
        <p>Please wait while we authenticate you.</p>
      </div>
    );
  }

  // 送信成功
  if (submitSuccess) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Success!</h1>
        <p>Your LINE ID has been registered.</p>
        <p>User ID: {currentUser.userId}</p>
        {Object.keys(queryParams).length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h2>Query Parameters:</h2>
            <pre>{JSON.stringify(queryParams, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }

  // エラー表示
  if (submitError) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Error</h1>
        <p>{submitError}</p>
        <button onClick={handleSubmit}>Retry</button>
      </div>
    );
  }

  // 通常の表示（通常はここには到達しない）
  return (
    <div style={{ padding: "20px" }}>
      <h1>Stepping Stone LIFF</h1>
      <p>User: {currentUser.displayName}</p>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

/**
 * 使用例:
 * 
 * 1. このコンポーネントをLIFFアプリのページとして配置
 * 2. クエリパラメータ付きでアクセス: https://your-liff-app.com/?campaign=summer&source=line
 * 3. 自動的にLINEログインが実行され、ログイン後は自動的にサーバーに送信されます
 * 4. サーバー側でトークンを検証し、LINE IDとクエリパラメータをデータベースに保存します
 */

