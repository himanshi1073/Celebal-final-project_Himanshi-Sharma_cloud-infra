import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, RotateCcw, GitCommit, User } from "lucide-react";

interface DeploymentRecord {
  id: string;
  environment: string;
  version: string;
  status: "success" | "failed" | "pending";
  timestamp: string;
  author: string;
  duration?: string;
}

interface DeploymentHistoryProps {
  deployments: DeploymentRecord[];
  onRollback?: (deploymentId: string) => void;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: "bg-success text-success-foreground",
    label: "Success"
  },
  failed: {
    icon: XCircle,
    color: "bg-destructive text-destructive-foreground",
    label: "Failed"
  },
  pending: {
    icon: Clock,
    color: "bg-warning text-warning-foreground",
    label: "Pending"
  }
};

export function DeploymentHistory({ deployments, onRollback }: DeploymentHistoryProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Deployment History</h3>
      <div className="space-y-4">
        {deployments.map((deployment) => {
          const StatusIcon = statusConfig[deployment.status].icon;
          
          return (
            <div
              key={deployment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <StatusIcon className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{deployment.environment}</span>
                    <Badge className={statusConfig[deployment.status].color}>
                      {statusConfig[deployment.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <GitCommit className="h-3 w-3" />
                      <span>{deployment.version}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{deployment.author}</span>
                    </div>
                    <span>{deployment.timestamp}</span>
                    {deployment.duration && (
                      <span>• {deployment.duration}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {deployment.status === "success" && onRollback && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRollback(deployment.id)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Rollback
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}