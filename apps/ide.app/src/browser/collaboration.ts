import {
  CollaborationModuleContribution,
  UserInfo
} from '@opensumi/ide-collaboration';
import { Domain } from '@opensumi/ide-core-common';

@Domain(CollaborationModuleContribution)
export class SampleContribution implements CollaborationModuleContribution {
  info: UserInfo = {
    id: 'test@xx.com',
    nickname: 'test'
  };
}
