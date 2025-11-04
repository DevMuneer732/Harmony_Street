// src/components/InviteStats/InviteStatsView.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import useInviteStatsStore from "@/store/inviteStats.store";
import { Search } from "lucide-react";

function formatDate(iso?: string) {
  if (!iso) return "-";
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

const InviteStatsView: React.FC = () => {
  const {
    items, pagination, isLoading, error,
    page, limit, email,
    setPage, setLimit, setEmail, fetch,
  } = useInviteStatsStore();

  // initial load
  useEffect(() => { fetch(); /* eslint-disable-line */ }, []);

  const [localEmail, setLocalEmail] = useState<string>(email);

  const totalInvites = pagination?.total ?? 0;

  const runSearchNow = () => {
    const q = localEmail.trim();
    setEmail(q);
    fetch({ page: 1, email: q }); // service omits email if blank
  };

  const resetSearch = () => {
    setLocalEmail("");
    setEmail("");
    fetch({ page: 1, email: "" });
  };

  const onPrev = () => {
    if ((pagination?.page ?? 1) > 1) {
      const newPage = (pagination!.page - 1);
      setPage(newPage);
      fetch({ page: newPage, email }); // preserve filter
    }
  };

  const onNext = () => {
    if ((pagination?.page ?? 1) < (pagination?.totalPages ?? 1)) {
      const newPage = (pagination!.page + 1);
      setPage(newPage);
      fetch({ page: newPage, email }); // preserve filter
    }
  };

  const pageInfo = useMemo(() => {
    if (!pagination) return `Page ${page}`;
    return `Page ${pagination.page} of ${pagination.totalPages}`;
  }, [pagination, page]);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-lg bg-white shadow p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Invitations Summary</h2>
          <p className="text-slate-500 text-sm">All outgoing Harmony app invite emails.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-md border border-slate-200 px-4 py-2 bg-slate-50">
            <div className="text-xs text-slate-500">Total Invites</div>
            <div className="text-xl font-bold text-slate-800">{totalInvites}</div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="limit" className="text-sm text-slate-600">Rows:</label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => {
                const l = Number(e.target.value);
                setLimit(l);
                fetch({ page: 1, limit: l, email }); // keep current filter
              }}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Filter by recipient email..."
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  runSearchNow();
                }
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <button
            onClick={runSearchNow}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Search
          </button>
          <button
            onClick={resetSearch}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-6 gap-4 bg-slate-50 border-b border-slate-200 p-4 font-semibold text-slate-600">
              <div>Date</div>
              <div>Type</div>
              <div className="col-span-2">Recipients</div>
              <div className="text-center">Count</div>
              <div className="text-center">Sent By</div>
            </div>

            {isLoading && <div className="p-6 text-center text-slate-500">Loading invite stats…</div>}
            {!isLoading && error && <div className="p-6 text-center text-red-500">{error}</div>}

            {!isLoading && !error && (
              items.length === 0 ? (
                <div className="p-6 text-center text-slate-500">No records found.</div>
              ) : (
                <div className="flex flex-col">
                  {items.map((row) => (
                    <div
                      key={row._id}
                      className="grid grid-cols-6 gap-4 items-center border-b border-slate-100 last:border-b-0 p-4"
                    >
                      <div className="text-slate-700">{formatDate(row.createdAt)}</div>
                      <div className="text-slate-700">{row.type}</div>
                      <div className="col-span-2 flex flex-wrap gap-1">
                        {row.recipients?.length ? (
                          row.recipients.map((r) => (
                            <span
                              key={r}
                              className="inline-flex text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                            >
                              {r}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </div>
                      <div className="text-center font-semibold text-slate-800">{row.count}</div>
                      <div className="text-center text-slate-700">{row.sentBy}</div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && !error && pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-slate-600">{pageInfo}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm disabled:opacity-50 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={onNext}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm disabled:opacity-50 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteStatsView;
