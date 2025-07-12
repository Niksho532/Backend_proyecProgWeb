import { useState } from 'react';
import '../../styles/components/SafeImage.css';
const SafeImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/images/image.png',
  loading = 'lazy',
  onLoad,
  onError: customOnError,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(() => getImageUrl(src));
  const [hasError, setHasError] = useState(false);
  function getImageUrl(imagenPath) {
    if (!imagenPath) return fallbackSrc;
    if (imagenPath.startsWith('http')) return imagenPath;
    if (imagenPath.startsWith('/')) return imagenPath;
    return `/${imagenPath}`;
  }
  const handleError = (e) => {
    if (!hasError && imgSrc !== fallbackSrc) {
      console.warn('Error loading image:', imgSrc, 'switching to fallback');
      setImgSrc(fallbackSrc);
      setHasError(true);
      e.target.src = fallbackSrc;
    }
    if (customOnError) {
      customOnError(e);
    }
  };
  const handleLoad = (e) => {
    console.log('Image loaded successfully:', e.target.src);
    if (onLoad) {
      onLoad(e);
    }
  };
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      onLoad={handleLoad}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        minWidth: '100%',
        minHeight: '100%',
        maxWidth: 'none',
        maxHeight: 'none',
        border: 'none',
        outline: 'none',
        background: '#fff',
        borderRadius: '8px 8px 0 0',
        ...props.style
      }}
      {...props}
    />
  );
};
export default SafeImage;

