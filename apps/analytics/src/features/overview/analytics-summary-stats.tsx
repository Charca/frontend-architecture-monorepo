import { StatCard } from "@commerceos/shared/components/stat-card";
import { formatCurrency, formatNumber } from "@commerceos/shared/lib/utils";
import type { AnalyticsOverview } from "@commerceos/shared/types";

interface AnalyticsSummaryStatsProps {
  analytics: AnalyticsOverview;
}

export function AnalyticsSummaryStats({ analytics }: AnalyticsSummaryStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard title="Revenue" value={formatCurrency(analytics.revenue)} detail="Paid order revenue" />
      <StatCard title="AOV" value={formatCurrency(analytics.aov)} detail="Average order value" />
      <StatCard title="Orders" value={formatNumber(analytics.orders)} detail="Total orders tracked" />
    </div>
  );
}
