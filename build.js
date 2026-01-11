import { build } from 'vite'
import react from '@vitejs/plugin-react'
import {
  readFileSync,
  writeFileSync,
  existsSync,
  unlinkSync,
  readdirSync,
} from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import tailwindcss from '@tailwindcss/vite'
import chokidar from 'chokidar'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const appName = process.argv[2]
const watchMode = process.argv.includes('--watch') || process.argv.includes('-w')
const typecheck = !process.argv.includes('--no-typecheck')
let didTypecheck = false

if (watchMode && !appName) {
  console.error('Watch mode requires a specific app.')
  console.error('Usage: node build.js <brand/appname> [--watch] [--no-typecheck]')
  process.exit(1)
}

// Create a virtual entry plugin that includes CSS
function wrapEntryPlugin(virtualId, entryFile, cssFile) {
  return {
    name: `virtual-entry-wrapper:${entryFile}`,
    resolveId(id) {
      if (id === virtualId) return id
    },
    load(id) {
      if (id !== virtualId) return null

      return `
import ${JSON.stringify(cssFile)};
export * from ${JSON.stringify(entryFile)};
import ${JSON.stringify(entryFile)};
      `.trim()
    },
  }
}

async function typeCheck() {
  if (!typecheck || didTypecheck) {
    return
  }

  try {
    console.log('🔍 Running TypeScript check...')
    execSync('./node_modules/.bin/tsc --noEmit', {
      cwd: __dirname,
      stdio: 'inherit',
    })
    console.log('✓ TypeScript check passed')
    didTypecheck = true
  } catch (error) {
    console.error('✗ TypeScript check failed')
    if (!watchMode) {
      process.exit(1)
    }
    throw error
  }
}

async function buildApp(targetAppName) {
  try {
    console.log(`Building ${targetAppName}...`)

    // Run TypeScript check before building
    await typeCheck()

    const appDir = resolve(__dirname, 'src/apps', targetAppName)
    const entryPoint = resolve(appDir, 'index.tsx')
    const stylesCssPath = resolve(appDir, 'styles.css')
    const distDir = resolve(__dirname, 'dist')
    const outfile = `${targetAppName.replace(/\//g, '-')}.js`
    const virtualId = `\0virtual-entry:${entryPoint}`

    await build({
      configFile: false,
      root: appDir,
      plugins: [
        wrapEntryPlugin(virtualId, entryPoint, stylesCssPath),
        tailwindcss(),
        react(),
      ],
      build: {
        outDir: distDir,
        emptyOutDir: false,
        minify: 'esbuild',
        cssMinify: 'esbuild',
        cssCodeSplit: false,
        rollupOptions: {
          input: virtualId,
          output: {
            format: 'es',
            entryFileNames: outfile,
            inlineDynamicImports: true,
            assetFileNames: (info) => {
              if ((info.name || '').endsWith('.css')) {
                return outfile.replace(/\.js$/, '.css')
              }
              return `[name]-[hash][extname]`
            },
          },
        },
      },
    })

    // Read the generated JS and CSS files
    const jsPath = join(distDir, outfile)
    const cssPath = join(distDir, outfile.replace(/\.js$/, '.css'))
    const htmlPath = join(distDir, outfile.replace(/\.js$/, '.html'))

    const jsContent = readFileSync(jsPath, 'utf-8')
    let cssContent = ''

    if (existsSync(cssPath)) {
      cssContent = readFileSync(cssPath, 'utf-8')
      unlinkSync(cssPath)
    }

    // Delete the JS file since we're creating HTML
    unlinkSync(jsPath)

    // Create standalone HTML file with dark mode support
    // According to https://openai.github.io/apps-sdk-ui/?path=/docs/concepts-dark-mode--docs
    // The SDK uses light-dark() CSS function and data-theme attribute
    const html = `<!DOCTYPE html>
<html data-theme="auto">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<style>${cssContent}</style>
</head>
<body>
<div id="root"></div>
<script type="module">
// Support theme switching via window.openai.theme
if (window.openai?.theme) {
  document.documentElement.setAttribute('data-theme', window.openai.theme);
}
${jsContent}
</script>
</body>
</html>`

    writeFileSync(htmlPath, html.trim())

    console.log(`✓ Built ${targetAppName} → dist/${targetAppName}.html`)
  } catch (error) {
    console.error(`✗ Build failed for ${targetAppName}:`, error)
    if (!watchMode) {
      process.exit(1)
    }
  }
}

function listApps() {
  const appsRoot = resolve(__dirname, 'src/apps')
  const entries = []

  for (const entry of readdirSync(appsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const topLevel = entry.name
    const topLevelIndex = resolve(appsRoot, topLevel, 'index.tsx')
    if (existsSync(topLevelIndex)) {
      entries.push(topLevel)
      continue
    }
    const nestedDir = resolve(appsRoot, topLevel)
    for (const nested of readdirSync(nestedDir, { withFileTypes: true })) {
      if (!nested.isDirectory()) continue
      const nestedIndex = resolve(nestedDir, nested.name, 'index.tsx')
      if (existsSync(nestedIndex)) {
        entries.push(`${topLevel}/${nested.name}`)
      }
    }
  }

  return entries
}

async function watchApp() {
  console.log(`\n👀 Watching for changes in ${appName}...`)
  console.log('   Press Ctrl+C to stop\n')

  // Watch app files and brand folder for shared code
  const appDir = join(__dirname, 'src/apps', appName)
  const libDir = join(__dirname, 'src/lib')

  const watchPaths = [
    join(appDir, '**/*.{tsx,ts,jsx,js,css}'),
    join(libDir, '**/*.{tsx,ts,jsx,js}'),
  ]

  // If app is in a brand folder (e.g., multiversx/account), also watch the brand folder
  if (appName.includes('/')) {
    const brandFolder = appName.split('/')[0]
    const brandDir = join(__dirname, 'src/apps', brandFolder)
    watchPaths.push(join(brandDir, '*.{ts,tsx}')) // Watch shared helpers.ts, types.ts, etc.
  }

  const watcher = chokidar.watch(watchPaths, {
    ignored: /node_modules/,
    persistent: true,
  })

  let buildTimeout = null

  watcher.on('change', (path) => {
    console.log(`\n📝 File changed: ${path}`)

    // Debounce rebuilds
    if (buildTimeout) {
      clearTimeout(buildTimeout)
    }

    buildTimeout = setTimeout(async () => {
      console.log(`🔄 Rebuilding ${appName}...`)
      await buildApp(appName)
    }, 100)
  })

  watcher.on('ready', () => {
    console.log('✓ Watch mode active')
  })

  // Initial build
  await buildApp(appName)
}

async function main() {
  if (watchMode) {
    await watchApp()
    return
  }

  if (!appName) {
    const apps = listApps()
    if (apps.length === 0) {
      console.error('No apps found in src/apps.')
      process.exit(1)
    }
    console.log(`Building ${apps.length} apps...`)
    for (const targetAppName of apps) {
      await buildApp(targetAppName)
    }
    return
  }

  await buildApp(appName)
}

main()
