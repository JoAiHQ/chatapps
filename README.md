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

Outputs: `dist/<appname>.js` - Minified ESM bundle with inlined CSS

## Serve Apps

```bash
node server.js
```

Server wraps the bundle in minimal HTML: `<div id="root"></div><script type="module">{bundle}</script>`

Access at: `http://localhost:3000/<appname>`

## Example Apps

- `hello` - Hello world with OpenAI Apps SDK components
- `counter` - Simple counter with state management

## Creating a New App

1. Create directory: `src/apps/myapp/`
2. Add `index.tsx` with React component that mounts to `root` element
3. Add `styles.css` with `@import 'tailwindcss';`
4. Build: `node build.js myapp`
5. Serve: `node server.js`
6. Access: `http://localhost:3000/myapp`

## Bundle Specifications

- Format: ESM JavaScript module
- Minified with no comments (legalComments: 'none')
- CSS inlined via style injection at runtime
- OpenAI Apps SDK UI styles included
- Tailwind CSS purged to only used classes
- ~320KB per app (minified, includes React, ReactDOM, OpenAI SDK UI, Tailwind)
- Compatible with ChatGPT iframe sandbox

## Distribution

Built apps in `dist/` are committed to the repo for static hosting. Use raw GitHub links (e.g., `https://raw.githubusercontent.com/user/repo/main/dist/appname.js`) to reference them in your Warps for the UI.

## ChatGPT Apps

- [Apps SDK Quickstart](https://developers.openai.com/apps-sdk/quickstart) - Get started building ChatGPT apps
- [ChatGPT Apps Documentation](https://developers.openai.com/apps-sdk) - Full docs and guides
- [Model Context Protocol Docs](https://modelcontextprotocol.io/docs/sdk) - MCP SDK and protocol reference
