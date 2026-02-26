import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Hexagon } from 'lucide-react';
import CompaniesPage from './pages/CompaniesPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import mockCompaniesData from './data/mockCompanies.json';

function App() {
  const [companies, setCompanies] = useState(mockCompaniesData);

  const handleNewTarget = () => {
    const url = window.prompt("Enter company website URL to track (e.g. stripe.com):");
    if (url) {
      const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const newCompany = {
        id: cleanUrl.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
        name: cleanUrl.split('.')[0].charAt(0).toUpperCase() + cleanUrl.split('.')[0].slice(1),
        website: cleanUrl,
        industry: "Pending Analysis",
        stage: "Prospect"
      };
      setCompanies([newCompany, ...companies]);
    }
  };

  const handleDeleteTarget = (targetId) => {
    setCompanies(prev => prev.filter(c => c.id !== targetId));
  };

  const handleComingSoon = (e) => {
    e.preventDefault();
    alert("This feature is coming in the next release!");
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 relative selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col font-sans text-slate-300">

        {/* Decorative background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-900/20 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-900/20 blur-[80px]"></div>
        </div>

        <div className="relative z-10 flex flex-col flex-1">
          <header className="bg-slate-950/70 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative flex items-center justify-center">
                  <Hexagon className="w-9 h-9 text-indigo-500 fill-indigo-500/10 group-hover:fill-indigo-500/20 transition-all duration-300" strokeWidth={1.5} />
                  <div className="absolute w-3 h-3 bg-purple-500 rounded-full blur-[3px] opacity-80"></div>
                </div>
                <span className="font-display font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                  VC Intel
                </span>
              </Link>
              <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-slate-400">
                <Link to="/" className="text-white font-semibold border-b-2 border-indigo-500 py-1">Discover</Link>
                <a href="#" onClick={handleComingSoon} className="hover:text-white transition-colors py-1">Pipelines</a>
                <a href="#" onClick={handleComingSoon} className="hover:text-white transition-colors py-1">Portfolios</a>
                <div className="h-8 w-px bg-slate-800 mx-2"></div>
                <button
                  onClick={handleNewTarget}
                  className="premium-button bg-indigo-600 text-white hover:bg-indigo-500 shadow-md border-0"
                >
                  New Target
                </button>
              </nav>
            </div>
          </header>

          <main className="flex-1 py-10">
            <Routes>
              <Route path="/" element={<CompaniesPage companies={companies} onDelete={handleDeleteTarget} />} />
              <Route path="/company/:id" element={<CompanyProfilePage companies={companies} onDelete={handleDeleteTarget} />} />
            </Routes>
          </main>

          <footer className="mt-auto border-t border-slate-900 bg-slate-950/50 backdrop-blur py-8 text-center text-sm text-slate-600">
            <p>© {new Date().getFullYear()} VC Intel. Internal Pipeline MVP.</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
