import React, { useState, useEffect } from 'react';
import { mockTradeRequests, mockComics, mockUsers, type TradeRequest } from '../data/mockData';
import { Repeat, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './Trades.css';

export const Trades: React.FC = () => {
  const { currentUser } = useUser();
  const currentUserId = currentUser.id;

  // 1. Зчитуємо обміни з localStorage або повертаємо мокові дані
  const [requests, setRequests] = useState<TradeRequest[]>(() => {
    const saved = localStorage.getItem('user_trades');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return mockTradeRequests;
  });

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

  // 2. Зберігаємо список у localStorage при кожній зміні
  useEffect(() => {
    localStorage.setItem('user_trades', JSON.stringify(requests));
  }, [requests]);

  // 3. Синхронізуємо дані при перемиканні користувачів або відкритті сторінки
  useEffect(() => {
    const saved = localStorage.getItem('user_trades');
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch (e) {
        setRequests(mockTradeRequests);
      }
    }
  }, [currentUserId]);

  const incomingTrades = requests.filter((r) => r.receiverId === currentUserId);
  const outgoingTrades = requests.filter((r) => r.senderId === currentUserId);

  const handleStatusChange = (id: string, newStatus: 'accepted' | 'rejected') => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const currentList = activeTab === 'incoming' ? incomingTrades : outgoingTrades;

  return (
    <div className="trades-container">
      <div className="trades-header">
        <h1 style={{ fontSize: '2.25rem', margin: 0, color: 'var(--text-h)' }}>Центр обмінів</h1>
        <p style={{ color: 'var(--text-muted)' }}>Керуй пропозиціями обміну коміксами з іншими колекціонерами.</p>
      </div>

      <div className="trades-tabs">
        <button
          className={`tab-btn ${activeTab === 'incoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('incoming')}
        >
          Отримані запити ({incomingTrades.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'outgoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('outgoing')}
        >
          Надіслані пропозиції ({outgoingTrades.length})
        </button>
      </div>

      <div className="trades-list">
        {currentList.length > 0 ? (
          currentList.map((trade) => {
            // Шукаємо комікси у mockComics або в localStorage
            const allSavedComics: typeof mockComics = JSON.parse(
              localStorage.getItem('all_created_comics') || '[]'
            );
            const combinedComics = [...mockComics, ...allSavedComics];

            const offeredComic = combinedComics.find((c) => c.id === trade.offeredComicId);
            const requestedComic = combinedComics.find((c) => c.id === trade.requestedComicId);
            const partnerUser = mockUsers.find(
              (u) => u.id === (activeTab === 'incoming' ? trade.senderId : trade.receiverId)
            );

            return (
              <div key={trade.id} className="trade-card">
                <div className="trade-card-header">
                  <span>
                    Партнер: <strong>{partnerUser?.name || 'Користувач'}</strong> • {trade.createdAt}
                  </span>
                  <span className={`trade-status ${trade.status}`}>
                    {trade.status === 'pending' && 'Очікує рішення'}
                    {trade.status === 'accepted' && 'Прийнято'}
                    {trade.status === 'rejected' && 'Відхилено'}
                  </span>
                </div>

                <div className="trade-exchange-body">
                  {/* Що пропонують */}
                  <div className="trade-item">
                    <img src={offeredComic?.coverImage} alt={offeredComic?.title} className="trade-item-img" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 'bold' }}>ПРОПОНУЮТЬ</span>
                      <h4 style={{ margin: '4px 0', color: 'var(--text-h)' }}>{offeredComic?.title || 'Комікс'}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Стан: {offeredComic?.condition || 'Mint'}</span>
                    </div>
                  </div>

                  <ArrowRight style={{ color: 'var(--text-muted)', margin: '0 auto' }} />

                  {/* Що хочуть натомість */}
                  <div className="trade-item">
                    <img src={requestedComic?.coverImage} alt={requestedComic?.title} className="trade-item-img" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>ХОЧУТЬ ОТРИМАТИ</span>
                      <h4 style={{ margin: '4px 0', color: 'var(--text-h)' }}>{requestedComic?.title || 'Комікс'}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Стан: {requestedComic?.condition || 'Mint'}</span>
                    </div>
                  </div>
                </div>

                {/* Дії для отриманих запитів */}
                {activeTab === 'incoming' && trade.status === 'pending' && (
                  <div className="trade-actions">
                    <button onClick={() => handleStatusChange(trade.id, 'rejected')} className="btn-reject">
                      Відхилити
                    </button>
                    <button onClick={() => handleStatusChange(trade.id, 'accepted')} className="btn-accept">
                      Прийняти обмін
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Repeat style={{ width: 40, height: 40, marginBottom: 8, opacity: 0.5 }} />
            <p>У цій вкладці поки немає активних запитів.</p>
          </div>
        )}
      </div>
    </div>
  );
};