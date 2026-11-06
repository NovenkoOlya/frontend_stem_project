import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { mockComics, type Comic } from '../data/mockData';
import { ComicCard } from '../components/ComicCard';
import { ArtistModal } from '../components/ArtistModal';
import { Plus, BookOpen, Sparkles, X } from 'lucide-react';
import './Profile.css';

export const Profile: React.FC = () => {
  const { currentUser } = useUser();
  const isArtist = currentUser.role === 'artist';

  // Модальне вікно для деталей про автора/промо
  const [selectedArtistComic, setSelectedArtistComic] = useState<Comic | null>(null);

  // 1. Стан для всіх коміксів поточного користувача
  const [userComics, setUserComics] = useState<Comic[]>(() => {
    const saved = localStorage.getItem(`user_comics_${currentUser.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return mockComics.filter((c) => c.ownerId === currentUser.id);
  });

  // Оновлюємо список коміксів при зміні поточного користувача
  useEffect(() => {
    const saved = localStorage.getItem(`user_comics_${currentUser.id}`);
    if (saved) {
      try {
        setUserComics(JSON.parse(saved));
      } catch (e) {
        setUserComics(mockComics.filter((c) => c.ownerId === currentUser.id));
      }
    } else {
      setUserComics(mockComics.filter((c) => c.ownerId === currentUser.id));
    }
  }, [currentUser.id]);

  // Зберігаємо комікси у localStorage та синхронізуємо глобальний список для каталогу
  useEffect(() => {
    localStorage.setItem(`user_comics_${currentUser.id}`, JSON.stringify(userComics));
    
    // Оновлюємо загальний список створених користувачами коміксів для Catalog.tsx
    const allCustom = JSON.parse(localStorage.getItem('all_created_comics') || '[]');
    const otherUsersComics = allCustom.filter((c: Comic) => c.ownerId !== currentUser.id);
    localStorage.setItem('all_created_comics', JSON.stringify([...otherUsersComics, ...userComics]));
  }, [userComics, currentUser.id]);

  // Розділяємо комікси користувача на Промо (для автора) та Колекцію для обміну
  const artistPromos = userComics.filter((c) => c.isPromoted);
  const userTradeComics = userComics.filter((c) => !c.isPromoted);

  // Стан модального вікна додавання
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addAsPromoted, setAddAsPromoted] = useState<boolean>(isArtist);

  const [newComic, setNewComic] = useState({
    title: '',
    author: currentUser.name,
    genre: 'Супергероїка',
    condition: 'Mint' as Comic['condition'],
    coverImage: '',
    description: '',
  });

  const openAddModal = (forPromo: boolean) => {
    setAddAsPromoted(forPromo);
    setNewComic({
      title: '',
      author: currentUser.name,
      genre: 'Супергероїка',
      condition: 'Mint',
      coverImage: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleAddComicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComic.title || !newComic.author) return;

    const createdComic: Comic = {
      id: `c_${Date.now()}`,
      title: newComic.title,
      author: newComic.author,
      artist: currentUser.name,
      coverImage:
        newComic.coverImage ||
        'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=600',
      condition: newComic.condition,
      genre: newComic.genre,
      ownerId: currentUser.id,
      isPromoted: addAsPromoted, // Зберігаємо відносно вибору типу коміксу
      description: newComic.description || 'Без опису',
    };

    setUserComics((prev) => [createdComic, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="profile-container" style={{ padding: '2rem 0' }}>
      
      {/* Шапка профілю */}
      <div className="profile-card">
        <div className="profile-info">
          <img src={currentUser.avatar} alt={currentUser.name} className="profile-avatar" />
          <div>
            <h2 className="profile-name">{currentUser.name}</h2>
            <p className="profile-email">{currentUser.email}</p>
            <span className="profile-role-badge">
              {isArtist ? 'ХУДОЖНИК / АВТОР' : 'ЧИТАЧ / КОЛЕКЦІОНЕР'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. СЕКЦІЯ РЕКЛАМИ ПРОМО-КОМІКСІВ (ВІДОБРАЖАЄТЬСЯ ТІЛЬКИ АВТОРУ) */}
      {/* ========================================================= */}
      {isArtist && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles style={{ color: '#f59e0b', width: 24, height: 24 }} />
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-h)' }}>
                Реклама моїх коміксів ({artistPromos.length})
              </h2>
            </div>
            <button onClick={() => openAddModal(true)} className="add-comic-btn" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              <Plus style={{ width: 16, height: 16 }} />
              <span>Додати промо-комікс</span>
            </button>
          </div>

          {artistPromos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {artistPromos.map((comic) => (
                <ComicCard
                  key={comic.id}
                  comic={comic}
                  onDetailClick={(c) => setSelectedArtistComic(c)}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-header)', borderRadius: '16px', border: '1px dashed var(--border-header)', color: 'var(--text-muted)' }}>
              <p>У вас поки немає опублікованих промо-коміксів.</p>
            </div>
          )}
        </section>
      )}

      {/* ========================================================= */}
      {/* 2. СЕКЦІЯ КОЛЕКЦІЇ ДЛЯ ОБМІНУ (ДОСТУПНА ВСІМ КОРИСТУВАЧАМ) */}
      {/* ========================================================= */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen style={{ color: '#6366f1', width: 24, height: 24 }} />
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-h)' }}>
              Моя колекція для обміну ({userTradeComics.length})
            </h2>
          </div>
          <button onClick={() => openAddModal(false)} className="add-comic-btn">
            <Plus style={{ width: 16, height: 16 }} />
            <span>Додати комікс на обмін</span>
          </button>
        </div>

        {userTradeComics.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {userTradeComics.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-header)', borderRadius: '16px', border: '1px dashed var(--border-header)', color: 'var(--text-muted)' }}>
            <p>У вашій колекції поки немає коміксів для обміну.</p>
          </div>
        )}
      </section>

      {/* Модальне вікно додавання новий коміксів */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setIsModalOpen(false)} className="close-modal-btn">
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--text-h)', fontSize: '1.25rem' }}>
              {addAsPromoted ? 'Опублікувати новий промо-комікс' : 'Додати комікс до колекції обміну'}
            </h3>

            <form onSubmit={handleAddComicSubmit}>
              <div className="form-group">
                <label>Назва коміксу *</label>
                <input
                  type="text"
                  required
                  value={newComic.title}
                  onChange={(e) => setNewComic({ ...newComic, title: e.target.value })}
                  placeholder="Наприклад: Кібер-Львів 2077"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Автор / Сценарист *</label>
                <input
                  type="text"
                  required
                  value={newComic.author}
                  onChange={(e) => setNewComic({ ...newComic, author: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Жанр</label>
                  <select
                    value={newComic.genre}
                    onChange={(e) => setNewComic({ ...newComic, genre: e.target.value })}
                    className="form-select"
                  >
                    <option value="Супергероїка">Супергероїка</option>
                    <option value="Альтернативна історія">Альтернативна історія</option>
                    <option value="Фольк-готика">Фольк-готика</option>
                    <option value="Кіберпанк">Кіберпанк</option>
                    <option value="Фентезі">Фентезі</option>
                    <option value="Детектив">Детектив</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Стан</label>
                  <select
                    value={newComic.condition}
                    onChange={(e) =>
                      setNewComic({ ...newComic, condition: e.target.value as Comic['condition'] })
                    }
                    className="form-select"
                  >
                    <option value="Mint">Mint (Ідеальний)</option>
                    <option value="Near Mint">Near Mint (Майже ідеальний)</option>
                    <option value="Very Fine">Very Fine (Чудовий)</option>
                    <option value="Good">Good (Задовільний)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Посилання на зображення обкладинки (URL)</label>
                <input
                  type="url"
                  value={newComic.coverImage}
                  onChange={(e) => setNewComic({ ...newComic, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Короткий опис</label>
                <textarea
                  rows={3}
                  value={newComic.description}
                  onChange={(e) => setNewComic({ ...newComic, description: e.target.value })}
                  placeholder="Опишіть сюжет або особливості видання..."
                  className="form-textarea"
                />
              </div>

              {/* Можливість змінити тип прямо у формі (для авторів) */}
              {isArtist && (
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="isPromotedCheckbox"
                    checked={addAsPromoted}
                    onChange={(e) => setAddAsPromoted(e.target.checked)}
                  />
                  <label htmlFor="isPromotedCheckbox" style={{ margin: 0, cursor: 'pointer', color: '#f59e0b', fontWeight: 'bold' }}>
                    Опублікувати як промо від автора
                  </label>
                </div>
              )}

              <button type="submit" className="submit-btn" style={{ background: addAsPromoted ? '#f59e0b' : '#6366f1', color: addAsPromoted ? '#000' : '#fff' }}>
                {addAsPromoted ? 'Опублікувати промо-комікс' : 'Додати комікс до колекції'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Модальне вікно для детальної інформації про промо-автора */}
      {selectedArtistComic && (
        <ArtistModal
          comic={selectedArtistComic}
          onClose={() => setSelectedArtistComic(null)}
        />
      )}
    </div>
  );
};