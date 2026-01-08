/**
 * Type definitions for window.openai API
 * Based on OpenAI Apps SDK documentation
 */

export interface OpenAiGlobals {
  toolInput: unknown;
  toolOutput: unknown;
  toolResponseMetadata: unknown;
  widgetState: unknown;
  theme: 'light' | 'dark' | 'auto';
  displayMode: 'inline' | 'pip' | 'fullscreen';
  maxHeight: number;
  safeArea: { top: number; right: number; bottom: number; left: number };
  view: 'mobile' | 'desktop';
  userAgent: string;
  locale: string;
}

export interface OpenAiApi {
  toolInput: OpenAiGlobals['toolInput'];
  toolOutput: OpenAiGlobals['toolOutput'];
  toolResponseMetadata: OpenAiGlobals['toolResponseMetadata'];
  widgetState: OpenAiGlobals['widgetState'];
  theme: OpenAiGlobals['theme'];
  displayMode: OpenAiGlobals['displayMode'];
  maxHeight: OpenAiGlobals['maxHeight'];
  safeArea: OpenAiGlobals['safeArea'];
  view: OpenAiGlobals['view'];
  userAgent: OpenAiGlobals['userAgent'];
  locale: OpenAiGlobals['locale'];
  setWidgetState: (state: unknown) => void;
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  sendFollowUpMessage: (options: { prompt: string }) => Promise<void>;
  uploadFile: (file: File) => Promise<{ fileId: string }>;
  getFileDownloadUrl: (options: { fileId: string }) => Promise<{ downloadUrl: string }>;
  requestDisplayMode: (options: { mode: 'inline' | 'pip' | 'fullscreen' }) => Promise<void>;
  requestModal: (options: unknown) => Promise<void>;
  notifyIntrinsicHeight: (height: number) => void;
  openExternal: (options: { href: string }) => void;
  setOpenInAppUrl: (options: { href: string }) => void;
  requestClose: () => void;
}

export interface SetGlobalsEvent extends CustomEvent {
  detail: {
    globals: Partial<OpenAiGlobals>;
  };
}

export const SET_GLOBALS_EVENT_TYPE = 'openai:set_globals';

/**
 * Widget state that can be persisted
 */
export type WidgetState = Record<string, unknown> | null;

declare global {
  interface Window {
    openai?: OpenAiApi;
  }
}
