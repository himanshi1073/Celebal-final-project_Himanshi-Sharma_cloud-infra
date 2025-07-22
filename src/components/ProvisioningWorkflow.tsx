import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Square, 
  RotateCcw, 
  Settings, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Zap
} from "lucide-react";

interface ProvisioningStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  duration?: string;
  details?: string;
}

interface ProvisioningJob {
  id: string;
  environment: "dev" | "uat" | "prod";
  template: string;
  status: "running" | "completed" | "failed" | "pending";
  progress: number;
  startTime: string;
  duration?: string;
  steps: ProvisioningStep[];
  webhookUrl?: string;
}

const mockJobs: ProvisioningJob[] = [
  {
    id: "job-1",
    environment: "uat",
    template: "Web Server + Load Balancer",
    status: "completed",
    progress: 100,
    startTime: "2024-01-15T10:30:00Z",
    duration: "8m 32s",
    steps: [
      { id: "1", name: "Resource Group Creation", status: "completed", duration: "45s" },
      { id: "2", name: "Virtual Network Setup", status: "completed", duration: "1m 20s" },
      { id: "3", name: "VM Deployment", status: "completed", duration: "4m 15s" },
      { id: "4", name: "Load Balancer Configuration", status: "completed", duration: "2m 12s" }
    ]
  },
  {
    id: "job-2", 
    environment: "prod",
    template: "Multi-Environment Infrastructure",
    status: "running",
    progress: 65,
    startTime: "2024-01-15T14:20:00Z",
    steps: [
      { id: "1", name: "Resource Group Creation", status: "completed", duration: "38s" },
      { id: "2", name: "Virtual Network Setup", status: "completed", duration: "1m 45s" },
      { id: "3", name: "VM Deployment", status: "running", details: "Deploying VM 2 of 2" },
      { id: "4", name: "Load Balancer Configuration", status: "pending" }
    ]
  }
];

const statusConfig = {
  pending: { icon: Clock, color: "bg-muted text-muted-foreground" },
  running: { icon: Play, color: "bg-warning text-warning-foreground" },
  completed: { icon: CheckCircle, color: "bg-success text-success-foreground" },
  failed: { icon: AlertCircle, color: "bg-destructive text-destructive-foreground" }
};

const environmentColors = {
  dev: "bg-accent text-accent-foreground",
  uat: "bg-warning text-warning-foreground", 
  prod: "bg-destructive text-destructive-foreground"
};

export function ProvisioningWorkflow() {
  const [jobs, setJobs] = useState<ProvisioningJob[]>(mockJobs);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  const handleDeploy = async () => {
    if (!selectedEnvironment || !selectedTemplate) {
      toast({
        title: "Missing Configuration",
        description: "Please select environment and template",
        variant: "destructive"
      });
      return;
    }

    setIsDeploying(true);

    // Trigger Zapier webhook if provided
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors",
          body: JSON.stringify({
            event: "infrastructure_deployment_started",
            environment: selectedEnvironment,
            template: selectedTemplate,
            timestamp: new Date().toISOString(),
            triggered_from: window.location.origin
          })
        });

        toast({
          title: "Webhook Triggered",
          description: "Zapier webhook has been notified of the deployment",
        });
      } catch (error) {
        console.error("Webhook error:", error);
      }
    }

    // Simulate deployment
    const newJob: ProvisioningJob = {
      id: `job-${Date.now()}`,
      environment: selectedEnvironment as any,
      template: selectedTemplate,
      status: "running",
      progress: 0,
      startTime: new Date().toISOString(),
      webhookUrl,
      steps: [
        { id: "1", name: "Resource Group Creation", status: "running" },
        { id: "2", name: "Virtual Network Setup", status: "pending" },
        { id: "3", name: "VM Deployment", status: "pending" },
        { id: "4", name: "Load Balancer Configuration", status: "pending" }
      ]
    };

    setJobs(prev => [newJob, ...prev]);

    toast({
      title: "Deployment Started",
      description: `Infrastructure deployment to ${selectedEnvironment} environment initiated`,
    });

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsDeploying(false);
        
        setJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: "completed", progress: 100, duration: "7m 45s" }
            : job
        ));

        // Trigger completion webhook
        if (webhookUrl) {
          fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "no-cors",
            body: JSON.stringify({
              event: "infrastructure_deployment_completed",
              environment: selectedEnvironment,
              template: selectedTemplate,
              duration: "7m 45s",
              timestamp: new Date().toISOString()
            })
          }).catch(console.error);
        }

        toast({
          title: "Deployment Complete",
          description: `Infrastructure successfully deployed to ${selectedEnvironment}`,
        });
      }
      
      setJobs(prev => prev.map(job => 
        job.id === newJob.id ? { ...job, progress } : job
      ));
    }, 1000);

    setTimeout(() => setIsDeploying(false), 8000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Infrastructure Provisioning</h3>
        
        <Tabs defaultValue="deploy" className="space-y-6">
          <TabsList>
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
            <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="deploy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-medium mb-4">Deployment Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Environment</label>
                    <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dev">Development</SelectItem>
                        <SelectItem value="uat">UAT (Testing)</SelectItem>
                        <SelectItem value="prod">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">IaC Template</label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Server + Load Balancer">Web Server + Load Balancer</SelectItem>
                        <SelectItem value="Multi-Environment Infrastructure">Multi-Environment Infrastructure</SelectItem>
                        <SelectItem value="High Availability Setup">High Availability Setup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Zapier Webhook URL (Optional)
                    </label>
                    <Input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Webhook will be triggered on deployment start and completion
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Button 
                    variant="deploy" 
                    className="w-full"
                    onClick={handleDeploy}
                    disabled={isDeploying}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isDeploying ? "Deploying..." : "Deploy Infrastructure"}
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Rollback
                    </Button>
                  </div>

                  <Button variant="success" size="sm" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    One-Click UAT Deploy
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            {jobs.filter(job => job.status === "running").map((job) => (
              <Card key={job.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-warning animate-pulse" />
                      <span className="font-medium">{job.template}</span>
                    </div>
                    <Badge className={environmentColors[job.environment]}>
                      {job.environment.toUpperCase()}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(job.progress)}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    {job.steps.map((step) => {
                      const StatusIcon = statusConfig[step.status].icon;
                      return (
                        <div key={step.id} className="flex items-center gap-3">
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm flex-1">{step.name}</span>
                          {step.status === "running" && step.details && (
                            <span className="text-xs text-muted-foreground">{step.details}</span>
                          )}
                          {step.duration && (
                            <span className="text-xs text-muted-foreground">{step.duration}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {jobs.filter(job => job.status !== "running").map((job) => {
              const StatusIcon = statusConfig[job.status].icon;
              return (
                <Card key={job.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="h-5 w-5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{job.template}</span>
                          <Badge className={environmentColors[job.environment]}>
                            {job.environment.toUpperCase()}
                          </Badge>
                          <Badge className={statusConfig[job.status].color}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Started {new Date(job.startTime).toLocaleString()}
                          {job.duration && ` • Duration: ${job.duration}`}
                        </p>
                      </div>
                    </div>
                    {job.status === "completed" && (
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Clone
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}