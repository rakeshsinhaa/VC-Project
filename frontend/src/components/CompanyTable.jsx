import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Globe, TrendingUp, ChevronRight, Trash2 } from 'lucide-react';

export default function CompanyTable({ companies, onDelete }) {
    const navigate = useNavigate();

    return (
        <div className="overflow-hidden bg-slate-900/50 rounded-b-xl">
            <table className="min-w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 border-b border-slate-800">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Target</th>
                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Domain</th>
                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Sector</th>
                        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Stage</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                    {companies.map((company) => (
                        <tr
                            key={company.id}
                            onClick={() => navigate(`/company/${company.id}`)}
                            className="cursor-pointer transition-all duration-200 hover:bg-slate-800/50 group relative"
                        >
                            <td className="px-6 py-5 whitespace-nowrap">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700 text-indigo-400 shadow-inner group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white group-hover:border-indigo-500 transition-all duration-300">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-display font-bold text-base text-white">{company.name}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                                <a
                                    href={`https://${company.website}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors"
                                >
                                    <Globe className="h-4 w-4" />
                                    <span className="font-medium">{company.website}</span>
                                </a>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                                <span className="inline-flex items-center rounded-md bg-slate-800/80 border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 shadow-sm group-hover:border-slate-600 transition-colors">
                                    {company.industry}
                                </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                                <div className="flex items-center gap-2 font-medium text-slate-300">
                                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                                    {company.stage}
                                </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end text-indigo-400 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(company.id); }}
                                        className="hover:text-red-400 p-2 mr-2 rounded-lg hover:bg-slate-800 transition-colors"
                                        title="Delete Target"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <span>Enrich</span>
                                    <ChevronRight className="h-5 w-5 ml-1" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
