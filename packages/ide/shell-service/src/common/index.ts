export const IShellServiceServerPath = 'IShellServiceServerPath';
export const IShellService = Symbol('IShellService');
export const IShellNodeService = Symbol('IShellNodeService');

export interface StdEvents {
  onStdOut?: (out: string) => void;
  onStdErr?: (out: string) => void;
}

export type CommunicationChannels = keyof StdEvents | 'onError' | 'onExit';

export interface IShellService {
  exec(command: string, stdEvents?: StdEvents);

  _callback(callId: string, channel: CommunicationChannels, data: string);
}

export interface NodeExecOptions {
  env?: Record<string, string>;
  cwd: string;
}

export interface IShellNodeService {
  exec(command: string, callId: string, options: NodeExecOptions);
}
