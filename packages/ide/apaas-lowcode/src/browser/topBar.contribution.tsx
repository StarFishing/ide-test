import React from 'react';

import { ComponentContribution, ComponentRegistry, Domain, } from '@opensumi/ide-core-browser';

export const CONTAINER_ID = '@byted-apaas/top-bar-container';
export const COMPONENT_ID = '@byted-apaas/top-bar';

export const Toolbar = () => (
  <div
    style={{
      background: '#FFFFFF',
      lineHeight: '52px',
      flex: 1,
      padding: '0 20px',
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'space-between'
    }}
  >
    <div className={'title'}>
      函数编辑
    </div>
    <div className={'action'}>

    </div>
  </div>
);

@Domain(ComponentContribution)
export class TopBarContribution implements ComponentContribution {
  registerComponent(registry: ComponentRegistry) {
    registry.register(
      COMPONENT_ID,
      [
        {
          id: COMPONENT_ID,
          component: Toolbar,
          name: '测试'
        }
      ],
      {
        containerId: CONTAINER_ID
      }
    );
  }
}
