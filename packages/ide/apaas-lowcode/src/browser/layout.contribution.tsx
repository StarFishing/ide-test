import React from 'react';

import {
  ComponentContribution,
  ComponentRegistry,
  Domain,
  SlotRendererContribution, SlotRendererRegistry, SlotLocation, ComponentRegistryInfo
} from '@opensumi/ide-core-browser';

export const LeftSlotRenderer: (props: {
  className: string;
  components: ComponentRegistryInfo[];
}) => any = ({ components }) => {
  console.log(components);
  const tmp = components.map(item => item.views[0].component!);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {tmp.map((Component, index) => (
        <Component key={index} />
      ))}
    </div>
  );
};
@Domain(SlotRendererContribution)
export class LayoutContribution implements SlotRendererContribution {
  registerRenderer(registry: SlotRendererRegistry): void {
    registry.registerSlotRenderer(SlotLocation.left, LeftSlotRenderer)
  }
}
