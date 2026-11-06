# ComicSwap — P2P Comic Trading & Indie Artist Showcase Platform

ComicSwap is a responsive React-based peer-to-peer (P2P) comic trading web application designed for comic collectors and independent comic authors/artists. It features an interactive 3D comic carousel, dynamic profile switching, seamless local storage persistence, and a light/dark theme system.

---

## Features

- **Multi-Role Ecosystem**:
  - **Collectors / Readers**: Manage personal collections, browse available titles, and initiate P2P comic trade requests.
  - **Indie Artists / Authors**: Showcase original titles, publish promotional comics with custom badges, and gain exposure within the community.
- **Interactive 3D Comic Carousel**:
  - Visually engaging 3D card layout.
  - Random 3-comic batch generation powered by a dynamic refresh button (`RefreshCw`) with spinning animations.
- **P2P Trade System**:
  - Interactive trade request modal (`TradeModal`) allowing users to propose comic swaps from their own collection.
  - Real-time status updates stored per user.
- **Dynamic Light/Dark Theme**:
  - Built with native CSS variables and React Context API.
  - Class-based theme toggling (`html.dark`) with smooth transitions.
- **Fully Responsive UI**:
  - Desktop navigation and quick profile switching via custom dropdowns.
  - Mobile-optimized sliding sidebar (Off-canvas menu) with a hamburger button for screens under 850px.
- **Local Persistence**:
  - User profiles, trade offers, and individual collections are stored directly in `localStorage`.

---

## Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API (`ThemeContext`, `UserContext`)
- **Styling**: Native CSS with CSS Variables, Flexbox, CSS Grid, and 3D Transformations

---

## Getting Started

Follow these steps to run the project locally on your machine:

### Prerequisites

Ensure you have **Node.js** (v16.0 or higher) and **npm** installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/your-username/comicswap.git](https://github.com/your-username/comicswap.git)
   cd comicswap
