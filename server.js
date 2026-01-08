import express from 'express'
import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = process.env.PORT || 3000
const distDir = join(__dirname, 'dist')

const app = express()

app.get('/:appname', (req, res) => {
  const appName = req.params.appname
  const filePath = join(distDir, `${appName}.js`)

  if (!existsSync(filePath)) {
    return res.status(404).send(`App "${appName}" not found. Build it first with: node build.js ${appName}`)
  }

  const jsBundle = readFileSync(filePath, 'utf-8')
  const html = `<div id="root"></div><script type="module">${jsBundle}</script>`

  res.setHeader('Content-Type', 'text/html')
  res.removeHeader('X-Frame-Options')
  res.send(html)
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`Access apps at: http://localhost:${PORT}/<appname>`)
})
