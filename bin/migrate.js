#!/usr/bin/env node

/**
 * @holykzm/use-liff から @kanketsu/use-liff への移行スクリプト
 * 使用方法: npx @kanketsu/use-liff migrate
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OLD_PACKAGE = '@holykzm/use-liff';
const NEW_PACKAGE = '@kanketsu/use-liff';

// カラー出力
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// プロジェクトのルートディレクトリを確認
const projectRoot = process.cwd();
const packageJsonPath = path.join(projectRoot, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  error('package.json が見つかりません。プロジェクトのルートディレクトリで実行してください。');
}

log('🚀 @holykzm/use-liff から @kanketsu/use-liff への移行を開始します...\n', 'blue');

// 1. package.json の更新
log('📦 package.json を更新中...', 'yellow');
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  let updated = false;

  // dependencies
  if (packageJson.dependencies && packageJson.dependencies[OLD_PACKAGE]) {
    packageJson.dependencies[NEW_PACKAGE] = packageJson.dependencies[OLD_PACKAGE];
    delete packageJson.dependencies[OLD_PACKAGE];
    updated = true;
  }

  // devDependencies
  if (packageJson.devDependencies && packageJson.devDependencies[OLD_PACKAGE]) {
    packageJson.devDependencies[NEW_PACKAGE] = packageJson.devDependencies[OLD_PACKAGE];
    delete packageJson.devDependencies[OLD_PACKAGE];
    updated = true;
  }

  // peerDependencies
  if (packageJson.peerDependencies && packageJson.peerDependencies[OLD_PACKAGE]) {
    packageJson.peerDependencies[NEW_PACKAGE] = packageJson.peerDependencies[OLD_PACKAGE];
    delete packageJson.peerDependencies[OLD_PACKAGE];
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    success('package.json を更新しました');
  } else {
    warning('package.json に @holykzm/use-liff が見つかりませんでした');
  }
} catch (err) {
  error(`package.json の読み込みに失敗しました: ${err.message}`);
}

// 2. ソースファイルの更新
log('\n📝 ソースファイルを更新中...', 'yellow');

function shouldIgnoreDir(dirName) {
  const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.next', '.cache', 'coverage'];
  return ignoreDirs.includes(dirName);
}

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(OLD_PACKAGE)) {
      content = content.replace(new RegExp(OLD_PACKAGE.replace(/\//g, '\\/'), 'g'), NEW_PACKAGE);
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
  } catch (err) {
    warning(`ファイルの更新に失敗しました: ${filePath} - ${err.message}`);
  }
  return false;
}

function walkDir(dir, fileExtensions, fileCount = { count: 0 }) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!shouldIgnoreDir(file)) {
        walkDir(filePath, fileExtensions, fileCount);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (fileExtensions.includes(ext)) {
        if (updateFile(filePath)) {
          fileCount.count++;
          log(`  ✓ ${path.relative(projectRoot, filePath)}`, 'green');
        }
      }
    }
  }

  return fileCount.count;
}

const fileExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
const updatedCount = walkDir(projectRoot, fileExtensions);

if (updatedCount > 0) {
  success(`${updatedCount} 個のファイルを更新しました`);
} else {
  info('更新が必要なファイルは見つかりませんでした');
}

// 3. package-lock.json の更新（npm install で自動的に更新される）
log('\n📥 パッケージを再インストール中...', 'yellow');
try {
  execSync('npm install', { stdio: 'inherit', cwd: projectRoot });
  success('パッケージのインストールが完了しました');
} catch (err) {
  warning('npm install の実行に失敗しました。手動で実行してください: npm install');
}

// 4. 完了メッセージ
log('\n🎉 移行が完了しました！\n', 'green');
log('次のステップ:', 'blue');
log('  1. ビルドを実行して確認: npm run build');
log('  2. 型チェック（TypeScript使用時）: npx tsc --noEmit');
log('  3. テストを実行: npm test');
log('\n詳細な移行ガイド:', 'blue');
log('  https://github.com/kanketsu-jp/use-liff/blob/main/docs/migration-guide.md\n');

