import React from 'react';

import {
  CommandService,
  ComponentContribution,
  ComponentRegistry,
  Domain,
  useInjectable
} from '@opensumi/ide-core-browser';
import debounce from 'lodash/debounce';

import { Button } from "@kunlun/kunlun-design";
import { CONTEXT_IN_DEBUG_MODE, DEBUG_COMMANDS } from "@opensumi/ide-debug";
import { IShellService } from "@byted-apaas/ide-shell-service/src/common";
import { EditorCollectionService } from "@opensumi/ide-editor";
import type { IEditorOptions } from '@opensumi/monaco-editor-core/esm/vs/editor/common/config/editorOptions';

import { IEditorDocumentModelService } from "@opensumi/ide-editor/lib/browser";
import { IWorkspaceService } from "@opensumi/ide-workspace";
import { URI } from "@opensumi/ide-utils";
import { IDebugService } from "../common";

const DebugView = () => {
  const commandService = useInjectable<CommandService>(CommandService);
  const ShellService = useInjectable<IShellService>(IShellService);
  const debugService = useInjectable<IDebugService>(IDebugService);

  React.useEffect(() => {
  }, []);
  return <Button onClick={async () => {
    // await debugService.start();
    await commandService.executeCommand(DEBUG_COMMANDS.START.id);
    setTimeout(async () => {
      const result = await ShellService.exec('kldx function debug test', {
        onStdOut: (data) => {
          console.log(data);
        },
        onStdErr: (data) => {
          console.log(data);
        },
      })
      console.log('result', result);
    }, 5000)
  }
  }>开始调试</Button>
}

const editorOption: IEditorOptions = {
  fontWeight: 'normal',
  glyphMargin: false,
  folding: true,
  selectOnLineNumbers: false,
  hideCursorInOverviewRuler: true,
  selectionHighlight: false,
  overviewRulerBorder: false,
  scrollBeyondLastLine: false,
  renderLineHighlight: 'none',
  fixedOverflowWidgets: true,
  acceptSuggestionOnEnter: 'smart',
  minimap: {
    enabled: false,
  },
  guides: {
    highlightActiveIndentation: false,
    indentation: false,
    bracketPairs: false,
  },
  scrollbar: {
    horizontal: 'visible',
    vertical: 'hidden',
    handleMouseWheel: true,
  },
  formatOnType: true,
  contextmenu: false,
  automaticLayout: true,
};
const DebugParamsEditor = () => {
  const editorService = useInjectable<EditorCollectionService>(EditorCollectionService);
  const documentService = useInjectable<IEditorDocumentModelService>(IEditorDocumentModelService);
  const workspaceService = useInjectable<IWorkspaceService>(IWorkspaceService);
  const paramEditorRef = React.createRef<HTMLDivElement>();
  const bindDebugParamsFile = async () => {
    if (paramEditorRef.current) {
      const editor = editorService.createCodeEditor(paramEditorRef.current, editorOption);
      const {monacoEditor} = editor;
      setTimeout(() => {
        editor.layout();
      })

      const uri = new URI((await workspaceService.roots)?.[0]?.uri).resolve('./debug_params.json');
      const docModel = await documentService.createModelReference(uri);
      const monacoModel = docModel.instance.getMonacoModel();
      monacoModel.onDidChangeContent(
        debounce(() => {
          docModel.instance.save(undefined, 2)
        }, 1000)
      )
      monacoEditor.setModel(monacoModel)
    }
  }
  React.useEffect(() => {
    bindDebugParamsFile().catch(console.error)
  }, [paramEditorRef.current]);
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
      height: 'calc(100% - 40px)'
    }
    }>
      <div>
        参数编辑器
      </div>
      <div ref={paramEditorRef} style={{flex: 'auto'}}/>
    </div>
  )
};

@Domain(ComponentContribution)
export class DebugContribution implements ComponentContribution {
  registerComponent(registry: ComponentRegistry) {
    const debugComponentRegistryInfo = registry.getComponentRegistryInfo('@opensumi/ide-debug');
    if (debugComponentRegistryInfo?.views) {
      debugComponentRegistryInfo.views = debugComponentRegistryInfo?.views.filter((view) => view.id !== 'debug-welcome');
      debugComponentRegistryInfo.views.forEach((view) => {
        view.when = `${CONTEXT_IN_DEBUG_MODE.equalsTo(true)}`;
      })
      debugComponentRegistryInfo.views.push({
        component: DebugParamsEditor,
        id: 'Debug-Params-Editor',
        name: 'Debug Welcome',
        when: `${CONTEXT_IN_DEBUG_MODE.equalsTo(false)}`,
      })
    }

    if (debugComponentRegistryInfo?.options?.titleComponent) {
      debugComponentRegistryInfo.options.titleComponent = DebugView;
    }
  }
}
