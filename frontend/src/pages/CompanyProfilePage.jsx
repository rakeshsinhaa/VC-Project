import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, Building2, Globe, TrendingUp, Sparkles,
    Loader2, Save, FileText, CheckCircle2, ChevronRight, Share, Box, Trash2
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function CompanyProfilePage({ companies, onDelete }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);

    // Enrichment state
    const [isEnriching, setIsEnriching] = useState(false);
    const [enrichmentData, setEnrichmentData] = useState(null);
    const [error, setError] = useState(null);

    // Notes state
    const [notes, setNotes] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isShared, setIsShared] = useState(false);

    useEffect(() => {
        const found = companies.find(c => c.id === id);
        if (found) setCompany(found);
    }, [id, companies]);

    const handleEnrich = async () => {
        if (!company) return;
        setIsEnriching(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/enrich`, {
                url: `https://${company.website}`
            });
            setEnrichmentData(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to enrich target. Ensure the AI backend is active.');
            console.error(err);
        } finally {
            setIsEnriching(false);
        }
    };

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this target?')) {
            onDelete(company.id);
            navigate('/');
        }
    };

    if (!company) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Breadcrumb Navigation */}
            <nav className="mb-8 flex items-center text-sm font-medium text-slate-500">
                <Link to="/" className="hover:text-indigo-400 flex items-center gap-1.5 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Pipeline
                </Link>
                <span className="mx-2 text-slate-700">/</span>
                <span className="text-slate-300">{company.name}</span>
            </nav>

            {/* Premium Header Profile Card */}
            <div className="premium-card mb-8 overflow-hidden bg-slate-900 border-0 ring-1 ring-slate-800 shadow-2xl">
                <div className="h-32 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 relative opacity-90 border-b border-white/5">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 invert"></div>
                </div>
                <div className="px-8 pb-8 relative">
                    <div className="absolute -top-16 left-8 flex h-28 w-28 items-center justify-center rounded-2xl bg-slate-900 shadow-xl ring-4 ring-slate-900/50 border border-slate-700">
                        <Building2 className="h-12 w-12 text-indigo-400" />
                    </div>

                    <div className="flex flex-col items-start justify-between gap-6 pt-16 sm:flex-row sm:items-center sm:pt-4">
                        <div className="pl-0 sm:pl-32">
                            <h1 className="font-display text-4xl font-extrabold text-white tracking-tight">{company.name}</h1>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                                <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors bg-slate-800/80 px-3 py-1 rounded-md border border-slate-700/50">
                                    <Globe className="h-4 w-4 text-slate-500" /> <span className="font-medium text-slate-300">{company.website}</span>
                                </a>
                                <span className="flex items-center gap-1.5 rounded-md bg-slate-800 border border-slate-700 px-3 py-1 font-semibold text-slate-300 shadow-sm">
                                    <Box className="h-4 w-4 text-slate-500" /> {company.industry}
                                </span>
                                <span className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 font-semibold text-emerald-400">
                                    <TrendingUp className="h-4 w-4 text-emerald-500" /> {company.stage}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            {!enrichmentData && (
                                <button
                                    onClick={handleEnrich}
                                    disabled={isEnriching}
                                    className={`premium-button leading-none px-6 py-3 w-full sm:w-auto shadow-indigo-500/20 shadow-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all ${isEnriching ? 'opacity-80 scale-95' : 'hover:-translate-y-0.5'}`}
                                >
                                    {isEnriching ? (
                                        <><Loader2 className="h-5 w-5 animate-spin" /> AI Analyzing Target...</>
                                    ) : (
                                        <><Sparkles className="h-5 w-5" /> Run AI Due Diligence</>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={handleShare}
                                title="Copy link to clipboard"
                                className={`premium-button-secondary px-4 py-3 transition-colors ${isShared ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                            >
                                {isShared ? <CheckCircle2 className="h-4 w-4" /> : <Share className="h-4 w-4" />}
                            </button>
                            <button
                                onClick={handleDelete}
                                title="Delete Target"
                                className={`premium-button-secondary px-4 py-3 border-red-900/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors`}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

                {/* Main Content Area (Dynamic AI Context) */}
                <div className="lg:col-span-8 space-y-8">
                    {error && (
                        <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-5 text-sm text-red-400 shadow-sm flex items-start gap-3">
                            <span className="font-bold">AI Error:</span> {error}
                        </div>
                    )}

                    {enrichmentData ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                            {/* Summary Card */}
                            <div className="premium-card p-8 bg-slate-900 ring-1 ring-white/5 border-slate-800">
                                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
                                    <h3 className="flex items-center gap-2 text-xl font-bold text-white font-display">
                                        <Sparkles className="h-5 w-5 text-indigo-400 fill-indigo-500/20" />
                                        Investment Thesis Summary
                                    </h3>
                                </div>
                                <p className="text-slate-300 leading-relaxed text-lg">{enrichmentData.summary}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Offerings */}
                                <div className="premium-card p-6 bg-slate-900 border-slate-800 ring-1 ring-white/5">
                                    <h4 className="mb-5 font-bold text-white text-base font-display">Core Offerings</h4>
                                    <ul className="space-y-4">
                                        {enrichmentData.what_they_do.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                                <div className="mt-0.5 h-5 w-5 shrink-0 flex items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                                    <ChevronRight className="h-3 w-3" />
                                                </div>
                                                <span className="leading-snug">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Extracted Signals */}
                                <div className="premium-card p-6 bg-slate-900 border-slate-800 ring-1 ring-white/5">
                                    <h4 className="mb-5 font-bold text-white text-base font-display">Extracted Growth Signals</h4>
                                    <ul className="space-y-3">
                                        {enrichmentData.derived_signals.map((signal, i) => (
                                            <li key={i} className="flex items-start gap-3 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 text-sm text-slate-300 shadow-sm">
                                                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400"></div>
                                                <span className="font-medium">{signal}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Tags Section */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Extracted Tags:</span>
                                {enrichmentData.keywords.map((kw, i) => (
                                    <span key={i} className="rounded-lg bg-slate-800 shadow-sm border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="group flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center text-slate-400 text-sm hover:bg-slate-900/80 transition-colors hover:border-indigo-500/50 cursor-pointer" onClick={handleEnrich}>
                            <div className="h-16 w-16 bg-slate-800 rounded-2xl shadow-sm border border-slate-700 flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
                                <Sparkles className="h-8 w-8 text-indigo-500/60 group-hover:text-indigo-400 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-white font-display mb-1">No AI Data Available Yet</h3>
                            <p className="max-w-xs text-slate-500">Run the enrichment pipeline to scrape this target and generate structured intelligence.</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Sticky Action Panel */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 space-y-6">
                        <div className="premium-card p-6 bg-slate-900 border-0 ring-1 ring-slate-800 shadow-xl shadow-black/40">
                            <h3 className="mb-4 font-bold text-white text-lg font-display">Analyst Memo</h3>
                            <textarea
                                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/50 p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                                rows="8"
                                placeholder="Jot down investment thesis, risks, or upcoming meeting notes here..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>

                            <button
                                onClick={handleSave}
                                className={`mt-4 w-full premium-button py-3 justify-center shadow-sm ${isSaved ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-600/30' : 'bg-indigo-600 text-white hover:bg-indigo-500 border border-transparent'}`}
                            >
                                {isSaved ? (
                                    <><CheckCircle2 className="h-5 w-5" /> Saved to CRM</>
                                ) : (
                                    <><Save className="h-5 w-5" /> Save Memo</>
                                )}
                            </button>
                        </div>

                        <div className="px-4 py-3 rounded-xl bg-slate-900/50 text-xs font-medium text-slate-400 text-center border border-slate-800 border-dashed">
                            Integration to Salesforce: <span className="text-emerald-500">Connected</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
