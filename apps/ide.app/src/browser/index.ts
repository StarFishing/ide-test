import '@opensumi/ide-i18n/lib/browser';
import { ExpressFileServerModule } from '@opensumi/ide-express-file-server/lib/browser';
import '@opensumi/ide-core-browser/lib/style/index.less';
import '@opensumi/ide-core-browser/lib/style/icon.less';

import { renderApp } from './render-app';
import { CommonBrowserModules } from './common-modules';
import { layoutConfig } from './layout-config';
import './main.less';
import './styles.less';

renderApp({
  modules: [
    ...CommonBrowserModules,
    ExpressFileServerModule,
  ],
  layoutConfig,
  useCdnIcon: false,
  useExperimentalShadowDom: false,
  workspacePreferenceDirName: '.vscode',
  defaultPreferences: {
    'general.theme': 'apaas-default',
    'general.icon': 'apaas-icons',
    'files.exclude': {
      // "**/.**": true,
      "**/debug.param.json": true,
      "component**": true,
      "Dockerfile": true,
      // ".kldx**": true, // TODO 临时不隐藏，方便调试 debug
      // ".vscode**": true, // TODO 临时不隐藏，方便调试 debug
      "**/package.json": true,
      "**/node_modules/**": true
    }
  },
  defaultPanels: {
  },
});
