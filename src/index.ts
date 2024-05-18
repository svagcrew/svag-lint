import dedent from 'dedent'
import { promises as fs } from 'fs'
import _ from 'lodash'
import path from 'path'
import {
  defineCliApp,
  getPackageJson,
  isFileExists,
  log,
  setJsonDataItem,
  setPackageJsonDataItem,
  spawn,
  validateOrThrow,
} from 'svag-cli-utils'
import z from 'zod'

defineCliApp(async ({ cwd, command, args, flags, argr }) => {
  const createConfigFile = async () => {
    cwd = path.resolve(cwd, args[0] || '.')
    const { packageJsonDir } = await getPackageJson({ cwd })
    log.green('Creating eslint config file...')
    const configPath = path.resolve(packageJsonDir, 'eslint.config.js')
    const { fileExists: configExists } = await isFileExists({ filePath: configPath })
    if (configExists) {
      log.toMemory.black(`${configPath}: eslint config file already exists`)
      return
    }
    const configName = validateOrThrow({
      zod: z.enum(['base']),
      text: 'Invalid config name',
      data: flags.config || flags.c || 'base',
    })

    const configContent = dedent`import getSvagEslint${_.capitalize(configName)}Configs from 'svag-lint/configs/${configName}.js'
    /** @type {import('eslint').Linter.FlatConfig[]} */
    export default [...getSvagEslint${_.capitalize(configName)}Configs()]
    `
    await fs.writeFile(configPath, configContent + '\n')
    log.toMemory.black(`${configPath}: eslint config file created`)
  }

  const setVscodeSettings = async () => {
    cwd = path.resolve(cwd, args[0] || '.')
    const { packageJsonDir } = await getPackageJson({ cwd })
    log.green('Setting vscode settings...')
    const vscodeSettingsPath = path.resolve(packageJsonDir, '.vscode/settings.json')
    const { fileExists: vscodeSettingsExists } = await isFileExists({ filePath: vscodeSettingsPath })
    const vscodeSettingsData = vscodeSettingsExists ? JSON.parse(await fs.readFile(vscodeSettingsPath, 'utf-8')) : {}
    let somethingDone = false
    if (vscodeSettingsData['eslint.workingDirectories'] === undefined) {
      await setJsonDataItem({
        filePath: vscodeSettingsPath,
        key: 'eslint\\.workingDirectories',
        value: [{ mode: 'auto' }],
      })
      somethingDone = true
    }
    if (vscodeSettingsData['eslint.experimental.useFlatConfig'] === undefined) {
      await setJsonDataItem({
        filePath: vscodeSettingsPath,
        key: 'eslint\\.experimental\\.useFlatConfig',
        value: true,
      })
      somethingDone = true
    }
    if (vscodeSettingsData['typescript.preferences.importModuleSpecifier'] === undefined) {
      await setJsonDataItem({
        filePath: vscodeSettingsPath,
        key: 'typescript\\.preferences\\.importModuleSpecifier',
        value: 'non-relative',
      })
      somethingDone = true
    }
    if (somethingDone) {
      log.toMemory.black(`${vscodeSettingsPath}: vscode settings updated`)
    } else {
      log.toMemory.black(`${vscodeSettingsPath}: vscode settings already up to date`)
    }
  }

  const installDeps = async () => {
    cwd = path.resolve(cwd, args[0] || '.')
    const { packageJsonDir, packageJsonPath } = await getPackageJson({ cwd })
    log.green('Installing dependencies...')
    await spawn({ cwd: packageJsonDir, command: 'pnpm i -D svag-lint@latest eslint' })
    log.toMemory.black(`${packageJsonPath}: dependencies installed`)
  }

  const addScriptToPackageJson = async () => {
    cwd = path.resolve(cwd, args[0] || '.')
    const { packageJsonDir, packageJsonData, packageJsonPath } = await getPackageJson({ cwd })
    log.green('Adding "lint" script to package.json...')
    if (!packageJsonData.scripts?.lint) {
      await setPackageJsonDataItem({ cwd: packageJsonDir, key: 'scripts.lint', value: 'svag-lint lint' })
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
      const { packageJsonDir } = await getPackageJson({ cwd })
      await spawn({
        cwd: packageJsonDir,
        command: `pnpm eslint --color --cache --cache-location ./node_modules/.cache/.eslintcache . ${argr.join(' ')}`,
        exitOnFailure: true,
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
      const { packageJsonDir } = await getPackageJson({ cwd })
      await spawn({ cwd: packageJsonDir, command: 'echo pong' })
      break
    }
    default: {
      log.red('Unknown command:', command)
      break
    }
  }
})
