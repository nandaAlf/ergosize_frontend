import * as React from 'react';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export const SwitchFilter: React.FC = () => { {
  return (
    <>
      {/* <Switch {...label} defaultChecked /> */}
      <Switch {...label} />
      {/* <Switch {...label} disabled defaultChecked /> */}
      {/* <Switch {...label} disabled /> */}
    </>
  );
}}