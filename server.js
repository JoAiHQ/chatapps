import express from 'express'
import { existsSync, readFileSync, statSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = process.env.PORT || 3000
const distDir = join(__dirname, 'dist')
const devMode = process.env.NODE_ENV !== 'production'

const app = express()

// Store file modification times for live reload
const fileMtimes = new Map()

app.get('/:appname', (req, res) => {
  const appName = req.params.appname
  const filePath = join(distDir, `${appName}.js`)

  if (!existsSync(filePath)) {
    return res.status(404).send(`App "${appName}" not found. Build it first with: node build.js ${appName}`)
  }

  const stats = statSync(filePath)
  fileMtimes.set(appName, stats.mtimeMs)

  const jsBundle = readFileSync(filePath, 'utf-8')

  // Add live reload script in dev mode
  const liveReloadScript = devMode ? `
    <script>
      (function() {
        let lastCheck = ${stats.mtimeMs};
        setInterval(async () => {
          try {
            const response = await fetch('/${appName}/check');
            const data = await response.json();
            if (data.mtime > lastCheck) {
              console.log('🔄 File changed, reloading...');
              window.location.reload();
            }
          } catch (e) {
            // Ignore errors
          }
        }, 500);
      })();
    </script>
  ` : ''

  const html = `
    <div id="root"></div>
    <script type="module">${jsBundle}</script>
    ${liveReloadScript}
  `

  res.setHeader('Content-Type', 'text/html')
  res.removeHeader('X-Frame-Options')
  res.send(html)
})

// Live reload check endpoint
app.get('/:appname/check', (req, res) => {
  const appName = req.params.appname
  const filePath = join(distDir, `${appName}.js`)

  if (!existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' })
  }

  const stats = statSync(filePath)
  const currentMtime = fileMtimes.get(appName) || 0

  res.json({
    mtime: stats.mtimeMs,
    changed: stats.mtimeMs > currentMtime
  })

  if (stats.mtimeMs > currentMtime) {
    fileMtimes.set(appName, stats.mtimeMs)
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', routes: ['/:appname', '/:appname/check', '/health'] })
})

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`)
  console.log(`📱 Access apps at: http://localhost:${PORT}/<appname>\n`)
})
