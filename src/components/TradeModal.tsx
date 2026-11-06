import React, { useState, useMemo } from 'react';
import type { Comic, TradeRequest } from '../data/mockData';
import { mockComics } from '../data/mockData';
import { useUser } from '../context/UserContext';
import { Repeat, ArrowRight, X, CheckCircle2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TradeModal.css';

interface TradeModalProps {
  targetComic: Comic | null;
  onClose: () => void;
  onSuccessSend?: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  targetComic,
  onClose,
  onSuccessSend,
}) => {
  const { currentUser } = useUser();
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Отримуємо бібліотеку поточного користувача (мокові + додані з localStorage)
  const myComics = useMemo(() => {
    // Зчитуємо власні комікси користувача з localStorage
    const savedUserComics: Comic[] = JSON.parse(
      localStorage.getItem(`user_comics_${currentUser.id}`) || '[]'
    );
    
    // Фільтруємо мокові комікси, де овнер — поточний користувач
    const mockUserComics = mockComics.filter((c) => c.ownerId === currentUser.id);

    // Повертаємо об'єднану бібліотеку користувача
    return [...savedUserComics, ...mockUserComics];
  }, [currentUser.id]);

  const [selectedComicId, setSelectedComicId] = useState<string>(
    myComics.length > 0 ? myComics[0].id : ''
  );

  const mySelectedComic = myComics.find((c) => c.id === selectedComicId);

  if (!targetComic) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComicId) return;

    // Створюємо новий запит на обмін
    const newTrade: TradeRequest = {
      id: `t_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: targetComic.ownerId,
      offeredComicId: selectedComicId,
      requestedComicId: targetComic.id,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Зберігаємо запит у localStorage
    const existingTrades = JSON.parse(localStorage.getItem('user_trades') || '[]');
    localStorage.setItem('user_trades', JSON.stringify([newTrade, ...existingTrades]));

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onSuccessSend?.();
      onClose();
    }, 1200);
  };

  return (
    <div className="trade-modal-overlay">
      <div className="trade-modal-container">
        <div className="trade-modal-header">
          <h2 className="trade-modal-title">Запропонувати обмін</h2>
          <button onClick={onClose} className="close-btn">
            <X style={{ width: 22, height: 22 }} />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 style={{ width: 56, height: 56, color: '#10b981', marginBottom: 12 }} />
            <h3 style={{ color: 'var(--text-h)', margin: '0 0 8px 0' }}>Пропозицію успішно надіслано!</h3>
            <p style={{ color: 'var(--text-muted)' }}>Власник коміксу перегляне ваш запит у розділі Обміни.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="trade-grid">
              
              {/* Комікс із власної бібліотеки */}
              <div className="trade-box">
                <span className="trade-box-title" style={{ color: '#6366f1' }}>
                  Ви пропонуєте зі своєї бібліотеки:
                </span>

                {myComics.length > 0 ? (
                  <>
                    <select
                      value={selectedComicId}
                      onChange={(e) => setSelectedComicId(e.target.value)}
                      className="select-my-comic"
                    >
                      {myComics.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.condition})
                        </option>
                      ))}
                    </select>

                    {mySelectedComic && (
                      <div className="trade-comic-preview">
                        <img src={mySelectedComic.coverImage} alt={mySelectedComic.title} className="trade-comic-img" />
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-h)' }}>
                            {mySelectedComic.title}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Стан: {mySelectedComic.condition}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <p style={{ fontSize: '0.85rem', color: '#ef4444', marginBottom: '8px' }}>
                      У вашій бібліотеці немає коміксів для обміну!
                    </p>
                    <Link
                      to="/profile"
                      onClick={onClose}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        color: '#6366f1',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                      }}
                    >
                      <PlusCircle style={{ width: 16, height: 16 }} />
                      Додати комікс у Профілі
                    </Link>
                  </div>
                )}
              </div>

              <ArrowRight style={{ color: 'var(--text-muted)', margin: '0 auto' }} />

              {/* Бажаний комікс */}
              <div className="trade-box">
                <span className="trade-box-title" style={{ color: '#f59e0b' }}>
                  Ви хочете отримати:
                </span>

                <div className="trade-comic-preview">
                  <img src={targetComic.coverImage} alt={targetComic.title} className="trade-comic-img" />
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-h)' }}>
                      {targetComic.title}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Автор: {targetComic.author}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <button type="submit" disabled={!selectedComicId} className="trade-send-btn">
              <Repeat style={{ width: 18, height: 18 }} />
              <span>Надіслати пропозицію обміну</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};