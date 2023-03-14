import { BrowserModule } from "@opensumi/ide-core-browser";
import { Injectable, Provider } from "@opensumi/di";
import { HideUiContribution } from "./hideUi.contribution";

@Injectable()
export class aPaaSUIModule extends BrowserModule {
  providers: Provider[] = [
    HideUiContribution,
  ];
}
