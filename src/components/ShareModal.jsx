// C:\xampp\htdocs\FrontComputerChip\src\components\ShareModal.jsx
import { useState, useEffect } from 'react';
import carritoBlanco from '../assets/CarritoEmojiBlanco.png';
import carritoNegro from '../assets/CarritoEmojiNegro.png';
import '../styles/components/ShareModal.css';

const ShareModal = ({ isOpen, onClose, productName, productUrl }) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('light');

  // Detectar el tema actual
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setCurrentTheme(theme === 'dark' ? 'dark' : 'light');
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  if (!isOpen) return null;

  const carritoIcon = currentTheme === 'dark' ? carritoBlanco : carritoNegro;

  // 👈 PLATAFORMAS DISPONIBLES (sin Instagram, Telegram, Gmail)
  const sharePlatforms = [
    { 
      id: 'whatsapp', 
      name: 'WhatsApp', 
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      color: '#25D366' 
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: '#1877F2' 
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: '#000000' 
    },
    { 
      id: 'copiar', 
      name: 'Copiar enlace', 
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      ),
      color: '#6B7280' 
    },
  ];

  const handleShare = (platform) => {
    setSelectedPlatform(platform.id);
    
    const shareData = {
      title: `Mira este producto: ${productName}`,
      text: `Mira este producto: ${productName}`,
      url: productUrl
    };

    let shareUrl = '';
    
    switch (platform.id) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareData.text} - ${shareData.url}`)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
        break;
      case 'copiar':
        handleCopyLink();
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    setTimeout(() => setSelectedPlatform(null), 2000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="share-modal-overlay" onClick={handleOverlayClick}>
      <div className="share-modal">
        <div className="share-modal-header">
          <h3>Compartir vínculo</h3>
          <button className="share-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="share-modal-body">
          <div className="share-product-info">
            <img 
              src={carritoIcon} 
              alt="Producto" 
              className="share-product-icon-img"
            />
            <div className="share-product-name">{productName}</div>
          </div>

          <div className="share-platforms">
            {sharePlatforms.map((platform) => (
              <button
                key={platform.id}
                className={`share-platform-btn ${selectedPlatform === platform.id ? 'selected' : ''}`}
                onClick={() => handleShare(platform)}
                style={{ '--platform-color': platform.color }}
              >
                <span className="share-platform-icon">{platform.icon}</span>
                <span className="share-platform-name">{platform.name}</span>
              </button>
            ))}
          </div>

          {copied && (
            <div className="share-copied-message">
              ✅ ¡Enlace copiado al portapapeles!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;