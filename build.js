import { build } from 'esbuild'
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import postcss from 'postcss'
import postcssImport from 'postcss-import'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const appName = process.argv[2]

if (!appName) {
  console.error('Usage: npm run build <appname>')
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
      minify: true,
      jsx: 'automatic',
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.css': 'css',
      },
      define: {
        'process.env.NODE_ENV': '"production"',
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
    process.exit(1)
  }
}

buildApp()
