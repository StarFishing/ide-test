import { BrowserModule } from "@opensumi/ide-core-browser";
import { Provider, Injectable } from "@opensumi/di";
import { DebugContribution } from "./debug.contribution";
import { TopBarContribution } from "./topBar.contribution";
import { LayoutContribution } from "./layout.contribution";
import { IDebugService } from "../common";
import { DebugService } from "./debug.service";

@Injectable()
export class aPaaSLowCodeModule extends BrowserModule {
  providers: Provider[] = [
    TopBarContribution,
    DebugContribution,
    // LayoutContribution
    {
      token: IDebugService,
      useClass: DebugService
    }
  ];
}
