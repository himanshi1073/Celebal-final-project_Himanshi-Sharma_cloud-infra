import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnvironmentCard } from "./EnvironmentCard";
import { DeploymentHistory } from "./DeploymentHistory";
import { DeploymentStats } from "./DeploymentStats";
import { IaCTemplateManager } from "./IaCTemplateManager";
import { InfrastructureOverview } from "./InfrastructureOverview";
import { ProvisioningWorkflow } from "./ProvisioningWorkflow";
import { EnvironmentParameters } from "./EnvironmentParameters";
import { useToast } from "@/hooks/use-toast";
import { Server, Settings, Plus, Zap, Code, Monitor, Cog } from "lucide-react";

interface Environment {
  id: string;
  name: string;
  type: "production" | "uat" | "staging";
  status: "healthy" | "deploying" | "error" | "stopped";
  version: string;
  lastDeployment: string;
  url?: string;
}

const mockEnvironments: Environment[] = [
  {
    id: "1",
    name: "Production",
    type: "production",
    status: "healthy",
    version: "v2.4.1",
    lastDeployment: "2 hours ago",
    url: "https://myapp.com"
  },
  {
    id: "2", 
    name: "UAT Environment",
    type: "uat",
    status: "healthy",
    version: "v2.5.0-rc1",
    lastDeployment: "30 minutes ago",
    url: "https://uat.myapp.com"
  },
  {
    id: "3",
    name: "Staging",
    type: "staging", 
    status: "deploying",
    version: "v2.5.0-rc2",
    lastDeployment: "5 minutes ago",
    url: "https://staging.myapp.com"
  }
];

const mockDeployments = [
  {
    id: "1",
    environment: "UAT",
    version: "v2.5.0-rc1",
    status: "success" as const,
    timestamp: "30 minutes ago",
    author: "john.doe",
    duration: "2m 15s"
  },
  {
    id: "2",
    environment: "Production",
    version: "v2.4.1",
    status: "success" as const,
    timestamp: "2 hours ago", 
    author: "jane.smith",
    duration: "3m 42s"
  },
  {
    id: "3",
    environment: "Staging",
    version: "v2.4.0",
    status: "failed" as const,
    timestamp: "1 day ago",
    author: "bob.wilson",
    duration: "1m 20s"
  }
];

export function HostingDashboard() {
  const [environments, setEnvironments] = useState<Environment[]>(mockEnvironments);
  const { toast } = useToast();

  const handleDeploy = (envId: string) => {
    setEnvironments(prev => 
      prev.map(env => 
        env.id === envId 
          ? { ...env, status: "deploying" as const }
          : env
      )
    );

    toast({
      title: "Deployment Started",
      description: `Deploying to ${environments.find(e => e.id === envId)?.name}...`,
    });

    // Simulate deployment completion
    setTimeout(() => {
      setEnvironments(prev => 
        prev.map(env => 
          env.id === envId 
            ? { 
                ...env, 
                status: "healthy" as const,
                lastDeployment: "Just now",
                version: "v2.5.0"
              }
            : env
        )
      );

      toast({
        title: "Deployment Successful",
        description: `Successfully deployed to ${environments.find(e => e.id === envId)?.name}!`,
      });
    }, 3000);
  };

  const handleRollback = (deploymentId: string) => {
    toast({
      title: "Rollback Initiated",
      description: "Rolling back to previous version...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Server className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">DeployHub Pro</h1>
                <p className="text-sm text-muted-foreground">Infrastructure as Code Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="tech" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Environment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Infrastructure
            </TabsTrigger>
            <TabsTrigger value="provisioning" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Provisioning
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="parameters" className="flex items-center gap-2">
              <Cog className="h-4 w-4" />
              Parameters
            </TabsTrigger>
            <TabsTrigger value="deployments" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Deployments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats */}
            <DeploymentStats />

            {/* Quick Actions */}
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Quick Deploy</h2>
              <Button 
                variant="deploy" 
                size="sm"
                onClick={() => handleDeploy("2")}
              >
                <Zap className="h-4 w-4 mr-2" />
                Deploy to UAT
              </Button>
              <Button 
                variant="success" 
                size="sm"
                onClick={() => handleDeploy("1")}
              >
                <Zap className="h-4 w-4 mr-2" />
                Deploy to Production
              </Button>
            </div>

            {/* Environments Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Environments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {environments.map((env) => (
                  <EnvironmentCard
                    key={env.id}
                    name={env.name}
                    type={env.type}
                    status={env.status}
                    version={env.version}
                    lastDeployment={env.lastDeployment}
                    url={env.url}
                    onDeploy={() => handleDeploy(env.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="infrastructure">
            <InfrastructureOverview />
          </TabsContent>

          <TabsContent value="provisioning">
            <ProvisioningWorkflow />
          </TabsContent>

          <TabsContent value="templates">
            <IaCTemplateManager />
          </TabsContent>

          <TabsContent value="parameters">
            <EnvironmentParameters />
          </TabsContent>

          <TabsContent value="deployments" className="space-y-8">
            <DeploymentHistory 
              deployments={mockDeployments}
              onRollback={handleRollback}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}