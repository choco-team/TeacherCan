import { PICK_TYPES } from './random-pick-constants';

export type RandomPickType = {
  id: string;
  createdAt: string;
  title: string;
  pickType: PickType;
  pickList: InnerPickListType[];
  options: OptionsType;
};

export type InnerPickListType = {
  id: string;
  value: string;
  isPicked: boolean;
  isUsed: boolean;
};

export type PickType = (typeof PICK_TYPES)[number]['type'];

type OptionsType = {
  isExcludingSelected: boolean;
  isHideResult: boolean;
  isMixingAnimation: boolean;
};
