/**
 * データベース保存の例
 * 
 * このファイルには、様々なデータベースにLINE IDとクエリパラメータを保存する
 * 汎用的な例が含まれています。
 * 
 * 実際の実装では、使用するデータベースに応じて適切なコードを選択してください。
 */

import { verifyLiffToken } from "@holykzm/use-liff/server";

/**
 * 共通のデータ型定義
 */
interface UserData {
  lineUserId: string;
  queryParams: Record<string, string>;
  createdAt: Date;
  // 必要に応じて追加フィールド
  name?: string;
  picture?: string;
  email?: string;
}

/**
 * ============================================
 * Supabase の例
 * ============================================
 */
async function saveToSupabase(
  lineUserId: string,
  queryParams: Record<string, string>,
  tokenResult?: { name?: string; picture?: string; email?: string }
) {
  try {
    // Supabaseクライアントのインポート（実際の実装では適切にインポート）
    // import { createClient } from '@supabase/supabase-js';
    // const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

    const userData: UserData = {
      lineUserId, // ここでLINE IDを使用
      queryParams, // ここでクエリパラメータを使用
      createdAt: new Date(),
      name: tokenResult?.name,
      picture: tokenResult?.picture,
      email: tokenResult?.email,
    };

    // Supabaseに保存
    // const { data, error } = await supabase
    //   .from('users')
    //   .insert([userData])
    //   .select();

    // if (error) {
    //   throw error;
    // }

    // return data;
    console.log("Save to Supabase:", userData);
  } catch (error) {
    console.error("Failed to save to Supabase:", error);
    throw error;
  }
}

/**
 * ============================================
 * Firestore の例
 * ============================================
 */
async function saveToFirestore(
  lineUserId: string,
  queryParams: Record<string, string>,
  tokenResult?: { name?: string; picture?: string; email?: string }
) {
  try {
    // Firestoreクライアントのインポート（実際の実装では適切にインポート）
    // import { getFirestore, collection, addDoc } from 'firebase/firestore';
    // import { initializeApp } from 'firebase/app';
    // const app = initializeApp({ /* config */ });
    // const db = getFirestore(app);

    const userData: UserData = {
      lineUserId, // ここでLINE IDを使用
      queryParams, // ここでクエリパラメータを使用
      createdAt: new Date(),
      name: tokenResult?.name,
      picture: tokenResult?.picture,
      email: tokenResult?.email,
    };

    // Firestoreに保存
    // const docRef = await addDoc(collection(db, 'users'), userData);
    // return docRef.id;

    console.log("Save to Firestore:", userData);
  } catch (error) {
    console.error("Failed to save to Firestore:", error);
    throw error;
  }
}

/**
 * ============================================
 * PostgreSQL (Prisma) の例
 * ============================================
 */
async function saveToPostgreSQLWithPrisma(
  lineUserId: string,
  queryParams: Record<string, string>,
  tokenResult?: { name?: string; picture?: string; email?: string }
) {
  try {
    // Prismaクライアントのインポート（実際の実装では適切にインポート）
    // import { PrismaClient } from '@prisma/client';
    // const prisma = new PrismaClient();

    // Prismaに保存
    // const user = await prisma.user.create({
    //   data: {
    //     lineUserId, // ここでLINE IDを使用
    //     queryParams: JSON.stringify(queryParams), // ここでクエリパラメータを使用（JSON形式で保存）
    //     createdAt: new Date(),
    //     name: tokenResult?.name,
    //     picture: tokenResult?.picture,
    //     email: tokenResult?.email,
    //   },
    // });
    // return user;

    console.log("Save to PostgreSQL (Prisma):", {
      lineUserId,
      queryParams,
      tokenResult,
    });
  } catch (error) {
    console.error("Failed to save to PostgreSQL:", error);
    throw error;
  }
}

/**
 * ============================================
 * MySQL の例
 * ============================================
 */
async function saveToMySQL(
  lineUserId: string,
  queryParams: Record<string, string>,
  tokenResult?: { name?: string; picture?: string; email?: string }
) {
  try {
    // MySQLクライアントのインポート（実際の実装では適切にインポート）
    // import mysql from 'mysql2/promise';
    // const connection = await mysql.createConnection({
    //   host: process.env.DB_HOST,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    // });

    // MySQLに保存
    // const [result] = await connection.execute(
    //   `INSERT INTO users (line_user_id, query_params, created_at, name, picture, email)
    //    VALUES (?, ?, ?, ?, ?, ?)`,
    //   [
    //     lineUserId, // ここでLINE IDを使用
    //     JSON.stringify(queryParams), // ここでクエリパラメータを使用
    //     new Date(),
    //     tokenResult?.name || null,
    //     tokenResult?.picture || null,
    //     tokenResult?.email || null,
    //   ]
    // );
    // return result;

    console.log("Save to MySQL:", {
      lineUserId,
      queryParams,
      tokenResult,
    });
  } catch (error) {
    console.error("Failed to save to MySQL:", error);
    throw error;
  }
}

/**
 * ============================================
 * MongoDB の例
 * ============================================
 */
async function saveToMongoDB(
  lineUserId: string,
  queryParams: Record<string, string>,
  tokenResult?: { name?: string; picture?: string; email?: string }
) {
  try {
    // MongoDBクライアントのインポート（実際の実装では適切にインポート）
    // import { MongoClient } from 'mongodb';
    // const client = new MongoClient(process.env.MONGODB_URI!);
    // await client.connect();
    // const db = client.db();
    // const collection = db.collection('users');

    const userData: UserData = {
      lineUserId, // ここでLINE IDを使用
      queryParams, // ここでクエリパラメータを使用
      createdAt: new Date(),
      name: tokenResult?.name,
      picture: tokenResult?.picture,
      email: tokenResult?.email,
    };

    // MongoDBに保存
    // const result = await collection.insertOne(userData);
    // return result.insertedId;

    console.log("Save to MongoDB:", userData);
  } catch (error) {
    console.error("Failed to save to MongoDB:", error);
    throw error;
  }
}

/**
 * ============================================
 * 汎用的な保存関数の例
 * ============================================
 * 
 * この関数は、データベースの種類に関係なく使用できる
 * 汎用的なインターフェースを提供します。
 */
export async function saveUserData(
  idToken: string,
  queryParams: Record<string, string>,
  channelId: string,
  databaseType: 'supabase' | 'firestore' | 'postgresql' | 'mysql' | 'mongodb'
) {
  try {
    // トークンを検証してLINE IDを取得
    const tokenResult = await verifyLiffToken(idToken, channelId);
    const lineUserId = tokenResult.userId;

    // データベースの種類に応じて保存
    switch (databaseType) {
      case 'supabase':
        await saveToSupabase(lineUserId, queryParams, tokenResult);
        break;
      case 'firestore':
        await saveToFirestore(lineUserId, queryParams, tokenResult);
        break;
      case 'postgresql':
        await saveToPostgreSQLWithPrisma(lineUserId, queryParams, tokenResult);
        break;
      case 'mysql':
        await saveToMySQL(lineUserId, queryParams, tokenResult);
        break;
      case 'mongodb':
        await saveToMongoDB(lineUserId, queryParams, tokenResult);
        break;
      default:
        throw new Error(`Unsupported database type: ${databaseType}`);
    }

    return {
      success: true,
      userId: lineUserId,
    };
  } catch (error) {
    console.error("Failed to save user data:", error);
    throw error;
  }
}

/**
 * ============================================
 * 使用例（Next.js API Routes）
 * ============================================
 */
export async function exampleAPIHandler(request: Request) {
  try {
    const body = await request.json();
    const { idToken, queryParams } = body;

    const channelId = process.env.LINE_CHANNEL_ID!;
    const databaseType = process.env.DATABASE_TYPE as 'supabase' | 'firestore' | 'postgresql' | 'mysql' | 'mongodb';

    // 汎用的な保存関数を使用
    const result = await saveUserData(idToken, queryParams, channelId, databaseType);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to save user data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * 注意事項:
 * 
 * 1. 実際の実装では、適切なデータベースクライアントライブラリをインストールしてください
 * 2. 環境変数を適切に設定してください
 * 3. エラーハンドリングを適切に実装してください
 * 4. トランザクション処理が必要な場合は、適切に実装してください
 * 5. データベースのスキーマ設計を適切に行ってください
 */

