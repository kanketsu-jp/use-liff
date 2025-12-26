"use client";
import {
  useState,
  useEffect,
  type ReactNode,
  createContext,
  useContext,
  type ComponentType,
} from "react";
import type { Liff } from "@line/liff";
import type { Profile } from "@liff/get-profile";

/**
 * LIFFアプリケーションのコンテキスト型を定義します。
 * 
 * @interface LiffContextType
 * @property {Profile | null} currentUser - 現在のLINEユーザープロフィール情報。未ログイン時はnull。displayNameが未設定の場合は"Unknown"が設定されます。
 * @property {Liff | null} liffControls - LIFF SDKのインスタンス。初期化前またはエラー時はnull。（後方互換のため残しています）
 * @property {Liff | null} liff - LIFF SDKのインスタンス。liffControlsと同じ値です。
 * @property {string | null} liffError - LIFFの初期化時などに発生したエラーメッセージ。エラーがない場合はnull。
 * @property {boolean} isMock - モックモードで動作しているかどうかを示すフラグ。
 */
interface LiffContextType {
  currentUser: Profile | null;
  liffControls: Liff | null;
  liff: Liff | null;
  liffError: string | null;
  isMock: boolean;
}

/**
 * LIFFアプリケーションのコンテキスト。
 * LIFFの状態をアプリケーション全体で共有するために使用します。
 * 
 * @type {React.Context<LiffContextType>}
 */
const LiffContext = createContext<LiffContextType>({
  currentUser: null,
  liffControls: null,
  liff: null,
  liffError: null,
  isMock: false,
});

/**
 * モック用のLIFFコントロールを作成します。
 * 開発環境でLINEプラットフォームに接続せずにテストするためのモックを提供します。
 * 
 * @returns {unknown} Liffインターフェースと互換性のあるモックオブジェクト
 */
const createMockLiff = (): unknown => {
  return {
    init: ({ liffId }: { liffId: string }) => Promise.resolve(),
    getOS: () => 'web',
    getLanguage: () => 'ja',
    getVersion: () => '2.27.3',
    getLineVersion: () => null,
    isInClient: () => true,
    isLoggedIn: () => true,
    login: (config?: { redirectUri?: string }) => {
      if (config?.redirectUri) {
        console.log(`Mock login with redirectUri: ${config.redirectUri}`);
      }
    },
    logout: () => { },
    getAccessToken: () => 'mock-access-token',
    getIDToken: () => 'mock-id-token',
    getDecodedIDToken: () => ({
      iss: 'https://access.line.me',
      sub: 'mock-user-id',
      aud: 'mock-client-id',
      exp: 0,
      iat: 0,
      auth_time: 0,
      nonce: '',
      amr: ['pwd'],
      name: 'Mock User',
      picture: '/favicon.ico', // プロジェクトのFaviconを使用
      email: 'mock@example.com'
    }),
    getContext: () => ({ type: 'utou', utouId: 'mock-utou-id' }),
    getProfile: () => Promise.resolve({
      userId: 'mock-user-id',
      displayName: 'Mock User',
      pictureUrl: '/favicon.ico', // プロジェクトのFaviconを使用
      statusMessage: 'This is a mock user'
    }),
    getFriendship: () => Promise.resolve({ friendFlag: true }),
    sendMessages: (messages: unknown) => {
      alert(`メッセージ送信: ${JSON.stringify(messages)}`);
      return Promise.resolve();
    },
    openWindow: ({ url }: { url: string }) => {
      window.open(url, '_blank');
    },
    closeWindow: () => {
      alert('ウィンドウを閉じようとしました');
    },
    scanCode: () => Promise.reject(new Error('この機能はモックでは使用できません')),
    scanCodeV2: () => Promise.reject(new Error('この機能はモックでは使用できません')),
    getAId: () => Promise.resolve('mock-aid'),
    getIFLKAnalysisUA: () => Promise.resolve('{}'),
    shareTargetPicker: (messages: unknown) => {
      alert(`共有ターゲットピッカー: ${JSON.stringify(messages)}`);
      return Promise.resolve({ status: 'success' });
    },
    permanentLink: {
      createUrl: () => 'https://example.com/mock-permanent-link',
      createUrlBy: () => 'https://example.com/mock-permanent-link',
      setExtraQueryParam: () => { }
    },
    i18n: {
      setLang: () => { }
    },
    permission: {
      query: () => Promise.resolve({ state: 'granted' }),
      requestAll: () => Promise.resolve({ state: 'granted' })
    },
    use: () => { },
    isApiAvailable: () => true,
    // 最新SDKで追加された可能性のある機能
    getAdvertisingId: () => Promise.resolve('mock-advertising-id'),
    getIsVideoAutoPlay: () => Promise.resolve(true),
    getAppLanguage: () => Promise.resolve('ja'),
    getOrigins: () => Promise.resolve(['https://example.com']),
    getProfilePlus: () => Promise.resolve({
      userId: 'mock-user-id',
      displayName: 'Mock User',
      pictureUrl: '/favicon.ico',
      statusMessage: 'This is a mock user',
      email: 'mock@example.com'
    }),
    isSubWindow: () => false,
    subWindow: {
      open: () => Promise.resolve({}),
      close: () => Promise.resolve(),
      postMessage: () => Promise.resolve(),
      on: () => { },
      off: () => { }
    },
    addToHomeScreen: {
      isAvailable: () => Promise.resolve(false),
      prompt: () => Promise.resolve()
    },
    createShortcutOnHomeScreen: () => Promise.resolve(),
    analytics: {
      init: () => { },
      set: () => { },
      send: () => { },
      track: () => { }
    },
    iap: {
      isAvailable: () => Promise.resolve(false),
      getPurchasableItems: () => Promise.resolve([]),
      purchase: () => Promise.reject(new Error('この機能はモックでは使用できません'))
    },
    initPlugins: () => Promise.resolve(),
    // 他の必要なメソッドがあれば追加
  } as unknown as Liff;
};

/**
 * プロフィール情報にdisplayNameのフォールバックを適用します。
 * displayNameが未設定の場合は"Unknown"を設定します。
 * 
 * @param {Profile} profile - 元のプロフィール情報
 * @returns {Profile} displayNameがフォールバック適用済みのプロフィール情報
 */
const applyDisplayNameFallback = (profile: Profile): Profile => {
  return {
    ...profile,
    displayName: profile.displayName || 'Unknown'
  };
};

/**
 * モック用のプロフィール情報を作成します。
 * 開発環境でテスト用のユーザープロフィールを提供します。
 * 
 * @returns {Profile} ダミーのユーザープロフィール
 */
const createMockProfile = (): Profile => {
  return applyDisplayNameFallback({
    userId: 'mock-user-id',
    displayName: 'Mock User',
    pictureUrl: '/favicon.ico', // プロジェクトのFaviconを使用
    statusMessage: 'This is a mock user'
  });
};

/**
 * デフォルトのエラー表示コンポーネント（軽いカードスタイル）
 */
const DefaultError: React.FC<{ error: string }> = ({ error }) => (
  <div
    style={{
      margin: "16px",
      padding: "16px",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      background: "#f8fafc",
      color: "#0f172a",
      fontSize: "14px",
      lineHeight: "1.5",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    }}
  >
    <strong style={{ display: "block", marginBottom: "4px" }}>Something went wrong</strong>
    <span style={{ color: "#475569" }}>{error}</span>
  </div>
);

/**
 * デフォルトのローディング表示コンポーネント（軽いカードスタイル）
 */
const DefaultLoading: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      margin: "16px",
      padding: "16px",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      background: "#f8fafc",
      color: "#0f172a",
      fontSize: "14px",
      lineHeight: "1.5",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    }}
  >
    <span
      style={{
        width: "14px",
        height: "14px",
        border: "2px solid #cbd5e1",
        borderTopColor: "#0ea5e9",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.9s linear infinite",
      }}
    />
    <span>Loading...</span>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

/**
 * liff.login()に渡す設定オプションの型定義
 */
interface LoginConfig {
  redirectUri?: string;
}

/**
 * LIFF SDKを初期化し、ユーザー情報を取得するカスタムフックです。
 * モックモードをサポートしており、環境変数または明示的な設定で有効化できます。
 * 
 * @param {string} liffId - LINE Developers ConsoleでLIFFアプリに割り当てられたID
 * @param {string | null} ifWebMoveTo - LINEアプリ以外で開かれた場合にリダイレクトするURL（省略可）
 * @param {LoginConfig | null} loginConfig - liff.login()に渡す設定オプション（省略可）
 * @returns {object} LIFFの状態を含むオブジェクト
 * @returns {Profile | null} object.currentUser - 現在のLINEユーザープロフィール情報（displayNameが未設定の場合は"Unknown"が設定されます）
 * @returns {Liff | null} object.liffControls - LIFF SDKのインスタンス（後方互換のため残しています）
 * @returns {Liff | null} object.liff - LIFF SDKのインスタンス（liffControlsと同じ値です）
 * @returns {string | null} object.liffError - 発生したエラーメッセージ
 * @returns {boolean} object.isMock - モックモードで動作しているかどうか
 * 
 * @example
 * const { currentUser, liff, liffError, isMock } = useLiff('1234567890-abcdefgh');
 * // currentUser.displayName は常に文字列（未設定時は"Unknown"）
 * 
 * @example
 * // クエリパラメータを引き継ぐ場合
 * const { currentUser, liff } = useLiff('1234567890-abcdefgh', null, {
 *   redirectUri: window.location.href
 * });
 */
export const useLiff = (
  liffId: string,
  ifWebMoveTo: string | null = null,
  loginConfig: LoginConfig | null = null
) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [liffControls, setLiffControls] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState<boolean>(false);

  useEffect(() => {
    if (!liffId) {
      console.error(
        "LIFF ID is undefined. Please set it in your LiffProvider."
      );
      return;
    }

    // 環境変数でMOCKモードかどうかを判断
    const isLiffMockMode = typeof window !== 'undefined' && (
      (window as unknown as Record<string, unknown>).LIFF_MOCK === true ||
      process.env.NEXT_PUBLIC_LIFF_MOCK === 'true'
    );

    if (isLiffMockMode) {
      console.log("LIFF Mock Mode is enabled");
      const mockLiff = createMockLiff();
      setLiffControls(mockLiff as Liff);
      setCurrentUser(createMockProfile());
      setIsMock(true);
      return;
    }

    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        if (liff.getLineVersion() === null && ifWebMoveTo) {
          window.location.href = ifWebMoveTo;
          return;
        }

        liff
          .init({ liffId })
          .then(() => {
            setLiffControls(liff);
            if (liff.isLoggedIn()) {
              liff.getProfile().then((profile) => {
                setCurrentUser(applyDisplayNameFallback(profile));
              });
            } else {
              // loginConfigが指定されている場合は、その設定を使用
              if (loginConfig && loginConfig.redirectUri) {
                liff.login({ redirectUri: loginConfig.redirectUri });
              } else {
                liff.login();
              }
            }
          })
          .catch((error: Error) => {
            setLiffError(error.toString());
          });
      });
  }, [liffId, ifWebMoveTo, loginConfig]);

  return { currentUser, liffControls, liff: liffControls, liffError, isMock };
};

/**
 * LiffProviderのプロパティ型を定義します。
 * 
 * @interface LiffProviderProps
 * @property {ReactNode} children - プロバイダーの子要素
 * @property {ComponentType<{ error: string }>} [customError] - エラー発生時に表示するカスタムコンポーネント
 * @property {ReactNode} [customLoading] - ロード中に表示するカスタムコンポーネント
 * @property {string} liffId - LINE Developers ConsoleでLIFFアプリに割り当てられたID
 * @property {string} [ifWebMoveTo] - LINEアプリ以外で開かれた場合にリダイレクトするURL
 * @property {boolean} [mock] - モックモードを有効化するかどうか
 * @property {LoginConfig} [loginConfig] - liff.login()に渡す設定オプション
 */
interface LiffProviderProps {
  children: ReactNode;
  customError?: ComponentType<{ error: string }>; // customErrorをComponentTypeに修正して、型安全性を向上
  customLoading?: ReactNode;
  liffId: string;
  ifWebMoveTo?: string; // ifWebMoveTo をpropsとして追加
  mock?: boolean; // mockモードを明示的に設定するためのプロパティを追加
  loginConfig?: LoginConfig; // login設定を追加
}

/**
 * LIFFアプリケーションのプロバイダーコンポーネント。
 * LIFF SDKを初期化し、アプリケーション全体でLIFFの状態を共有します。
 * 
 * @component
 * @param {LiffProviderProps} props - コンポーネントのプロパティ
 * @param {ReactNode} props.children - プロバイダーの子要素
 * @param {ComponentType<{ error: string }>} [props.customError] - エラー発生時に表示するカスタムコンポーネント
 * @param {ReactNode} [props.customLoading] - ロード中に表示するカスタムコンポーネント
 * @param {string} props.liffId - LINE Developers ConsoleでLIFFアプリに割り当てられたID
 * @param {string} [props.ifWebMoveTo] - LINEアプリ以外で開かれた場合にリダイレクトするURL
 * @param {boolean} [props.mock] - モックモードを有効化するかどうか
 * @param {LoginConfig} [props.loginConfig] - liff.login()に渡す設定オプション
 * @returns {JSX.Element} LIFFプロバイダーコンポーネント
 * 
 * @example
 * <LiffProvider
 *   liffId="1234567890-abcdefgh"
 *   customError={CustomErrorComponent}
 *   customLoading={<LoadingSpinner />}
 *   ifWebMoveTo="https://example.com"
 *   mock={process.env.NODE_ENV === 'development'}
 * >
 *   <App />
 * </LiffProvider>
 * 
 * @example
 * // クエリパラメータを引き継ぐ場合
 * <LiffProvider
 *   liffId="1234567890-abcdefgh"
 *   loginConfig={{ redirectUri: window.location.href }}
 * >
 *   <App />
 * </LiffProvider>
 */
export const LiffProvider: React.FC<LiffProviderProps> = ({
  children,
  customError: CustomError,
  customLoading,
  liffId,
  ifWebMoveTo,
  mock,
  loginConfig,
}) => {
  // mockが明示的に指定されている場合は、そのままグローバル変数として設定
  useEffect(() => {
    if (typeof window !== 'undefined' && mock === true) {
      (window as unknown as Record<string, unknown>).LIFF_MOCK = true;
    }
  }, [mock]);

  const { currentUser, liffControls, liff, liffError, isMock } = useLiff(liffId, ifWebMoveTo, loginConfig || null);

  const errorComponent =
    liffError && (CustomError ? <CustomError error={liffError} /> : <DefaultError error={liffError} />);
  const loadingComponent = customLoading || <DefaultLoading />;

  return (
    <LiffContext.Provider value={{ currentUser, liffControls, liff, liffError, isMock }}>
      {errorComponent
        ? errorComponent
        : currentUser
          ? children
          : loadingComponent}
    </LiffContext.Provider>
  );
};

/**
 * LIFFコンテキストにアクセスするためのカスタムフック。
 * コンポーネント内でLIFFの状態やAPIを使用するために利用します。
 * 
 * @returns {LiffContextType} LIFFコンテキストの値
 * @returns {Profile | null} LiffContextType.currentUser - 現在のLINEユーザープロフィール情報（displayNameが未設定の場合は"Unknown"が設定されます）
 * @returns {Liff | null} LiffContextType.liffControls - LIFF SDKのインスタンス（後方互換のため残しています）
 * @returns {Liff | null} LiffContextType.liff - LIFF SDKのインスタンス（liffControlsと同じ値です）
 * @returns {string | null} LiffContextType.liffError - 発生したエラーメッセージ
 * @returns {boolean} LiffContextType.isMock - モックモードで動作しているかどうか
 * 
 * @example
 * const { currentUser, liff, liffError, isMock } = useLiffContext();
 * 
 * // ユーザー名を取得（displayNameは常に文字列なので、|| は不要です）
 * const userName = currentUser?.displayName; // "Unknown" がフォールバックされます
 * 
 * // メッセージを送信
 * const sendMessage = () => {
 *   if (liff) {
 *     liff.sendMessages([
 *       { type: 'text', text: 'こんにちは！' }
 *     ]);
 *   }
 * };
 */
export const useLiffContext = () => useContext(LiffContext);
