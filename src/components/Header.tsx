import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { Sun, Moon, Search, BookOpen, User as UserIcon, ChevronDown, Check, Menu, X, Repeat } from 'lucide-react';
import './Header.css';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, switchUser, allUsers } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Стан бічної панелі
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Закриття випадаючого меню профілю при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Кнопка-гамбургер (3 риски) для мобільних */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Відкрити меню"
        >
          <Menu style={{ width: 24, height: 24 }} />
        </button>

        {/* Логотип */}
        <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
          <BookOpen className="logo-icon" />
          <span>ComicSwap</span>
        </Link>

        {/* Десктопний пошук */}
        <form onSubmit={handleSearchSubmit} className="search-form desktop-search">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Пошук коміксів або авторів..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>

        {/* Десктопна навігація */}
        <nav className="nav-links desktop-nav">
          <Link to="/catalog" className="nav-link">Каталог</Link>
          <Link to="/trades" className="nav-link">Обміни</Link>

          {/* Перемикач теми */}
          <button onClick={toggleTheme} className="theme-toggle-btn" title="Змінити тему">
            {theme === 'dark' ? <Sun style={{ width: 20, height: 20 }} /> : <Moon style={{ width: 20, height: 20 }} />}
          </button>

          {/* Кастомний Дропдаун Профілів */}
          <div className="user-dropdown-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className="user-dropdown-trigger"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="header-avatar" />
              <div className="user-trigger-text">
                <span className="user-trigger-name">{currentUser.name}</span>
                <span className="user-trigger-role">
                  {currentUser.role === 'artist' ? 'Автор' : 'Читач'}
                </span>
              </div>
              <ChevronDown className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">Змінити акаунт</div>
                {allUsers.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <div
                      key={user.id}
                      className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        switchUser(user.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <img src={user.avatar} alt={user.name} className="dropdown-item-avatar" />
                      <div className="dropdown-item-info">
                        <span className="dropdown-item-name">{user.name}</span>
                        <span className="dropdown-item-role">
                          {user.role === 'artist' ? 'Художник / Автор' : 'Читач'}
                        </span>
                      </div>
                      {isSelected && <Check className="check-icon" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Link to="/profile" className="profile-btn" title="Перейти в профіль">
            <UserIcon style={{ width: 20, height: 20 }} />
          </Link>
        </nav>
      </div>

      {/* Мобільна бічна панель (Sidebar) та затемнення */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="mobile-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sidebar-header">
              <div className="logo">
                <BookOpen className="logo-icon" />
                <span>ComicSwap</span>
              </div>
              <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                <X style={{ width: 24, height: 24 }} />
              </button>
            </div>

            {/* Мобільний пошук */}
            <form onSubmit={handleSearchSubmit} className="mobile-search-form">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Пошук коміксів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </form>

            {/* Мобільне меню посилань */}
            <div className="mobile-nav-list">
              <Link to="/catalog" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
                <BookOpen style={{ width: 18, height: 18 }} />
                <span>Каталог коміксів</span>
              </Link>
              <Link to="/trades" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
                <Repeat style={{ width: 18, height: 18 }} />
                <span>Центр обмінів</span>
              </Link>
              <Link to="/profile" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>
                <UserIcon style={{ width: 18, height: 18 }} />
                <span>Мій профіль</span>
              </Link>
            </div>

            {/* Блок перемикання користувача та теми в боковому меню */}
            <div className="mobile-sidebar-footer">
              <div className="mobile-theme-row">
                <span>Тема оформлення</span>
                <button onClick={toggleTheme} className="theme-toggle-btn">
                  {theme === 'dark' ? <Sun style={{ width: 20, height: 20 }} /> : <Moon style={{ width: 20, height: 20 }} />}
                </button>
              </div>

              <div className="mobile-user-section">
                <div className="dropdown-header">Активний акаунт</div>
                {allUsers.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <div
                      key={user.id}
                      className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        switchUser(user.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <img src={user.avatar} alt={user.name} className="dropdown-item-avatar" />
                      <div className="dropdown-item-info">
                        <span className="dropdown-item-name">{user.name}</span>
                        <span className="dropdown-item-role">
                          {user.role === 'artist' ? 'Автор' : 'Читач'}
                        </span>
                      </div>
                      {isSelected && <Check className="check-icon" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};