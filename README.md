# ChatGPT Apps SDK Builder

A development environment for building chat app UIs—create UIs for your Warps and ChatGPT apps in general.

## Project Structure

```
src/apps/<appname>/
  index.tsx       # App entry point
  styles.css      # App styles (Tailwind)
```

## Build an App

```bash
node build.js <appname>
```

Outputs: `dist/<appname>.html` - Single standalone HTML file ready for ChatGPT Apps

## Serve Apps

```bash
node server.js
```

Server serves the HTML file directly with optional live reload in dev mode.

Access at: `http://localhost:3000/<appname>`

## Example Apps

- `hello` - Hello world with OpenAI Apps SDK components
- `counter` - Simple counter with state management
- `example` - Demonstrates using `useToolOutput` hook

## Creating a New App

1. Create directory: `src/apps/myapp/`
2. Add `index.tsx` with React component that mounts to `root` element
3. Add `styles.css`:
   ```css
   @import 'tailwindcss';
   @import '../../../node_modules/@openai/apps-sdk-ui/dist/es/styles/index.css';
   @source '../../../node_modules/@openai/apps-sdk-ui';
   ```
4. Build: `node build.js myapp`
5. Serve: `node server.js`
6. Access: `http://localhost:3000/myapp`

## Using the Tool Output Hook

Access data from ChatGPT using the `useToolOutput` hook:

```tsx
import { useToolOutput } from '../../lib/hooks'

interface MyData {
  message: string
  items: string[]
}

function App() {
  const data = useToolOutput<MyData>()

  return (
    <div>
      <p>{data?.message}</p>
      <ul>
        {data?.items?.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}
```

The hook automatically reads from `window.openai.toolOutput` which is injected by ChatGPT when your app runs in the iframe.

## Bundle Specifications

- Built with Vite for optimal performance
- Format: Single standalone HTML file with full document structure
- Structure follows [ChatGPT Apps format](https://developers.openai.com/apps-sdk/build/mcp-server#bundle-for-the-iframe)
- **Dark mode support**: Automatically adapts to ChatGPT's theme via `window.openai.theme`
- OpenAI Apps SDK UI styles included with `light-dark()` CSS functions
- Tailwind CSS purged to only used classes
- ~700-850KB per app (includes React, ReactDOM, OpenAI SDK UI, Tailwind)
- Compatible with ChatGPT iframe sandbox
- Ready to upload to GitHub and use directly

### Dark Mode

All apps automatically support dark mode through:
- `data-theme` attribute on the `<html>` element (values: `light`, `dark`, `auto`)
- `color-scheme` meta tag for native browser dark mode
- Automatic theme detection from `window.openai.theme`
- OpenAI Apps SDK UI components with built-in dark mode support

The apps will automatically adapt when ChatGPT switches between light and dark themes.

## Distribution

Built apps in `dist/` are committed to the repo for static hosting. Use raw GitHub URLs to reference them in your MCP server.

## ChatGPT Apps

- [Apps SDK Quickstart](https://developers.openai.com/apps-sdk/quickstart) - Get started building ChatGPT apps
- [ChatGPT Apps Documentation](https://developers.openai.com/apps-sdk) - Full docs and guides
- [Model Context Protocol Docs](https://modelcontextprotocol.io/docs/sdk) - MCP SDK and protocol reference
