import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import chokidar from 'chokidar'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const appName = process.argv[2]
const watchMode = process.argv.includes('--watch') || process.argv.includes('-w')

if (!appName) {
  console.error('Usage: node build.js <appname> [--watch]')
  process.exit(1)
}

const appDir = resolve(__dirname, 'src/apps', appName)
const entryPoint = resolve(appDir, 'index.tsx')
const stylesCssPath = resolve(appDir, 'styles.css')
const distDir = resolve(__dirname, 'dist')
const outfile = `${appName}.js`

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

async function buildApp() {
  try {
    console.log(`Building ${appName}...`)

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
        minify: false,
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

    console.log(`✓ Built ${appName} → dist/${appName}.html`)
  } catch (error) {
    console.error(`✗ Build failed for ${appName}:`, error)
    if (!watchMode) {
      process.exit(1)
    }
  }
}

async function watchApp() {
  console.log(`\n👀 Watching for changes in ${appName}...`)
  console.log('   Press Ctrl+C to stop\n')

  // Watch app files
  const appDir = join(__dirname, 'src/apps', appName)
  const libDir = join(__dirname, 'src/lib')

  const watcher = chokidar.watch([
    join(appDir, '**/*.{tsx,ts,jsx,js,css}'),
    join(libDir, '**/*.{tsx,ts,jsx,js}'),
  ], {
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
      await buildApp()
    }, 100)
  })

  watcher.on('ready', () => {
    console.log('✓ Watch mode active')
  })

  // Initial build
  await buildApp()
}

if (watchMode) {
  watchApp()
} else {
  buildApp()
}
