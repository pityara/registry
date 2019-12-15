import { useState } from 'react';

export default function useDialogSwitch(
  initialState: boolean = false,
): [
    boolean,
    () => void,
    () => void,
  ] {
  const [visible, setVisible] = useState(initialState);

  const handleCloseDialog = (): void => visible && setVisible(false);
  const handleOpenDialog = (): void => !visible && setVisible(true);

  return [visible, handleOpenDialog, handleCloseDialog];
}
