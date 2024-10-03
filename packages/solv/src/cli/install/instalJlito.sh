#!/bin/bash

# Jito-Modのバージョンを指定（環境変数から取得）
export TAG=${TAG}

# Jito-Solanaリポジトリをクローン
echo "Cloning jito-solana repository..."
git clone https://github.com/ikaika1/jito-solana.git --recurse-submodules
cd jito-solana || exit 1

# タグにチェックアウト
echo "Checking out tag $TAG..."
git checkout tags/"$TAG"
git submodule update --init --recursive

# 現在のコミットハッシュを取得し、インストールスクリプトを実行
CI_COMMIT=$(git rev-parse HEAD)
echo "Running cargo-install-all.sh script..."
scripts/cargo-install-all.sh --validator-only ~/.local/share/solana/install/releases/"$TAG"

# 既存のactive_releaseシンボリックリンクを削除し、新しいリンクを作成
echo "Updating active_release symlink..."
rm /home/solv/.local/share/solana/install/active_release
ln -s /home/solv/.local/share/solana/install/releases/"$TAG" /home/solv/.local/share/solana/install/active_release

echo "Jito-Mod version $TAG installed successfully and symlink updated."
