import AppIcon from '../../../../assets/images/app.png';

import { Props } from './ProcessIcon.types';

function ProcessIcon({ base64, alt }: Props) {
  return (
    <img
      style={{ maxWidth: '24px' }}
      src={base64 ? `data:image/png;base64,${base64}` : AppIcon}
      alt={alt}
    />
  );
}

export default ProcessIcon;
