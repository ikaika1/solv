import { VERSION_JITO_TESTNET } from '@/config/versionConfig'
import { spawnSync } from 'child_process'
import { chmodSync } from 'fs'
import { join } from 'path'

// installJito 関数の定義
export const installJito = (version = VERSION_JITO_TESTNET) => {
  const tag = `v${version}-jito-mod`
  const scriptPath = join(__dirname, 'installJito.sh')  // シェルスクリプトのパス

  try {
    // スクリプトに実行権限を付与
    console.log('Adding execute permissions to the script.')
    chmodSync(scriptPath, '755')  // 実行権限を付与

    // 環境変数 TAG に tag を渡してスクリプトを実行
    console.log(`Executing install script from ${scriptPath} with TAG=${tag}`)
    const execResult = spawnSync('sh', [scriptPath], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, TAG: tag }  // 環境変数 TAG を設定
    })

    if (execResult.status !== 0) {
      throw new Error('Failed to execute install script.')
    }

    console.log(`Jito-Mod version ${tag} installed successfully.`)
  } catch (error) {
    console.error('An error occurred during the installation of Jito-Mod:', error)
    process.exit(1)  // エラー発生時にプロセスを終了
  }
}
