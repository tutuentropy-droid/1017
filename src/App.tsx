import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Timeline from '@/pages/Timeline';
import SongDetail from '@/pages/SongDetail';
import Collection from '@/pages/Collection';
import MemoryWall from '@/pages/MemoryWall';
import MemoryPolaroid from '@/pages/MemoryPolaroid';

export default function App() {
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
            <Route path="/polaroid" element={<MemoryPolaroid />} />
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
      </div>
    </Router>
  );
}
