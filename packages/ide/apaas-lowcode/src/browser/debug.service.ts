import { Autowired, Injectable } from "@opensumi/di";
import { DebugConfigurationManager } from "@opensumi/ide-debug/lib/browser/debug-configuration-manager";
import { IDebugService } from "../common";
import { IWorkspaceService } from "@opensumi/ide-workspace";
import { IDebugSessionManager } from "@opensumi/ide-debug";
import { DebugSessionManager } from "@opensumi/ide-debug/lib/browser/debug-session-manager";

@Injectable()
export class DebugService implements IDebugService{

  @Autowired(DebugConfigurationManager)
  protected readonly debugConfigurationManager: DebugConfigurationManager;

  @Autowired(IDebugSessionManager)
  protected debugSessionManager: DebugSessionManager;

  @Autowired(IWorkspaceService)
  private readonly workspaceService: IWorkspaceService;

  async start(): Promise<void> {
    await this.debugSessionManager.start({
      index: 0,
      workspaceFolderUri: (await this.workspaceService.roots)?.[0]?.uri,
      configuration: [
        {
          "type": "node",
          "request": "launch",
          "name": "NodeJs 云函数断点调试",
          "skipFiles": [
            "<node_internals>/**",
            "${workspaceFolder}/.kldx/**",
            "${workspaceFolder}/**/node_modules/**"
          ],
          "preLaunchTask": "PrepareDebugTask",
          "outputCapture": "std",
          "program": "${workspaceFolder}/.kldx/functionsFramework/nodejs/launch.js",
          "env": {
            "_LANE_NAME_": ""
          }
        }
      ]
    })
    // console.log('this.debugConfigurationManager.current', this.debugConfigurationManager.current);
  }
}
