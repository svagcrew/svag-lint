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
      log.toMemory.black(`${configPath}: eslint config file already exists`)
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
    log.toMemory.black(`${configPath}: eslint config file created`)
  }

  const setVscodeSettings = async () => {
    log.green('Setting vscode settings...')
    const vscodeSettingsPath = path.resolve(packageJsonDir, '.vscode/settings.json')
    const { fileExists: vscodeSettingsExists } = await isFileExists({ filePath: vscodeSettingsPath })
    const vscodeSettingsData = vscodeSettingsExists ? JSON.parse(await fs.readFile(vscodeSettingsPath, 'utf-8')) : {}
    let somethingDone = false
    if (!vscodeSettingsExists) {
      await fs.mkdir(path.dirname(vscodeSettingsPath), { recursive: true })
      await fs.writeFile(vscodeSettingsPath, '{}\n')
    }
    if (vscodeSettingsData['eslint.workingDirectories'] === undefined) {
      vscodeSettingsData['eslint.workingDirectories'] = [{ mode: 'auto' }]
      somethingDone = true
    }
    if (vscodeSettingsData['eslint.experimental.useFlatConfig'] === undefined) {
      vscodeSettingsData['eslint.experimental.useFlatConfig'] = true
      somethingDone = true
    }
    if (somethingDone) {
      await fs.writeFile(vscodeSettingsPath, JSON.stringify(vscodeSettingsData, null, 2) + '\n')
      log.toMemory.black(`${vscodeSettingsPath}: vscode settings updated`)
    } else {
      log.toMemory.black(`${vscodeSettingsPath}: vscode settings already up to date`)
    }
  }

  const installDeps = async () => {
    log.green('Installing dependencies...')
    await spawn({ cwd: packageJsonDir, command: 'pnpm i -D svag-lint@latest eslint' })
    log.toMemory.black(`${packageJsonPath}: dependencies installed`)
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
      log.toMemory.black(`${packageJsonPath}: script "lint" added`)
    } else {
      log.toMemory.black(`${packageJsonPath}: script "lint" already exists`)
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
    case 'set-vscode-settings': {
      await setVscodeSettings()
      break
    }
    case 'init': {
      await installDeps()
      await createConfigFile()
      await addScriptToPackageJson()
      await setVscodeSettings()
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
set-vscode-settings
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
