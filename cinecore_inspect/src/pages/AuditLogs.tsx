import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Film
} from 'lucide-react';
import { MovieAudit, AuditActionType } from '../types';

interface AuditLogsProps {
  auditLogs: MovieAudit[];
  onRefresh?: () => void;
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ auditLogs }) => {
  const [filterAction, setFilterAction] = useState<AuditActionType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = useMemo(() => {
    let result = [...auditLogs];

    if (filterAction !== 'ALL') {
      result = result.filter((l) => l.ActionType === filterAction);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((l) =>
        l.MovieName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [auditLogs, filterAction, searchQuery]);

  const insertCount = auditLogs.filter((l) => l.ActionType === 'INSERT').length;
  const updateCount = auditLogs.filter((l) => l.ActionType === 'UPDATE').length;
  const deleteCount = auditLogs.filter((l) => l.ActionType === 'DELETE').length;

  const getActionLabel = (type: AuditActionType) => {
    switch (type) {
      case 'INSERT':
        return 'Added';
      case 'UPDATE':
        return 'Updated';
      case 'DELETE':
        return 'Removed';
      default:
        return type;
    }
  };

  const getFriendlyDetails = (log: MovieAudit) => {
    if (log.Details) {
      // Replace any developer phrase like "Initial catalog INSERT" or "Manual UPDATE"
      return log.Details
        .replace(/INSERT/g, 'Added')
        .replace(/UPDATE/g, 'Updated')
        .replace(/DELETE/g, 'Removed')
        .replace(/record/gi, 'title');
    }
    if (log.ActionType === 'INSERT') return 'Added new title to library collection';
    if (log.ActionType === 'UPDATE') return 'Updated movie details & rating';
    return 'Removed title from active library';
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Activity Header */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl relative overflow-hidden tech-bracket-top-left tech-bracket-bottom-right">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>ACTIVITY TIMELINE // RECENT CHANGES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
              LIBRARY ACTIVITY
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live chronological record of newly cataloged titles, rating shifts, and collection updates.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>COLLECTION SYNCHRONIZED</span>
            </span>
          </div>
        </div>

        {/* Live Counters */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">TOTAL ACTIVITIES</span>
            <div className="text-xl font-bold text-white mt-0.5 tabular-nums">
              {auditLogs.length}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 uppercase">TITLES ADDED</span>
            <div className="text-xl font-bold text-emerald-300 mt-0.5 tabular-nums">
              {insertCount}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 uppercase">TITLES UPDATED</span>
            <div className="text-xl font-bold text-cyan-300 mt-0.5 tabular-nums">
              {updateCount}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30">
            <span className="text-[10px] text-rose-400 uppercase">TITLES REMOVED</span>
            <div className="text-xl font-bold text-rose-300 mt-0.5 tabular-nums">
              {deleteCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Activities' },
            { id: 'INSERT', label: 'Added' },
            { id: 'UPDATE', label: 'Updated' },
            { id: 'DELETE', label: 'Removed' }
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilterAction(id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterAction === id
                  ? id === 'INSERT'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                    : id === 'UPDATE'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                    : id === 'DELETE'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                    : 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity by movie name..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Activity Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Movie Title</th>
                <th className="py-3.5 px-4 font-semibold">Action</th>
                <th className="py-3.5 px-4 font-semibold">Rating Status</th>
                <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                <th className="py-3.5 px-4 font-semibold">Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No matching activity recorded.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => {
                  const isInsert = log.ActionType === 'INSERT';
                  const isUpdate = log.ActionType === 'UPDATE';

                  return (
                    <motion.tr
                      key={log.AuditID}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.2) }}
                      className="hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Movie Name */}
                      <td className="py-3.5 px-4 font-medium text-white max-w-[220px]">
                        <div className="flex items-center gap-2">
                          <Film className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
                          <span className="truncate font-semibold">{log.MovieName}</span>
                        </div>
                      </td>

                      {/* Action Type Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                            isInsert
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : isUpdate
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {getActionLabel(log.ActionType)}
                        </span>
                      </td>

                      {/* Old -> New Rating */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        {isInsert ? (
                          <span className="text-emerald-400 font-bold">★ {log.NewRating?.toFixed(1)}</span>
                        ) : log.ActionType === 'DELETE' ? (
                          <span className="text-rose-400 line-through">★ {log.OldRating?.toFixed(1)}</span>
                        ) : log.OldRating !== null && log.NewRating !== null ? (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <span className="text-slate-400">★ {log.OldRating.toFixed(1)}</span>
                            <ArrowRight className="w-3 h-3 text-cyan-400" />
                            <span className="text-amber-400 font-bold">★ {log.NewRating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-sans">No rating change</span>
                        )}
                      </td>

                      {/* Action Time */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        {log.ActionTime}
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-4 text-slate-300 max-w-[240px] truncate text-[11px]">
                        {getFriendlyDetails(log)}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const Activity = AuditLogs;

