import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';

import Clock from './Clock/Clock';
import Notifications from './Notifications/Notifications';

function Overlay() {
  const { appSettings } = useAppSettings();

  return (
    <>
      <Notifications />
      {appSettings.overlay.clock.enabled && <Clock />}
    </>
  );
}

export default Overlay;
