import { Injectable } from "@opensumi/di";
import { RPCService } from "@opensumi/ide-connection/lib/common/proxy";
import { IShellNodeService, IShellService, NodeExecOptions } from "../common";
import { spawn } from 'child_process';

@Injectable()
export class ShellNodeService extends RPCService implements IShellNodeService {
  async exec(command: string, callId: string, options: NodeExecOptions) {
    const client = this.rpcClient![0] as IShellService;
    const [cmd, ...args] = command.split(' ');
    const output = {
      stdout: '',
      stderr: '',
    };
    const cp = spawn(cmd, args, {
      stdio: 'pipe',
      cwd: options.cwd,
      env: process.env,
    });
    cp.stderr.on('data', (data) => {
      output.stderr += String(data);
      client._callback(callId, 'onStdErr', String(data));
    });
    cp.stdout.on('data', (data) => {
      output.stdout += String(data);
      client._callback(callId, 'onStdOut', String(data));
    });
    cp.on('error', (e) => {
      client._callback(callId, 'onError', e.message);
    });
    cp.on('exit', (exitCode) => {
      client._callback(callId, 'onExit', JSON.stringify({
        exitCode,
        stderr: output.stderr,
        stdout: output.stdout,
      }));
    });
  }
}
