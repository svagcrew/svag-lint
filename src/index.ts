import dedent from 'dedent'
import { promises as fs } from 'fs'
import _ from 'lodash'
import path from 'path'
import {
  defineCliApp,
  getPackageJson,
  isFileExists,
  log,
  setPackageJsonData,
  spawn,
  validateOrThrow,
} from 'svag-cli-utils'
import z from 'zod'

defineCliApp(async ({ cwd, command, flags, argr }) => {
  const { packageJsonDir, packageJsonPath } = await getPackageJson({ cwd })

  const createConfigFile = async () => {
    log.green('Creating eslint config file...')
    const configPath = path.resolve(packageJsonDir, 'eslint.config.js')
    const { fileExists: configExists } = await isFileExists({ filePath: configPath })
    if (configExists) {
      log.toMemory.green(`${configPath}: Eslint config file already exists`)
      return
    }
    const configName = validateOrThrow({
      zod: z.enum(['base', 'node']),
      text: 'Invalid config name',
      data: flags.config || flags.c || 'base',
    })

    const configContent = dedent`const getSvagEslint${_.capitalize(configName)}Configs = require('svag-lint/configs/${configName}')
    /** @type {import('eslint').Linter.FlatConfig[]} */
    module.exports = [...getSvagEslint${_.capitalize(configName)}Configs()]
    `
    await fs.writeFile(configPath, configContent + '\n')
    log.toMemory.green(`${configPath}: eslint config file created`)
  }

  const installDeps = async () => {
    log.green('Installing dependencies...')
    await spawn({ cwd: packageJsonDir, command: 'pnpm i -D svag-lint@latest' })
    log.toMemory.green(`${packageJsonPath}: dependencies installed`)
  }

  const addScriptToPackageJson = async () => {
    log.green('Adding "lint" script to package.json...')
    const { packageJsonData, packageJsonPath } = await getPackageJson({ cwd: packageJsonDir })
    if (!packageJsonData.scripts?.lint) {
      if (!packageJsonData.scripts) {
        packageJsonData.scripts = {}
      }
      packageJsonData.scripts.lint = 'svag-lint lint'
      await setPackageJsonData({ cwd: packageJsonDir, packageJsonData })
      log.toMemory.green(`${packageJsonPath}: script "lint" added`)
    } else {
      log.toMemory.green(`${packageJsonPath}: script "lint" already exists`)
    }
  }

  switch (command) {
    case 'create-config-file': {
      await createConfigFile()
      break
    }
    case 'install-deps': {
      await installDeps()
      break
    }
    case 'add-script-to-package-json': {
      await addScriptToPackageJson()
      break
    }
    case 'init': {
      await installDeps()
      await createConfigFile()
      await addScriptToPackageJson()
      break
    }
    case 'lint': {
      await spawn({
        cwd: packageJsonDir,
        command: `pnpm eslint --color --cache --cache-location ./node_modules/.cache/.eslintcache . ${argr.join(' ')}`,
      })
      break
    }
    case 'h': {
      log.black(`Commands:
install-deps
create-config-file
add-script-to-package-json
init — all above together
lint — eslint ...`)
      break
    }
    case 'ping': {
      await spawn({ cwd: packageJsonDir, command: 'echo pong' })
      break
    }
    default: {
      log.red('Unknown command:', command)
      break
    }
  }
})
