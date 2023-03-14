import { Autowired, Injectable } from "@opensumi/di";
import { RPCService } from '@opensumi/ide-connection/lib/common/proxy';
import { CommunicationChannels, IShellNodeService, IShellService, IShellServiceServerPath, StdEvents } from "../common";
import { v4 as uuidV4 } from "uuid";
import { IWorkspaceService } from "@opensumi/ide-workspace";
import { URI } from '@opensumi/ide-utils';

@Injectable()
export class ShellService extends RPCService implements IShellService {
  @Autowired(IShellServiceServerPath)
  private shellNodeService: IShellNodeService;

  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  private callChannels: Record<string, StdEvents & {
    onError: (e: string) => void;
    onExit: (e: string) => void;
  }> = {};

  // 展示消息时调用后端服务
  async exec(command: string, callback: StdEvents) {
    const callId = uuidV4();

    return new Promise(async (resolve, reject) => {
      this.callChannels[callId] = {
        ...callback,
        onError: (errorMessage) => {
          reject(new Error(errorMessage));
        },
        onExit: (returnData: string) => {
          resolve(JSON.parse(returnData));
        }
      };
      const cwd = new URI((await this.workspaceService.roots)[0].uri).path.toString();
      this.shellNodeService.exec(command, callId, {
        cwd,
      });
    });
  };

  /**
   * 用于后端将运行数据回调给前端
   * @param callId 标记一次调用的 ID
   * @param channel 通道
   * @param data 数据
   */
  _callback(callId: string, channel: CommunicationChannels, data: string) {
    this.callChannels[callId]?.[channel]?.(data);
  }
}
