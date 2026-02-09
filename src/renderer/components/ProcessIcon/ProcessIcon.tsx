import { Props } from './ProcessIcon.types';

// TODO: add fallback image
function ProcessIcon({ path, alt }: Props) {
  return (
    <img
      style={{ maxWidth: '24px' }}
      src={`icon://${encodeURIComponent(path)}`}
      alt={alt}
    />
  );
}

export default ProcessIcon;
