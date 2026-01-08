import { build } from 'esbuild'
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import postcss from 'postcss'
import postcssImport from 'postcss-import'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import chokidar from 'chokidar'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const appName = process.argv[2]
const watchMode = process.argv.includes('--watch') || process.argv.includes('-w')

if (!appName) {
  console.error('Usage: npm run build <appname> [--watch]')
  process.exit(1)
}

const appDir = join(__dirname, 'src/apps', appName)
const entryPoint = join(appDir, 'index.tsx')
const cssPath = join(appDir, 'styles.css')
const distDir = join(__dirname, 'dist')
const outfile = join(distDir, `${appName}.js`)

async function processCSS() {
  const cssContent = readFileSync(cssPath, 'utf-8')

  const result = await postcss([
    postcssImport({
      path: [__dirname, join(__dirname, 'node_modules')]
    }),
    tailwindcss({
      content: [
        join(appDir, '**/*.{tsx,jsx,ts,js}'),
        join(__dirname, 'node_modules/@openai/apps-sdk-ui/**/*.{js,jsx,ts,tsx}')
      ],
    }),
    autoprefixer,
  ]).process(cssContent, { from: cssPath })

  return result.css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*\n/g, '\n').trim()
}

async function buildApp() {
  try {
    mkdirSync(distDir, { recursive: true })

    console.log(`Building ${appName}...`)

    const appCss = await processCSS()
    const cssOutfile = outfile.replace(/\.js$/, '.css')

    await build({
      entryPoints: [entryPoint],
      bundle: true,
      format: 'esm',
      outfile,
      minify: false, // Disable minification to see full error messages
      jsx: 'automatic',
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.css': 'css',
      },
      define: {
        'process.env.NODE_ENV': '"development"', // Use development mode for better error messages
      },
      legalComments: 'none',
    })

    let componentCss = ''
    try {
      componentCss = readFileSync(cssOutfile, 'utf-8')
      unlinkSync(cssOutfile)
    } catch (e) {
      // No CSS file generated
    }

    const allCss = appCss + '\n' + componentCss
    const jsContent = readFileSync(outfile, 'utf-8')
    const finalJs = `const style=document.createElement('style');style.textContent=${JSON.stringify(allCss.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*\n/g, '\n').trim())};document.head.appendChild(style);${jsContent}`

    writeFileSync(outfile, finalJs)

    console.log(`✓ Built ${appName} → dist/${appName}.js`)
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
