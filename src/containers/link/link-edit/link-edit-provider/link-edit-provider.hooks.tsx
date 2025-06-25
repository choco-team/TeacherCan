import { useContext } from 'react';
import {
  LinkEditActionContext,
  LinkEditStateContext,
} from './link-edit-provider';

export const useLinkEditState = () => {
  const value = useContext(LinkEditStateContext);

  if (!value) {
    throw Error(
      'useLinkEditState must be used within a LinkEditProvider. Make sure that the component is wrapped in the LinkEditProvider.',
    );
  }

  return value;
};

export const useLinkEditAction = () => {
  const value = useContext(LinkEditActionContext);

  if (!value) {
    throw Error(
      'useLinkEditAction must be used within a LinkEditProvider. Make sure that the component is wrapped in the LinkEditProvider.',
    );
  }

  return value;
};
