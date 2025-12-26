declare module "@kanketsu/use-liff" {
	import type { ReactNode, ComponentType } from "react";
	import type { Liff } from "@line/liff";
	import type { Profile } from "@liff/get-profile";

	interface LiffContextType {
		currentUser: Profile | null; // displayNameが未設定の場合は"Unknown"が設定されます
		liffControls: Liff | null; // 後方互換のため残しています
		liff: Liff | null; // liffControlsと同じ値です
		liffError: string | null;
		isMock: boolean;
	}

	/**
	 * liff.login()に渡す設定オプション
	 */
	interface LoginConfig {
		redirectUri?: string;
	}

	// useLiff の型定義を修正して、liffId、ifWebMoveTo、loginConfig を引数として受け取る
	export function useLiff(
		liffId: string,
		ifWebMoveTo?: string | null,
		loginConfig?: LoginConfig | null,
	): {
		currentUser: Profile | null; // displayNameが未設定の場合は"Unknown"が設定されます
		liffControls: Liff | null; // 後方互換のため残しています
		liff: Liff | null; // liffControlsと同じ値です
		liffError: string | null;
		isMock: boolean;
	};

	// LiffProvider の型定義を修正して、ifWebMoveTo と loginConfig を含める
	export const LiffProvider: React.FC<{
		children: ReactNode;
		customError?: ComponentType<{ error: string }>; // customErrorをComponentTypeに修正して、型安全性を向上
		customLoading?: ReactNode;
		liffId: string; // liffId をプロパティとして追加
		ifWebMoveTo?: string; // ifWebMoveTo をプロパティとして追加
		mock?: boolean; // mockモードを明示的に設定するためのプロパティ
		loginConfig?: LoginConfig; // login設定を追加
	}>;

	export function useLiffContext(): LiffContextType;

	// サーバーサイド関数の型定義
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

	export interface TokenVerificationError {
		error: string;
		message: string;
		details?: unknown;
	}

	/**
	 * LINE IDトークンを検証し、ユーザー情報を取得します。
	 * サーバーサイドでのみ使用してください。
	 */
	export function verifyLiffToken(
		idToken: string,
		channelId: string,
	): Promise<VerifyTokenResult>;

	/**
	 * IDトークンからLINEユーザーIDを取得します。
	 * サーバーサイドでのみ使用してください。
	 */
	export function getLineUserIdFromToken(
		idToken: string,
		channelId: string,
	): Promise<string>;
}
