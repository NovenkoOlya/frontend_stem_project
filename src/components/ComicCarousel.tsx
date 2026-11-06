import React, { useState, useEffect } from 'react';
import type { Comic } from '../data/mockData';
import { ComicCard } from './ComicCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ComicCarousel.css';

interface ComicCarouselProps {
  comics: Comic[];
  onTradeClick?: (comic: Comic) => void;
  onDetailClick?: (comic: Comic) => void;
  enableRandom?: boolean; // Якщо true (наприклад, для обмінів) — кружечки генеруватимуть 3 випадкових
}

export const ComicCarousel: React.FC<ComicCarouselProps> = ({
  comics,
  onTradeClick,
  onDetailClick,
  enableRandom = false,
}) => {
  const [displayedComics, setDisplayedComics] = useState<Comic[]>(comics);
  const [activeIndex, setActiveIndex] = useState(0);

  // Оновлюємо списки при зміні вхідних даних
  useEffect(() => {
    if (enableRandom && comics.length > 3) {
      const shuffled = [...comics].sort(() => 0.5 - Math.random());
      setDisplayedComics(shuffled.slice(0, 3));
      setActiveIndex(1);
    } else {
      setDisplayedComics(comics);
      setActiveIndex(0);
    }
  }, [comics, enableRandom]);

  if (!comics || comics.length === 0) return null;

  // Функція для рандомізації 3 коміксів
  const generateRandomThree = () => {
    if (comics.length <= 3) return;
    const shuffled = [...comics].sort(() => 0.5 - Math.random());
    setDisplayedComics(shuffled.slice(0, 3));
    setActiveIndex(1); // Робимо центральний активним
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? displayedComics.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === displayedComics.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    if (enableRandom) {
      // Клік на кружечок підтягує нові 3 випадкові комікси
      generateRandomThree();
    } else {
      // Звичайне перегортання до обраного коміксу (для реклами авторів)
      setActiveIndex(index);
    }
  };

  return (
    <div className="carousel-wrapper">
      {/* Стрілка Вліво */}
      <button className="carousel-nav-btn prev" onClick={handlePrev} aria-label="Попередній">
        <ChevronLeft style={{ width: 28, height: 28 }} />
      </button>

      {/* Слайди 3D Каруселі */}
      <div className="carousel-track">
        {displayedComics.map((comic, index) => {
          let offset = index - activeIndex;

          if (offset < -1 && activeIndex >= displayedComics.length - 1) {
            offset += displayedComics.length;
          }
          if (offset > 1 && activeIndex <= 0) {
            offset -= displayedComics.length;
          }

          const isActive = index === activeIndex;

          return (
            <div
              key={`${comic.id}-${index}`}
              className={`carousel-slide ${isActive ? 'active' : ''}`}
              style={{
                transform: `translateX(${offset * 68}%) scale(${isActive ? 1.08 : 0.85})`,
                zIndex: isActive ? 10 : 5 - Math.abs(offset),
                opacity: isActive ? 1 : 0.5,
                filter: isActive ? 'none' : 'blur(1px) brightness(0.8)',
              }}
              onClick={() => setActiveIndex(index)}
            >
              <ComicCard
                comic={comic}
                onTradeClick={onTradeClick}
                onDetailClick={onDetailClick}
              />
            </div>
          );
        })}
      </div>

      {/* Стрілка Вправо */}
      <button className="carousel-nav-btn next" onClick={handleNext} aria-label="Наступний">
        <ChevronRight style={{ width: 28, height: 28 }} />
      </button>

      {/* Кружечки-кнопки */}
<div className="carousel-dots">
  {displayedComics.map((_, idx) => (
    <button
      key={idx}
      type="button"
      title={enableRandom ? "Натисніть для випадіння 3 нових випадкових коміксів" : `Перейти до слайда ${idx + 1}`}
      className={`carousel-dot ${idx === activeIndex ? 'active' : ''}`}
      onClick={(e) => {
        e.stopPropagation(); // Запобігаємо перехопленню події іншими елементами
        handleDotClick(idx);
      }}
    />
  ))}
</div>
    </div>
  );
};