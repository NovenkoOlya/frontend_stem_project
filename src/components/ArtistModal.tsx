import React, { useState } from 'react';
import type { Comic } from '../data/mockData';
import { X, ExternalLink, Heart, ChevronLeft, ChevronRight, Globe, Camera } from 'lucide-react';

interface ArtistModalProps {
  comic: Comic | null;
  onClose: () => void;
}

export const ArtistModal: React.FC<ArtistModalProps> = ({ comic, onClose }) => {
  if (!comic) return null;

  const images = comic.previewImages && comic.previewImages.length > 0
    ? comic.previewImages
    : [comic.coverImage];

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const prevImage = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-header)',
        borderRadius: '20px',
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--border-header)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Кнопка закриття */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X style={{ width: 20, height: 20 }} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '2rem' }}>
          
          {/* Галерея картинок */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '100%', height: '360px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}>
              <img
                src={images[currentImgIndex]}
                alt={comic.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} style={navBtnStyle('left')}>
                    <ChevronLeft style={{ width: 20, height: 20 }} />
                  </button>
                  <button onClick={nextImage} style={navBtnStyle('right')}>
                    <ChevronRight style={{ width: 20, height: 20 }} />
                  </button>
                </>
              )}
            </div>

            {/* Мініатюри */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumb"
                    onClick={() => setCurrentImgIndex(idx)}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: idx === currentImgIndex ? '2px solid #6366f1' : '2px solid transparent',
                      opacity: idx === currentImgIndex ? 1 : 0.6
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Інформація про проєкт та автора */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Промо-комікс від автора
              </span>
              <h2 style={{ fontSize: '24px', margin: '8px 0', color: 'var(--text-h)' }}>{comic.title}</h2>
              <p style={{ fontSize: '14px', color: '#6366f1', fontWeight: '600', marginBottom: '16px' }}>
                Автор та художник: {comic.artist}
              </p>
              
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                {comic.description}
              </p>

              {/* Соцмережі автора */}
              {comic.artistSocials && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-h)' }}>Соцмережі автора:</h4>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {comic.artistSocials.instagram && (
                      <a href={comic.artistSocials.instagram} target="_blank" rel="noreferrer" style={socialLinkStyle}>
                        <Camera style={{ width: 16, height: 16 }} /> Instagram
                      </a>
                    )}
                    {comic.artistSocials.artstation && (
                      <a href={comic.artistSocials.artstation} target="_blank" rel="noreferrer" style={socialLinkStyle}>
                        <Globe style={{ width: 16, height: 16 }} /> ArtStation
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Кнопка донату / підтримки */}
            {comic.donateUrl && (
              <a
                href={comic.donateUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  textAlign: 'center',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
                }}
              >
                <Heart style={{ width: 18, height: 18, fill: '#fff' }} />
                <span>Підтримати автора донатом</span>
                <ExternalLink style={{ width: 16, height: 16 }} />
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

const navBtnStyle = (dir: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute',
  top: '50%',
  [dir]: '10px',
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const socialLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '8px',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-h)',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: '500'
};