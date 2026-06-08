import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Timeline from '@/pages/Timeline';
import SongDetail from '@/pages/SongDetail';
import Collection from '@/pages/Collection';
import MemoryWall from '@/pages/MemoryWall';
import MemoryPolaroid from '@/pages/MemoryPolaroid';
import GuessSong from '@/pages/GuessSong';
import DriftBottle from '@/pages/DriftBottle';
import Auction from '@/pages/Auction';
import ConcertHall from '@/pages/ConcertHall';
import VintageWeatherPopup from '@/components/VintageWeatherPopup';
import { useWeatherStore } from '@/store/weatherStore';
import { useUserStore } from '@/store/userStore';

export default function App() {
  const [showWeatherPopup, setShowWeatherPopup] = useState(false);
  const { hasShownToday, markShownToday } = useWeatherStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasShownToday(currentUser.id)) {
        setShowWeatherPopup(true);
        markShownToday(currentUser.id);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [currentUser.id, hasShownToday, markShownToday]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/song/:id" element={<SongDetail />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/memory-wall" element={<MemoryWall />} />
            <Route path="/guess-song" element={<GuessSong />} />
            <Route path="/polaroid" element={<MemoryPolaroid />} />
            <Route path="/drift-bottle" element={<DriftBottle />} />
            <Route path="/auction" element={<Auction />} />
            <Route path="/concert-hall" element={<ConcertHall />} />
            <Route
              path="*"
              element={
                <div className="min-h-[60vh] flex items-center justify-center bg-vintage-brownDark">
                  <div className="text-center">
                    <h1 className="vintage-heading text-6xl mb-4">404</h1>
                    <p className="text-vintage-paper/60 font-serif text-lg">
                      那段记忆，似乎遗失在时光里了…
                    </p>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
        <VintageWeatherPopup
          isOpen={showWeatherPopup}
          onClose={() => setShowWeatherPopup(false)}
        />
      </div>
    </Router>
  );
}
