import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "neutral";
}

function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
              <TrendingUp className="h-3 w-3" />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-primary rounded-lg">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
    </Card>
  );
}

export function DeploymentStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Deployments"
        value="156"
        change="+12%"
        icon={CheckCircle}
        trend="up"
      />
      <StatsCard
        title="Success Rate"
        value="98.4%"
        change="+2.1%"
        icon={TrendingUp}
        trend="up"
      />
      <StatsCard
        title="Avg Deploy Time"
        value="2.3min"
        change="-15%"
        icon={Clock}
        trend="up"
      />
      <StatsCard
        title="Failed Deployments"
        value="3"
        change="-50%"
        icon={XCircle}
        trend="up"
      />
    </div>
  );
}