# 🚀 ChatApps

**ChatApps** is a framework for building native AI applications that integrate [supported blockchains](https://docs.joai.ai/warps/chains) into popular AI platforms like ChatGPT, Claude, Cursor, and other MCP-enabled interfaces. It turns conversations into on-chain and off-chain execution across all supported chains.

### 🤖 What are ChatApps?

ChatApps are native AI applications that can be published to app stores like the ChatGPT App Store. They combine:

- **Warp Protocol**: Open-source protocol for skills that act on-chain and off-chain.
- **Dynamic MCP**: JoAi automatically spins up MCP servers per Warp on demand. See [MCP documentation](https://docs.joai.ai/protocols/mcp) for details.
- **Warp UI**: Visual representation for Warps, compatible with the ChatGPT Apps SDK.
- **Cloud Wallet**: Full abstraction with Warp Wallets via cloud wallet providers (TEEs for wallet signatures).
- **Open-source ChatApp framework**: For building Warp UIs.

### ☁️ Managed ChatApps Platform

To simplify and accelerate deployment, [JoAi](https://joai.ai/chatapps) provides a fully managed infrastructure that eliminates the need to manage MCP servers or implement complex OAuth authentication. Warps can be:

- **Directly published** to the ChatGPT App Store.
- **Used instantly** across supported clients including Claude, Cursor, and more.

The Warp Protocol and ChatApp framework come with [Skills](https://skills.md) that automate the near-instant generation of new Warps.

### ✨ Key Features

- **Fast Development**: Because of the ease of use and speed in creating Warps, ChatApps are the fastest and most scalable way to create native ChatGPT Apps today.
- **Multi-Client Support**: Works with ChatGPT, Claude, Cursor, and other MCP-enabled interfaces.
- **Secure Authentication**: Cloud wallets + OAuth handle authentication and hosted execution; TEEs secure signatures.
- **Native Blockchain Integration**: Warp UI renders inside ChatGPT Apps for state, actions, and confirmations with verified on-chain execution.

### 📦 Publishing to App Stores

ChatApps can be published to the ChatGPT App Store and other compatible platforms. Publishing tooling helps ship ChatApps at scale.

## 🏁 Getting Started

To build ChatApps:

1. Create Warps using the [Warp Protocol](https://docs.joai.ai/warps/general).
2. Dynamic MCP endpoints are automatically configured by JoAi.
3. Build Warp UI components compatible with ChatGPT Apps SDK.
4. Set up Cloud Wallet integration.
5. Publish to app stores.

## 📚 Resources

- **GitHub Repository**: [https://github.com/JoAiHQ](https://github.com/JoAiHQ) - Open-source ChatApp framework and examples.
- **Warp Protocol Documentation**: [Warp Protocol](https://docs.joai.ai/warps/general)
- **MCP Documentation**: [Dynamic MCP details](https://docs.joai.ai/protocols/mcp)

---

# 🛠️ Development Guide

This repository provides the development environment for building the **Warp UI** components mentioned above.

## Project Structure

```
src/apps/<appname>/
  index.tsx       # App entry point
  styles.css      # App styles (Tailwind)
```

## 🏗️ Build an App

```bash
node build.js <appname>
```

Outputs: `dist/<appname>.html` - Single standalone HTML file ready for ChatGPT Apps.

## 🖥️ Serve Apps

```bash
node server.js
```

Access at: `http://localhost:3000/<appname>`

## ⚡ Creating a New App

1. Create directory: `src/apps/myapp/`
2. Add `index.tsx` with a React component that mounts to the `root` element.
3. Add `styles.css`:
   ```css
   @import 'tailwindcss';
   @import '../../../node_modules/@openai/apps-sdk-ui/dist/es/styles/index.css';
   @source '../../../node_modules/@openai/apps-sdk-ui';
   ```
4. Build: `node build.js myapp`
5. Serve: `node server.js`

## 🎣 Using the Tool Output Hook

Access data from the AI using the `useToolOutput` hook:

```tsx
import { useToolOutput } from '../../lib/hooks'

function App() {
  const data = useToolOutput<MyData>()
  return <div>{data?.message}</div>
}
```

The hook automatically reads from `window.openai.toolOutput` which is injected by the host platform.

## 📦 Bundle Specifications

- **Single HTML**: Format follows [ChatGPT Apps format](https://developers.openai.com/apps-sdk/build/mcp-server#bundle-for-the-iframe).
- **Dark Mode**: Automatically adapts to the host theme via `window.openai.theme`.
- **Lightweight**: Minified JavaScript and CSS, Tailwind purged to only used classes.
- **Standalone**: Ready to upload and use directly via raw GitHub URLs.
