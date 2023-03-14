import React from 'react';

import { Domain } from '@opensumi/ide-core-browser';
import { IMenuRegistry, MenuContribution, MenuId } from "@opensumi/ide-core-browser/lib/menu/next";
import { CommandContribution, CommandRegistry } from "@opensumi/ide-core-common";
import { ICON_THEME_TOGGLE_COMMAND, THEME_TOGGLE_COMMAND } from "@opensumi/ide-theme/lib/browser/theme.contribution";

@Domain(MenuContribution, CommandContribution)
export class HideUiContribution implements MenuContribution, CommandContribution {

  registerMenus(menus: IMenuRegistry) {
    console.log(menus.getMenubarItems());
    menus.unregisterMenuId(MenuId.SettingsIconMenu);
  }

  registerCommands(commands: CommandRegistry) {
    console.log(commands.getCommands());
    console.log(commands.getCommands().map(cmd => (`${cmd.id}: ${cmd.label}`)).join('\n'));
    // 禁用主题切换
    commands.unregisterCommand(THEME_TOGGLE_COMMAND.id)

    // 禁用文件图标切换
    commands.unregisterCommand(ICON_THEME_TOGGLE_COMMAND.id)
  }
}
