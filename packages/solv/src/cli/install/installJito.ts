// 必要なモジュールをインポート
import { VERSION_JITO_TESTNET } from '@/config/versionConfig'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// __dirname を定義
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// installJito 関数の定義
export const installJito = (version = VERSION_JITO_TESTNET) => {
  // タグをフォーマット
  const tag = `v${version}-jito-mod`

  // クローン先のディレクトリを定義（ここではスクリプト実行ディレクトリ内にjito-solanaフォルダを作成）
  const cloneDir = join(__dirname, 'jito-solana')

  try {
    // 1. リポジトリをクローン
    console.log(`Cloning repository https://github.com/ikaika1/jito-solana into ${cloneDir}`)
    spawnSync('git', ['clone', 'https://github.com/ikaika1/jito-solana', cloneDir], {
      stdio: 'inherit',
      shell: true,
    })

    // 2. タグにチェックアウト
    console.log(`Checking out tag ${tag}`)
    spawnSync('git', ['checkout', `tags/${tag}`], {
      cwd: cloneDir,
      stdio: 'inherit',
      shell: true,
    })

    // 3. サブモジュールを初期化および更新
    console.log('Updating submodules')
    spawnSync('git', ['submodule', 'update', '--init', '--recursive'], {
      cwd: cloneDir,
      stdio: 'inherit',
      shell: true,
    })

    // 4. 現在のコミットハッシュを取得
    console.log('Retrieving current commit hash')
    const commitHashResult = spawnSync('git', ['rev-parse', 'HEAD'], {
      cwd: cloneDir,
      encoding: 'utf-8',
      shell: true,
    })

    if (commitHashResult.status !== 0) {
      throw new Error('Failed to retrieve commit hash')
    }

    const ciCommit = commitHashResult.stdout.trim()
    console.log(`Current commit hash: ${ciCommit}`)

    // 5. cargo-install-all.sh スクリプトを実行
    const installScript = join(cloneDir, 'scripts', 'cargo-install-all.sh')
    const installPath = join(
      process.env.HOME || process.env.USERPROFILE || '~',
      '.local',
      'share',
      'solana',
      'install',
      'releases',
      tag
    )

    console.log(`Running install script: ${installScript}`)
    spawnSync(
      'sh',
      [
        '-c',
        `CI_COMMIT=${ciCommit} ${installScript} --validator-only ${installPath}`,
      ],
      {
        cwd: cloneDir,
        stdio: 'inherit',
        shell: true,
      }
    )

    console.log(`Jito-Mod version ${tag} installed successfully.`)

  } catch (error) {
    console.error('An error occurred during the installation of Jito-Mod:', error)
    process.exit(1) // エラー時にプロセスを終了
  }
}
