import { useContext } from 'react';
import { AppStateContext } from './types';

const useAppState = () => useContext(AppStateContext);

export default useAppState;
