#!/bin/bash

# @holykzm/use-liff から @kanketsu/use-liff への移行スクリプト
# 使用方法: bash scripts/migrate.sh または ./scripts/migrate.sh

set -e

echo "🚀 @holykzm/use-liff から @kanketsu/use-liff への移行を開始します..."

# カラー出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# プロジェクトのルートディレクトリを確認
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ エラー: package.json が見つかりません。プロジェクトのルートディレクトリで実行してください。${NC}"
    exit 1
fi

# 1. package.json の更新
echo -e "${YELLOW}📦 package.json を更新中...${NC}"
if grep -q "@holykzm/use-liff" package.json; then
    # macOS と Linux の両方に対応
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's/"@holykzm\/use-liff"/"@kanketsu\/use-liff"/g' package.json
    else
        sed -i 's/"@holykzm\/use-liff"/"@kanketsu\/use-liff"/g' package.json
    fi
    echo -e "${GREEN}✅ package.json を更新しました${NC}"
else
    echo -e "${YELLOW}⚠️  package.json に @holykzm/use-liff が見つかりませんでした${NC}"
fi

# 2. ソースファイルの更新
echo -e "${YELLOW}📝 ソースファイルを更新中...${NC}"
FILE_COUNT=0

# TypeScript/JavaScript ファイル
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -not -path "./dist/*" \
    -not -path "./build/*" \
    -not -path "./.next/*" \
    | while read -r file; do
    if grep -q "@holykzm/use-liff" "$file"; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' 's/@holykzm\/use-liff/@kanketsu\/use-liff/g' "$file"
        else
            sed -i 's/@holykzm\/use-liff/@kanketsu\/use-liff/g' "$file"
        fi
        FILE_COUNT=$((FILE_COUNT + 1))
        echo -e "  ${GREEN}✓${NC} $file"
    fi
done

# JSON ファイル（tsconfig.json など）
find . -type f -name "*.json" \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -not -path "./package-lock.json" \
    | while read -r file; do
    if grep -q "@holykzm/use-liff" "$file"; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' 's/@holykzm\/use-liff/@kanketsu\/use-liff/g' "$file"
        else
            sed -i 's/@holykzm\/use-liff/@kanketsu\/use-liff/g' "$file"
        fi
        FILE_COUNT=$((FILE_COUNT + 1))
        echo -e "  ${GREEN}✓${NC} $file"
    fi
done

# 3. パッケージの再インストール
echo -e "${YELLOW}📥 パッケージを再インストール中...${NC}"
if command -v npm &> /dev/null; then
    npm install
    echo -e "${GREEN}✅ パッケージのインストールが完了しました${NC}"
else
    echo -e "${RED}❌ npm が見つかりません${NC}"
    exit 1
fi

# 4. 完了メッセージ
echo ""
echo -e "${GREEN}🎉 移行が完了しました！${NC}"
echo ""
echo "次のステップ:"
echo "  1. ビルドを実行して確認: npm run build"
echo "  2. 型チェック（TypeScript使用時）: npx tsc --noEmit"
echo "  3. テストを実行: npm test"
echo ""
echo "問題が発生した場合は、移行ガイドを参照してください:"
echo "  https://github.com/kanketsu-jp/use-liff/blob/main/docs/migration-guide.md"

