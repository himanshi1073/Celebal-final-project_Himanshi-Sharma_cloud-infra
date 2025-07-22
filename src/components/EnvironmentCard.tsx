import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Globe, Clock, GitCommit, Activity } from "lucide-react";

interface EnvironmentCardProps {
  name: string;
  type: "production" | "uat" | "staging";
  status: "healthy" | "deploying" | "error" | "stopped";
  version: string;
  lastDeployment: string;
  url?: string;
  onDeploy: () => void;
}

const statusConfig = {
  healthy: {
    color: "bg-success text-success-foreground",
    icon: Activity,
    label: "Healthy"
  },
  deploying: {
    color: "bg-warning text-warning-foreground",
    icon: Clock,
    label: "Deploying"
  },
  error: {
    color: "bg-destructive text-destructive-foreground",
    icon: Activity,
    label: "Error"
  },
  stopped: {
    color: "bg-muted text-muted-foreground",
    icon: Activity,
    label: "Stopped"
  }
};

const typeConfig = {
  production: {
    color: "bg-destructive text-destructive-foreground",
    label: "Production"
  },
  uat: {
    color: "bg-warning text-warning-foreground",
    label: "UAT"
  },
  staging: {
    color: "bg-accent text-accent-foreground",
    label: "Staging"
  }
};

export function EnvironmentCard({
  name,
  type,
  status,
  version,
  lastDeployment,
  url,
  onDeploy
}: EnvironmentCardProps) {
  const StatusIcon = statusConfig[status].icon;

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-elevated border-2 hover:border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{name}</h3>
            <Badge className={typeConfig[type].color}>
              {typeConfig[type].label}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            <Badge variant="outline" className={statusConfig[status].color}>
              {statusConfig[status].label}
            </Badge>
          </div>
        </div>
        {url && (
          <Button variant="ghost" size="sm" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GitCommit className="h-4 w-4" />
          <span>Version: {version}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last deployed: {lastDeployment}</span>
        </div>
      </div>

      <Button 
        onClick={onDeploy}
        className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
        disabled={status === "deploying"}
      >
        <Rocket className="h-4 w-4 mr-2" />
        {status === "deploying" ? "Deploying..." : "Deploy Now"}
      </Button>
    </Card>
  );
}