import { program } from '@/index'
import { startSolana } from './startSolana'
import { ConfigParams } from '@/lib/createDefaultConfig'

export const startCommand = (solvConfig: ConfigParams) => {
  const { cmds } = solvConfig.locale
  program
    .command('start')
    .description(cmds.start)
    .action(() => {
      startSolana()
    })
}
