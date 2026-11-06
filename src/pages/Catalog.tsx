import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockComics, type Comic } from '../data/mockData';
import { ComicCard } from '../components/ComicCard';
import { ArtistModal } from '../components/ArtistModal';
import { TradeModal } from '../components/TradeModal';
import { Filter, RotateCcw, Search } from 'lucide-react';
import './Catalog.css';

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';

  // Стан фільтрів
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [onlyPromoted, setOnlyPromoted] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'title' | 'genre'>('title');

  // Стан модальних вікон
  const [selectedArtistComic, setSelectedArtistComic] = useState<Comic | null>(null);
  const [selectedComicForTrade, setSelectedComicForTrade] = useState<Comic | null>(null);

  // Об'єднуємо мокові комікси з тими, що користувачі створили в Профілі
  const allComics = useMemo(() => {
    const customComics: Comic[] = JSON.parse(
      localStorage.getItem('all_created_comics') || '[]'
    );
    return [...mockComics, ...customComics];
  }, []);

  // Список усіх унікальних жанрів та станів
  const genres = useMemo(() => Array.from(new Set(allComics.map((c) => c.genre))), [allComics]);
  const conditions = useMemo(() => Array.from(new Set(allComics.map((c) => c.condition))), [allComics]);

  // Перемикання вибору жанру
  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Перемикання вибору стану
  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  // Скидання всіх фільтрів
  const handleReset = () => {
    setSelectedGenres([]);
    setSelectedConditions([]);
    setOnlyPromoted(false);
    setSearchParams({});
  };

  // Фільтрація та сортування коміксів
  const filteredComics = useMemo(() => {
    return allComics
      .filter((comic) => {
        // Пошук за назвою або автором
        if (searchFromUrl) {
          const query = searchFromUrl.toLowerCase();
          const matchTitle = comic.title.toLowerCase().includes(query);
          const matchAuthor = comic.author.toLowerCase().includes(query);
          if (!matchTitle && !matchAuthor) return false;
        }

        // Фільтр за промо-акціями
        if (onlyPromoted && !comic.isPromoted) return false;

        // Фільтр за жанрами
        if (selectedGenres.length > 0 && !selectedGenres.includes(comic.genre)) return false;

        // Фільтр за станом
        if (selectedConditions.length > 0 && !selectedConditions.includes(comic.condition)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title, 'uk');
        if (sortBy === 'genre') return a.genre.localeCompare(b.genre, 'uk');
        return 0;
      });
  }, [allComics, searchFromUrl, onlyPromoted, selectedGenres, selectedConditions, sortBy]);

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1 className="catalog-title">Каталог коміксів</h1>
        <p className="catalog-subtitle">
          Шукай рідкісні випуски для обміну або відкривай для себе роботи незалежних художників.
        </p>
      </div>

      <div className="catalog-layout">
        {/* Панель фільтрації */}
        <aside className="filters-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Filter style={{ width: 18, height: 18, color: '#6366f1' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-h)' }}>Фільтри</h3>
          </div>

          {/* Фільтр: Тільки автори */}
          <div className="filter-group">
            <label className="filter-option" style={{ fontWeight: 'bold', color: '#f59e0b' }}>
              <input
                type="checkbox"
                checked={onlyPromoted}
                onChange={(e) => setOnlyPromoted(e.target.checked)}
              />
              <span>Тільки промо від авторів</span>
            </label>
          </div>

          {/* Фільтр: Жанри */}
          <div className="filter-group">
            <h4 className="filter-title">Жанри</h4>
            {genres.map((genre) => (
              <label key={genre} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                />
                <span>{genre}</span>
              </label>
            ))}
          </div>

          {/* Фільтр: Стан */}
          <div className="filter-group">
            <h4 className="filter-title">Стан</h4>
            {conditions.map((condition) => (
              <label key={condition} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(condition)}
                  onChange={() => toggleCondition(condition)}
                />
                <span>{condition}</span>
              </label>
            ))}
          </div>

          {/* Кнопка скидання */}
          <button onClick={handleReset} className="reset-filters-btn">
            <RotateCcw style={{ width: 14, height: 14, display: 'inline', marginRight: 4 }} />
            Скинути фільтри
          </button>
        </aside>

        {/* Сітка результатів */}
        <main className="catalog-content">
          <div className="catalog-toolbar">
            <span className="results-count">
              Знайдено коміксів: <strong>{filteredComics.length}</strong>
              {searchFromUrl && ` за запитом "${searchFromUrl}"`}
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'genre')}
              className="sort-select"
            >
              <option value="title">Сортувати за назвою</option>
              <option value="genre">Сортувати за жанром</option>
            </select>
          </div>

          {filteredComics.length > 0 ? (
            <div className="comics-grid">
              {filteredComics.map((comic) => (
                <ComicCard
                  key={comic.id}
                  comic={comic}
                  onTradeRequest={(c) => setSelectedComicForTrade(c)}
                  onDetailClick={(c) => setSelectedArtistComic(c)}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Search style={{ width: 48, height: 48, marginBottom: 12, opacity: 0.5 }} />
              <h3>Комікси не знайдені</h3>
              <p>Спробуй змінити параметри фільтрів або пошуковий запит.</p>
            </div>
          )}
        </main>
      </div>

      {/* Модальне вікно для промо-авторів */}
      {selectedArtistComic && (
        <ArtistModal
          comic={selectedArtistComic}
          onClose={() => setSelectedArtistComic(null)}
        />
      )}

      {/* Модальне вікно для оформлення обміну */}
      {selectedComicForTrade && (
        <TradeModal
          targetComic={selectedComicForTrade}
          onClose={() => setSelectedComicForTrade(null)}
        />
      )}
    </div>
  );
};