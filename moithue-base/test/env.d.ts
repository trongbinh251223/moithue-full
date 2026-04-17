import type { Env as WorkerEnv } from '../src/types/app';

declare module 'cloudflare:test' {
  interface ProvidedEnv extends WorkerEnv {}
}
