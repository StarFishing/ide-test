export const IDebugService = Symbol('@byted-apaas/debug-service');

export interface IDebugService {
  start(): Promise<void>;
}
