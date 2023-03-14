import { IShellNodeService, IShellServiceServerPath } from "../common";
import { ShellNodeService } from "./shell.service";
import { Injectable, Provider } from "@opensumi/di";
import { NodeModule } from "@opensumi/ide-core-node";

@Injectable()
export class ShellModule extends NodeModule {
  providers: Provider[] = [
    {
      token: IShellNodeService,
      useClass: ShellNodeService
    }
  ];

  backServices = [
    {
      servicePath: IShellServiceServerPath, // 双端通信通道唯一路径
      token: IShellNodeService // 关联后端服务
    }
  ];
}
