import { Props } from './ProcessIcon.types';

function ProcessIcon({ base64, alt }: Props) {
  return (
    <img
      style={{ maxWidth: '24px' }}
      src={`data:image/png;base64,${base64}`}
      alt={alt}
    />
  );
}

export default ProcessIcon;
