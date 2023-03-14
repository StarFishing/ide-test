import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { ShellService } from './shell.service';
import { IShellServiceServerPath, IShellService } from '../common';

@Injectable()
export class ShellModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: IShellService,
      useClass: ShellService
    },
  ];

  backServices = [
    {
      servicePath: IShellServiceServerPath, // 双端通信通道唯一路径
      clientToken: IShellService // 关联前端服务
    }
  ];
}
