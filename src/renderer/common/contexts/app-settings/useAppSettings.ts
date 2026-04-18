import { useContext } from 'react';

import { AppSettingsContext } from './types';

const useAppSettings = () => useContext(AppSettingsContext);

export default useAppSettings;
