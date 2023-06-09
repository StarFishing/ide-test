import { Injector } from '@opensumi/di';
import { IClientAppOpts } from '@opensumi/ide-core-browser';
import { ToolbarActionBasedLayout } from '@opensumi/ide-core-browser/lib/components';
import { TextmateLanguageGrammarContribution } from './grammar/index.contribution';
import { ClientApp } from "@opensumi/ide-core-browser/lib/bootstrap/app";

export async function renderApp(opts: IClientAppOpts) {
  const injector = new Injector();
  injector.addProviders(TextmateLanguageGrammarContribution);

  const hostname = window.location.hostname;
  const query = new URLSearchParams(window.location.search);
  // 线上的静态服务和 IDE 后端是一个 Server
  const serverPort = process.env.DEVELOPMENT ? 8000 : window.location.port;
  const staticServerPort = process.env.DEVELOPMENT ? 8080 : window.location.port;
  const webviewEndpointPort = process.env.DEVELOPMENT ? 8899 : window.location.port;
  opts.workspaceDir = opts.workspaceDir || query.get('workspaceDir') || process.env.WORKSPACE_DIR;

  opts.extensionDir = opts.extensionDir || process.env.EXTENSION_DIR;
  opts.injector = injector;
  opts.wsPath = process.env.WS_PATH || window.location.protocol == 'https:' ? `wss://${hostname}:${serverPort}` : `ws://${hostname}:${serverPort}`;
  opts.extWorkerHost = opts.extWorkerHost || process.env.EXTENSION_WORKER_HOST || `http://${hostname}:${staticServerPort}/worker-host.js`;
  opts.staticServicePath = `http://${hostname}:${serverPort}`;
  const anotherHostName = process.env.WEBVIEW_HOST || hostname;
  opts.webviewEndpoint = `http://${anotherHostName}:${webviewEndpointPort}/webview`;
  opts.layoutComponent = ToolbarActionBasedLayout;

  const app = new ClientApp(opts);

  app.fireOnReload = () => {
    window.location.reload();
  };

  app.start(document.getElementById('main')!, 'web');
}
