"use client";

/**
 * Admin Revenue Page
 * 
 * Platform financial reports with clean card design.
 */

const revenueStats = {
  totalRevenue: 2456780,
  thisMonth: 187420,
  lastMonth: 165890,
  growth: 13.0,
  platformFees: 24567.80,
};

const monthlyRevenue = [
  { month: "Jan", amount: 145000 },
  { month: "Feb", amount: 158000 },
  { month: "Mar", amount: 142000 },
  { month: "Apr", amount: 175000 },
  { month: "May", amount: 189000 },
  { month: "Jun", amount: 198000 },
  { month: "Jul", amount: 185000 },
  { month: "Aug", amount: 205000 },
  { month: "Sep", amount: 178000 },
  { month: "Oct", amount: 195000 },
  { month: "Nov", amount: 210000 },
  { month: "Dec", amount: 187420 },
];

const topEarners = [
  { name: "SnapShot Events", email: "contact@snapshot.com", revenue: 125000, lastMonth: 108000, transactions: 6250, booths: 12, avatar: "SE" },
  { name: "EventShots", email: "hello@eventshots.com", revenue: 98000, lastMonth: 92000, transactions: 4900, booths: 9, avatar: "ES" },
  { name: "Party Pics Pro", email: "hello@partypics.com", revenue: 85000, lastMonth: 79000, transactions: 4250, booths: 8, avatar: "PP" },
  { name: "EventPix Studios", email: "info@eventpix.com", revenue: 72000, lastMonth: 75000, transactions: 3600, booths: 6, avatar: "EP" },
  { name: "Flash Photography", email: "flash@photo.com", revenue: 65000, lastMonth: 58000, transactions: 3250, booths: 4, avatar: "FP" },
];

const recentPayouts = [
  { id: "PO-001", user: "SnapShot Events", email: "contact@snapshot.com", amount: 12450, fee: 124.50, date: "Jan 15, 2024", status: "completed" as const, method: "Bank Transfer", avatar: "SE" },
  { id: "PO-002", user: "Party Pics Pro", email: "hello@partypics.com", amount: 8900, fee: 89.00, date: "Jan 15, 2024", status: "completed" as const, method: "Bank Transfer", avatar: "PP" },
  { id: "PO-003", user: "EventShots", email: "hello@eventshots.com", amount: 9800, fee: 98.00, date: "Jan 14, 2024", status: "completed" as const, method: "PayPal", avatar: "ES" },
  { id: "PO-004", user: "Celebrate Moments", email: "team@celebrate.io", amount: 5600, fee: 56.00, date: "Jan 14, 2024", status: "pending" as const, method: "Bank Transfer", avatar: "CM" },
  { id: "PO-005", user: "Flash Photography", email: "flash@photo.com", amount: 4200, fee: 42.00, date: "Jan 13, 2024", status: "completed" as const, method: "Bank Transfer", avatar: "FP" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function AdminRevenuePage() {
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.amount));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Revenue</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Platform financial analytics</p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] text-zinc-700 dark:text-white font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500">Total Revenue (YTD)</p>
          <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{formatCurrency(revenueStats.totalRevenue)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">This Month</p>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">+{revenueStats.growth}%</span>
          </div>
          <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{formatCurrency(revenueStats.thisMonth)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500">Last Month</p>
          <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{formatCurrency(revenueStats.lastMonth)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          <p className="text-sm text-zinc-500">Platform Fees (1%)</p>
          <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">{formatCurrency(revenueStats.platformFees)}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Monthly Revenue</h2>
            <p className="text-sm text-zinc-500">Year-to-date performance</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#0891B2]" />
              <span className="text-zinc-500 dark:text-zinc-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-zinc-500" />
              <span className="text-zinc-500 dark:text-zinc-400">Avg: {formatCurrency(Math.round(monthlyRevenue.reduce((sum, m) => sum + m.amount, 0) / monthlyRevenue.length))}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)]">
          {/* Chart Header Stats */}
          <div className="flex items-center gap-8 mb-6 pb-4 border-b border-[var(--border)]">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Highest</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(maxRevenue)}</p>
              <p className="text-xs text-zinc-500">{monthlyRevenue.find(m => m.amount === maxRevenue)?.month}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Lowest</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(Math.min(...monthlyRevenue.map(m => m.amount)))}</p>
              <p className="text-xs text-zinc-500">{monthlyRevenue.find(m => m.amount === Math.min(...monthlyRevenue.map(m2 => m2.amount)))?.month}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Total</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(monthlyRevenue.reduce((sum, m) => sum + m.amount, 0))}</p>
              <p className="text-xs text-zinc-500">12 months</p>
            </div>
          </div>
          
          {/* Chart */}
          <div className="relative">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-zinc-500 text-right pr-3">
              <span>{formatCurrency(maxRevenue)}</span>
              <span>{formatCurrency(maxRevenue * 0.75)}</span>
              <span>{formatCurrency(maxRevenue * 0.5)}</span>
              <span>{formatCurrency(maxRevenue * 0.25)}</span>
              <span>$0</span>
            </div>
            
            {/* Grid Lines */}
            <div className="absolute left-16 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-slate-200 dark:border-zinc-800/50" />
              <div className="border-t border-slate-200 dark:border-zinc-800/50" />
              <div className="border-t border-slate-200 dark:border-zinc-800/50" />
              <div className="border-t border-slate-200 dark:border-zinc-800/50" />
              <div className="border-t border-slate-300 dark:border-zinc-800" />
            </div>
            
            {/* Average Line */}
            <div 
              className="absolute left-16 right-0 border-t border-dashed border-zinc-600 pointer-events-none"
              style={{ 
                bottom: `${8 + ((monthlyRevenue.reduce((sum, m) => sum + m.amount, 0) / monthlyRevenue.length) / maxRevenue) * 200}px` 
              }}
            />
            
            {/* Bars */}
            <div className="ml-16 flex items-end justify-between h-[200px] px-2">
              {monthlyRevenue.map((month, index) => {
                const isCurrentMonth = index === monthlyRevenue.length - 1;
                const barHeight = (month.amount / maxRevenue) * 200;
                const prevMonth = index > 0 ? monthlyRevenue[index - 1].amount : month.amount;
                const change = ((month.amount - prevMonth) / prevMonth * 100).toFixed(1);
                const isUp = month.amount >= prevMonth;
                
                return (
                  <div key={month.month} className="flex flex-col items-center group relative w-10">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 pointer-events-none transform group-hover:translate-y-0 translate-y-1">
                      <div className="bg-white dark:bg-zinc-900 border border-[var(--border)] rounded-xl px-4 py-3 text-center shadow-2xl min-w-[120px]">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{month.month} 2024</p>
                        <p className="text-lg font-bold mt-1 text-zinc-900 dark:text-white">{formatCurrency(month.amount)}</p>
                        <div className={`text-xs mt-1 flex items-center justify-center gap-1 ${isUp ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-500"}`}>
                          <span>{isUp ? "↑" : "↓"}</span>
                          <span>{isUp ? "+" : ""}{change}%</span>
                        </div>
                      </div>
                      {/* Tooltip Arrow */}
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white dark:bg-zinc-900 border-r border-b border-[var(--border)] transform rotate-45" />
                    </div>

                    {/* Bar Container */}
                    <div className="flex flex-col-reverse h-[200px] w-full items-center">
                      {/* Bar */}
                      <div
                        className={`w-3 rounded-full transition-all duration-300 cursor-pointer ${
                          isCurrentMonth
                            ? "bg-[#0891B2] group-hover:bg-[#22D3EE] group-hover:w-4 shadow-lg shadow-[#0891B2]/20"
                            : "bg-slate-300 dark:bg-zinc-700 group-hover:bg-slate-400 dark:group-hover:bg-zinc-500 group-hover:w-4"
                        }`}
                        style={{ height: `${barHeight}px` }}
                      />
                      
                      {/* Glow effect for current month */}
                      {isCurrentMonth && (
                        <div 
                          className="absolute w-6 rounded-full bg-[#0891B2]/10 blur-md pointer-events-none"
                          style={{ height: `${barHeight}px`, bottom: '32px' }}
                        />
                      )}
                    </div>
                    
                    {/* X-Axis Label */}
                    <span className={`text-[10px] mt-3 transition-colors ${
                      isCurrentMonth
                        ? "text-[#0891B2] font-semibold"
                        : "text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                    }`}>
                      {month.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Footer */}
          <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-zinc-500">
            <span>← Scroll for more months</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0891B2]" />
                Current month
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t border-dashed border-zinc-500" />
                Average
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Earners & Recent Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Earners */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Top Earners</h2>
              <p className="text-sm text-zinc-500">This month</p>
            </div>
            <a href="/admin/users" className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors">
              View All →
            </a>
          </div>

          <div className="space-y-3">
            {topEarners.map((earner, i) => {
              const maxRevenue = topEarners[0].revenue;
              const growth = ((earner.revenue - earner.lastMonth) / earner.lastMonth * 100).toFixed(1);
              const isPositive = earner.revenue >= earner.lastMonth;

              return (
                <div key={earner.name} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[var(--border)] hover:border-slate-300 dark:hover:border-zinc-700 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    {/* Rank + Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-sm text-white">
                        {earner.avatar}
                      </div>
                      <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                        {i + 1}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-zinc-900 dark:text-white">{earner.name}</p>
                      <p className="text-xs text-zinc-500">{earner.booths} booths · {earner.transactions.toLocaleString()} txns</p>

                      {/* Progress Bar */}
                      <div className="mt-2 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0891B2] rounded-full"
                          style={{ width: `${(earner.revenue / maxRevenue) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">{formatCurrency(earner.revenue)}</p>
                      <p className={`text-xs ${isPositive ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-500"}`}>
                        {isPositive ? "+" : ""}{growth}% vs last
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Top 5 Total</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(topEarners.reduce((sum, e) => sum + e.revenue, 0))}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-500">Transactions</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">{topEarners.reduce((sum, e) => sum + e.transactions, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Payouts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Payouts</h2>
              <p className="text-sm text-zinc-500">Last 5 payouts</p>
            </div>
            <a href="#" className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors">
              View All →
            </a>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#111111] border border-[var(--border)] overflow-hidden">
            <div className="divide-y divide-[var(--border)]">
              {recentPayouts.map((payout) => (
                <div key={payout.id} className="p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0891B2] to-[#10B981] flex items-center justify-center font-bold text-xs text-white shrink-0">
                      {payout.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate text-zinc-900 dark:text-white">{payout.user}</p>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          payout.status === "completed" ? "bg-slate-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300" : "bg-slate-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                        }`}>
                          {payout.status === "completed" ? "✓ Sent" : "⏳ Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {payout.id} · {payout.method} · {payout.date}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right shrink-0">
                      <p className="font-bold text-zinc-900 dark:text-white">{formatCurrency(payout.amount)}</p>
                      <p className="text-xs text-zinc-500">
                        Fee: {formatCurrency(payout.fee)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Total Paid Out</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(recentPayouts.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0))}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-500">Pending</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(recentPayouts.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0))}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
