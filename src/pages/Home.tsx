import React, { useState, useEffect } from 'react';
import { mockComics, type Comic } from '../data/mockData';
import { ComicCarousel } from '../components/ComicCarousel';
import { ArtistModal } from '../components/ArtistModal';
import { TradeModal } from '../components/TradeModal';
import { Sparkles, RefreshCw } from 'lucide-react';
import './Home.css';

export const Home: React.FC = () => {
  const [selectedArtistComic, setSelectedArtistComic] = useState<Comic | null>(null);
  const [tradeTargetComic, setTradeTargetComic] = useState<Comic | null>(null);

  const promotedComics = mockComics.filter((c) => c.isPromoted);
  const regularComics = mockComics.filter((c) => !c.isPromoted);

  const [randomComics, setRandomComics] = useState<Comic[]>([]);
  const [isRotating, setIsRotating] = useState(false);

  const handleRefreshRandom = () => {
    setIsRotating(true);
    const shuffled = [...regularComics].sort(() => 0.5 - Math.random());
    setRandomComics(shuffled.slice(0, 3));
    setTimeout(() => setIsRotating(false), 500);
  };

  useEffect(() => {
    handleRefreshRandom();
  }, []);

  return (
    <div className="home-container">
      {/* Hero-банер */}
      <section className="hero-section">
        <h1 className="hero-title">
          Обмінюйся коміксами та знаходь <span className="hero-highlight">інді-авторів</span>
        </h1>
        <p className="hero-subtitle">
          Платформа для колекціонерів, де можна безпечно обміняти прочитані графічні романи та підтримати незалежних художників.
        </p>
      </section>

      {/* Реклама від художників */}
      <section className="promoted-section">
        <div className="section-header" style={{ justifyContent: 'center' }}>
          <Sparkles style={{ color: '#f59e0b', width: 24, height: 24 }} />
          <h2 className="section-title">Реклама & Промо від художників</h2>
        </div>
        
        <ComicCarousel
          comics={promotedComics}
          onDetailClick={(c) => setSelectedArtistComic(c)}
        />
      </section>

      {/* Останні комікси на обмін */}
      <section style={{ textAlign: 'center' }}>
        <div className="section-header" style={{ justifyContent: 'center' }}>
          <button
            onClick={handleRefreshRandom}
            className={`refresh-btn ${isRotating ? 'spin' : ''}`}
            title="Натисніть, щоб показати 3 нові випадкові комікси"
          >
            <RefreshCw style={{ width: 24, height: 24 }} />
          </button>
          <h2 className="section-title">Останні комікси на обмін</h2>
        </div>

        <ComicCarousel
          comics={randomComics}
          onTradeClick={(comic) => setTradeTargetComic(comic)}
        />
      </section>

      {/* Модальне вікно для авторів */}
      <ArtistModal
        comic={selectedArtistComic}
        onClose={() => setSelectedArtistComic(null)}
      />

      {/* Модальне вікно для створення запиту на обмін */}
      <TradeModal
        targetComic={tradeTargetComic}
        onClose={() => setTradeTargetComic(null)}
      />
    </div>
  );
};