export interface Comic {
  id: string;
  title: string;
  author: string;
  artist: string;
  coverImage: string;
  condition: 'Mint' | 'Near Mint' | 'Very Fine' | 'Good';
  genre: string;
  ownerId: string;
  isPromoted: boolean;
  description: string;
  previewImages?: string[];
  artistSocials?: {
    instagram?: string;
    artstation?: string;
    twitter?: string;
  };
  donateUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'artist';
}

export interface TradeRequest {
  id: string;
  senderId: string;
  receiverId: string;
  offeredComicId: string;
  requestedComicId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Олексій Читач',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    role: 'user',
  },
  {
    id: 'u2',
    name: 'Марія Колекціонер',
    email: 'maria@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    role: 'user',
  },
  {
    id: 'u3',
    name: 'Ігор Художник (Indie Artist)',
    email: 'igor.art@example.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
    role: 'artist',
  },
];

export const mockComics: Comic[] = [
  // Промо-комікси (з Cosmic.com.ua та Indie)
  {
    id: 'c2',
    title: 'Тіні Забутих Предків',
    author: 'Ігор Художник',
    artist: 'Ігор Художник',
    coverImage: 'https://www.onthebus.com.ua/wa-data/public/shop/products/02/webp/04/11/1104/images/3231/3231.0x450@2x.webp',
    condition: 'Mint',
    genre: 'Фольк-готика',
    ownerId: 'u3',
    isPromoted: true,
    description: 'Похмурий графічний роман за мотивами класики. Ручна графіка тушшю.',
    previewImages: [
      'https://www.onthebus.com.ua/wa-data/public/shop/products/02/webp/04/11/1104/images/3231/3231.0x450@2x.webp',
      'https://www.onthebus.com.ua/wa-data/public/shop/products/00/webp/04/11/1104/images/3227/3227.0x450.webp',
    ],
    artistSocials: { instagram: 'https://instagram.com' },
    donateUrl: 'https://buymeacoffee.com',
  },
  {
    id: 'c4',
    title: 'Кибер-Львів 2077: Пролог',
    author: 'Ігор Художник',
    artist: 'Ігор Художник',
    coverImage: 'https://cosmic.com.ua/content/images/21/400x604l80br0/cyberpunk_2077_blekaut-52680678553600.webp',
    condition: 'Near Mint',
    genre: 'Кіберпанк',
    ownerId: 'u3',
    isPromoted: true,
    description: 'Неоновий кіберпанк у декораціях майбутнього Львова.',
    previewImages: ['https://cosmic.com.ua/content/images/21/400x604l80br0/cyberpunk_2077_blekaut-52680678553600.webp'],
    artistSocials: { instagram: 'https://instagram.com' },
    donateUrl: 'https://mono.bank',
  },
  {
    id: 'c-cosmic-1',
    title: 'Токійський привид. Книга 1: Ядерний сад',
    author: 'Rick Remender',
    artist: 'Sean Murphy',
    coverImage: 'https://s8.vcdn.biz/static/f/11654942311/a003d927a5694ee89873001d17504d7c.jpeg',
    condition: 'Mint',
    genre: 'Кіберпанк',
    ownerId: 'u3',
    isPromoted: true,
    description: 'Видання від Cosmic Shop. Футуристична постапокаліптика про Лос-Анджелес 2089 року.',
  },

  // Звичайні комікси на обмін (з асортименту Cosmic Shop)
  {
    id: 'c1',
    title: 'Воля. The Will. Том 1.',
    author: 'В\'ячеслав Буганьов',
    artist: 'Денис Фадєєв',
    coverImage: 'https://cosmic.com.ua/content/images/31/524x680l80br0/volya_the_will-18387155992714.webp',
    condition: 'Mint',
    genre: 'Альтернативна історія',
    ownerId: 'u1',
    isPromoted: false,
    description: 'Колекційний примірник першого випуску культового українського коміксу.',
  },
  {
    id: 'c3',
    title: 'Spider-Man: Blue (Людина-Павук)',
    author: 'Jeph Loeb',
    artist: 'Tim Sale',
    coverImage: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1339177752i/160882.jpg',
    condition: 'Very Fine',
    genre: 'Супергероїка',
    ownerId: 'u2',
    isPromoted: false,
    description: 'Ністальгічна та зворушлива історія про Пітера Паркера та Гвен Стейсі.',
  },
  {
    id: 'c5',
    title: 'Бетмен: Довгий Гелловін',
    author: 'Jeph Loeb',
    artist: 'Tim Sale',
    coverImage: 'https://uaserials.my/posters/7850.webp',
    condition: 'Good',
    genre: 'Детектив',
    ownerId: 'u1',
    isPromoted: false,
    description: 'Класичний детективний нуар про протистояння Бетмена та таємничого вбивці Свято.',
  },
  {
    id: 'c-cosmic-2',
    title: 'Сага про Вінланд. Том 7',
    author: 'Makoto Yukimura',
    artist: 'Makoto Yukimura',
    coverImage: 'https://cosmic.com.ua/content/images/16/487x680l80br0/saha_pro_vinland_tom_7-19400976136574.webp',
    condition: 'Mint',
    genre: 'Манґа / Історичний',
    ownerId: 'u2',
    isPromoted: false,
    description: 'Епічна історія про вікінгів, Торфінна та його пошуки справжньої сили.',
  },
  {
    id: 'c-cosmic-3',
    title: 'Геллбой: Зимовий Спецвипуск',
    author: 'Mike Mignola',
    artist: 'Mike Mignola',
    coverImage: 'https://cosmic.com.ua/content/images/10/652x1000l80br0/gellboy_zimoviy_spetsvipusk_2016-67251700071518.webp',
    condition: 'Near Mint',
    genre: 'Містика / Міфологія',
    ownerId: 'u1',
    isPromoted: false,
    description: 'Спеціальний випуск пригод Хлопця з пекла у сніжному атмосферному виданні.',
  },
  {
    id: 'c-cosmic-4',
    title: 'Шлях домогосподаря. Том 3',
    author: 'Kousuke Oono',
    artist: 'Kousuke Oono',
    coverImage: 'https://s2.vcdn.biz/static/f/11654000351/01a7f6e168b646b5888a13f66f15f834.jpeg',
    condition: 'Mint',
    genre: 'Манґа / Комедія',
    ownerId: 'u2',
    isPromoted: false,
    description: 'Історія колишнього легендарного якудзи, який став зразковим домашнім господарем.',
  },
  {
    id: 'c-cosmic-5',
    title: 'Низка смертей Лейли Старр',
    author: 'Ram V',
    artist: 'Filipe Andrade',
    coverImage: 'https://cosmic.com.ua/content/images/17/455x680l80br0/nyzka_smertei_leily_starr-23247777210413.webp',
    condition: 'Mint',
    genre: 'Фентезі / Філософія',
    ownerId: 'u1',
    isPromoted: false,
    description: 'Яскравий графічний роман про втілення Смерті в індійському Мумбаї.',
  },
  {
    id: 'c-cosmic-6',
    title: 'Проводжальниця Фрірен. Том 1',
    author: 'Kanehito Yamada',
    artist: 'Tsukasa Abe',
    coverImage: 'https://cosmic.com.ua/content/images/36/485x680l80br0/provodzhalnytsia_friren_tom_1-11906939213618.webp',
    condition: 'Near Mint',
    genre: 'Манґа / Фентезі',
    ownerId: 'u2',
    isPromoted: false,
    description: 'Меланхолічна фентезі-пригода про ельфійку Фрірен після перемоги над Королем Демонів.',
  },
];

export interface TradeRequest {
  id: string;
  senderId: string;
  receiverId: string;
  offeredComicId: string;
  requestedComicId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const mockTradeRequests: TradeRequest[] = [
  {
    id: 't1',
    senderId: 'u1', // Олексій
    receiverId: 'u2', // Марія
    offeredComicId: 'c1', // Тіні Забутих Предків
    requestedComicId: 'c2', // Кібер-Львів 2077
    status: 'pending',
    createdAt: '2026-11-05',
  },
  {
    id: 't2',
    senderId: 'u2', // Марія
    receiverId: 'u3', // Ігор (Автор)
    offeredComicId: 'c2', // Кібер-Львів 2077
    requestedComicId: 'c3', // Токійський привид
    status: 'accepted',
    createdAt: '2026-11-04',
  },
];