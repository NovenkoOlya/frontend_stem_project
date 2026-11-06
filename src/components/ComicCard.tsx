import React from 'react';
import type { Comic } from '../data/mockData';
import { Sparkles, Repeat, Info } from 'lucide-react';
import './ComicCard.css';

export interface ComicCardProps {
  comic: Comic;
  onTradeRequest?: (comic: Comic) => void;
  onTradeClick?: (comic: Comic) => void;
  onDetailClick?: (comic: Comic) => void;
}

export const ComicCard: React.FC<ComicCardProps> = ({
  comic,
  onTradeRequest,
  onTradeClick,
  onDetailClick,
}) => {
  const handleTrade = onTradeClick || onTradeRequest;

  return (
    <div className="comic-card">
      <div
        className="comic-cover-container"
        onClick={() => comic.isPromoted && onDetailClick?.(comic)}
        style={{ cursor: comic.isPromoted ? 'pointer' : 'default' }}
      >
        <img src={comic.coverImage} alt={comic.title} className="comic-cover" />

        {/* Бейджі фіксуємо зверху обкладинки */}
        <div className="comic-badges">
          {comic.isPromoted && (
            <span className="badge badge-promoted">
              <Sparkles style={{ width: 12, height: 12 }} />
              Промо від автора
            </span>
          )}
          <span className="badge badge-condition">{comic.condition}</span>
        </div>
      </div>

      <div className="comic-info">
        <span className="comic-genre">{comic.genre}</span>
        <h3
          className="comic-title"
          onClick={() => comic.isPromoted && onDetailClick?.(comic)}
          style={{ cursor: comic.isPromoted ? 'pointer' : 'default' }}
        >
          {comic.title}
        </h3>
        <p className="comic-author">Автор: {comic.author}</p>

        <div className="comic-card-action">
          {comic.isPromoted ? (
            <button
              onClick={() => onDetailClick?.(comic)}
              className="trade-btn btn-promoted"
            >
              <Info style={{ width: 16, height: 16 }} />
              <span>Детальніше</span>
            </button>
          ) : (
            <button
              onClick={() => handleTrade?.(comic)}
              className="trade-btn"
            >
              <Repeat style={{ width: 16, height: 16 }} />
              <span>Запропонувати обмін</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};