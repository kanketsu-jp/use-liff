/**
 * サーバーサイド用のLIFF関数
 * このファイルはサーバーサイド（Node.js）でのみ使用してください。
 */

/**
 * LINE IDトークンの検証結果の型定義
 */
export interface VerifyTokenResult {
	userId: string;
	iss: string;
	aud: string;
	exp: number;
	iat: number;
	nonce?: string;
	name?: string;
	picture?: string;
	email?: string;
}

/**
 * トークン検証エラーの型定義
 */
export interface TokenVerificationError {
	error: string;
	message: string;
	details?: unknown;
}

/**
 * LINE IDトークンを検証し、ユーザー情報を取得します。
 *
 * @param idToken - LIFFから取得したIDトークン
 * @param channelId - LINE Developers Consoleで取得したチャネルID
 * @returns 検証成功時はユーザー情報を含むオブジェクト、失敗時はエラーをthrow
 *
 * @example
 * ```typescript
 * try {
 *   const result = await verifyLiffToken(idToken, process.env.LINE_CHANNEL_ID!);
 *   console.log('User ID:', result.userId);
 * } catch (error) {
 *   console.error('Token verification failed:', error);
 * }
 * ```
 */
export async function verifyLiffToken(
	idToken: string,
	channelId: string,
): Promise<VerifyTokenResult> {
	try {
		// LINE APIのverifyIdTokenエンドポイントを呼び出し
		const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				id_token: idToken,
				client_id: channelId,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const error: TokenVerificationError = {
				error: "TOKEN_VERIFICATION_FAILED",
				message: `LINE API returned status ${response.status}`,
				details: errorData,
			};
			throw error;
		}

		const data = await response.json();

		// レスポンスの検証
		if (!data.sub || !data.iss || !data.aud) {
			const error: TokenVerificationError = {
				error: "INVALID_TOKEN_RESPONSE",
				message: "Token response is missing required fields",
				details: data,
			};
			throw error;
		}

		return {
			userId: data.sub,
			iss: data.iss,
			aud: data.aud,
			exp: data.exp,
			iat: data.iat,
			nonce: data.nonce,
			name: data.name,
			picture: data.picture,
			email: data.email,
		};
	} catch (error) {
		// 既にTokenVerificationErrorの場合はそのままthrow
		if (error && typeof error === "object" && "error" in error) {
			throw error;
		}

		// その他のエラー（ネットワークエラーなど）
		const verificationError: TokenVerificationError = {
			error: "VERIFICATION_ERROR",
			message:
				error instanceof Error ? error.message : "Unknown error occurred",
			details: error,
		};
		throw verificationError;
	}
}

/**
 * IDトークンからLINEユーザーIDを取得します。
 * verifyLiffTokenのラッパー関数で、ユーザーIDのみが必要な場合に便利です。
 *
 * @param idToken - LIFFから取得したIDトークン
 * @param channelId - LINE Developers Consoleで取得したチャネルID
 * @returns LINEユーザーID
 *
 * @example
 * ```typescript
 * try {
 *   const userId = await getLineUserIdFromToken(idToken, process.env.LINE_CHANNEL_ID!);
 *   console.log('User ID:', userId);
 * } catch (error) {
 *   console.error('Failed to get user ID:', error);
 * }
 * ```
 */
export async function getLineUserIdFromToken(
	idToken: string,
	channelId: string,
): Promise<string> {
	const result = await verifyLiffToken(idToken, channelId);
	return result.userId;
}
