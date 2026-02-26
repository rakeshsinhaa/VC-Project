import React, { useState } from 'react';
import CompanyTable from '../components/CompanyTable';
import { Target, Search, SlidersHorizontal } from 'lucide-react';

export default function CompaniesPage({ companies, onDelete }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortAscending, setSortAscending] = useState(true);

    const filteredCompanies = companies.filter(company => {
        const query = searchQuery.toLowerCase();
        return (
            company.name.toLowerCase().includes(query) ||
            company.industry.toLowerCase().includes(query) ||
            company.website.toLowerCase().includes(query)
        );
    });

    const sortedCompanies = [...filteredCompanies].sort((a, b) => {
        if (sortAscending) {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    const toggleSort = () => {
        setSortAscending(!sortAscending);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex flex-col items-start space-y-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                        <Target className="h-4 w-4" />
                        Deal Flow Pipeline
                    </span>
                    <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                        Discover & Enrich
                    </h1>
                    <p className="max-w-xl text-lg text-slate-400 leading-relaxed">
                        Source and manage your investment pipeline. Select a target to run automated AI due diligence and data enrichment.
                    </p>
                </div>

                {/* Search Bar mock */}
                <div className="flex w-full md:max-w-md items-center gap-3">
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-slate-500" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-xl border-0 py-3 pl-10 pr-3 text-slate-200 shadow-sm ring-1 ring-inset ring-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-slate-900/50 backdrop-blur-sm transition-shadow"
                            placeholder="Search targets..."
                        />
                    </div>
                    <button
                        onClick={toggleSort}
                        title={`Sort by name ${sortAscending ? '(Desc)' : '(Asc)'}`}
                        className={`flex items-center justify-center p-3 rounded-xl ring-1 ring-inset transition-colors shadow-sm ${sortAscending ? 'bg-indigo-500/20 ring-indigo-500/30 text-indigo-400' : 'ring-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-400'}`}
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="premium-card p-2 bg-slate-900/80 backdrop-blur-sm border-slate-800 ring-1 ring-white/5 shadow-2xl shadow-black/50">
                <div className="px-5 py-5 flex items-center justify-between border-b border-slate-800">
                    <h2 className="text-lg font-semibold text-white tracking-tight">Active Targets</h2>
                    <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300 ring-1 ring-inset ring-slate-700">
                        {sortedCompanies.length} Companies
                    </span>
                </div>
                {sortedCompanies.length > 0 ? (
                    <CompanyTable companies={sortedCompanies} onDelete={onDelete} />
                ) : (
                    <div className="p-10 text-center text-slate-500">
                        No targets found matching your search. Try adding a New Target.
                    </div>
                )}
            </div>
        </div>
    );
}
