import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Server, HardDrive, Cpu, MemoryStick, Network, Activity } from "lucide-react";

interface VMInstance {
  id: string;
  name: string;
  status: "running" | "stopped" | "starting" | "stopping";
  size: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  environment: string;
  publicIp?: string;
  privateIp: string;
}

interface LoadBalancer {
  id: string;
  name: string;
  status: "healthy" | "unhealthy" | "configuring";
  publicIp: string;
  backendInstances: number;
  healthyInstances: number;
  environment: string;
}

const mockVMs: VMInstance[] = [
  {
    id: "vm1",
    name: "web-server-01-prod",
    status: "running",
    size: "Standard_B2s",
    cpu: 45,
    memory: 60,
    disk: 35,
    network: 20,
    environment: "Production",
    publicIp: "20.123.45.67",
    privateIp: "10.0.1.4"
  },
  {
    id: "vm2", 
    name: "web-server-02-prod",
    status: "running",
    size: "Standard_B2s",
    cpu: 38,
    memory: 55,
    disk: 40,
    network: 25,
    environment: "Production",
    publicIp: "20.123.45.68",
    privateIp: "10.0.1.5"
  },
  {
    id: "vm3",
    name: "web-server-01-uat",
    status: "running", 
    size: "Standard_B1s",
    cpu: 25,
    memory: 40,
    disk: 20,
    network: 15,
    environment: "UAT",
    privateIp: "10.1.1.4"
  }
];

const mockLoadBalancers: LoadBalancer[] = [
  {
    id: "lb1",
    name: "lb-webapp-prod",
    status: "healthy",
    publicIp: "20.123.45.100",
    backendInstances: 2,
    healthyInstances: 2,
    environment: "Production"
  },
  {
    id: "lb2",
    name: "lb-webapp-uat", 
    status: "healthy",
    publicIp: "20.123.46.100",
    backendInstances: 1,
    healthyInstances: 1,
    environment: "UAT"
  }
];

const statusColors = {
  running: "bg-success text-success-foreground",
  stopped: "bg-muted text-muted-foreground",
  starting: "bg-warning text-warning-foreground",
  stopping: "bg-warning text-warning-foreground",
  healthy: "bg-success text-success-foreground",
  unhealthy: "bg-destructive text-destructive-foreground",
  configuring: "bg-warning text-warning-foreground"
};

function VMCard({ vm }: { vm: VMInstance }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          <div>
            <h4 className="font-medium text-sm">{vm.name}</h4>
            <p className="text-xs text-muted-foreground">{vm.size}</p>
          </div>
        </div>
        <Badge className={statusColors[vm.status]}>
          {vm.status}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            <span>CPU</span>
          </div>
          <span>{vm.cpu}%</span>
        </div>
        <Progress value={vm.cpu} className="h-1" />

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <MemoryStick className="h-3 w-3" />
            <span>Memory</span>
          </div>
          <span>{vm.memory}%</span>
        </div>
        <Progress value={vm.memory} className="h-1" />

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            <span>Disk</span>
          </div>
          <span>{vm.disk}%</span>
        </div>
        <Progress value={vm.disk} className="h-1" />

        <div className="pt-2 border-t space-y-1">
          <div className="flex justify-between text-xs">
            <span>Private IP:</span>
            <span className="font-mono">{vm.privateIp}</span>
          </div>
          {vm.publicIp && (
            <div className="flex justify-between text-xs">
              <span>Public IP:</span>
              <span className="font-mono">{vm.publicIp}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function LoadBalancerCard({ lb }: { lb: LoadBalancer }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-accent" />
          <div>
            <h4 className="font-medium text-sm">{lb.name}</h4>
            <p className="text-xs text-muted-foreground">{lb.environment}</p>
          </div>
        </div>
        <Badge className={statusColors[lb.status]}>
          {lb.status}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span>Public IP:</span>
          <span className="font-mono">{lb.publicIp}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span>Backend Health</span>
          </div>
          <span>{lb.healthyInstances}/{lb.backendInstances}</span>
        </div>

        <Progress 
          value={(lb.healthyInstances / lb.backendInstances) * 100} 
          className="h-2"
        />

        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Backend Pool:</span>
              <p className="font-medium">{lb.backendInstances} instances</p>
            </div>
            <div>
              <span className="text-muted-foreground">Health Probes:</span>
              <p className="font-medium text-success">Active</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function InfrastructureOverview() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Infrastructure Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-5 w-5 text-primary" />
              <span className="font-medium">Virtual Machines</span>
            </div>
            <div className="text-2xl font-bold">{mockVMs.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockVMs.filter(vm => vm.status === "running").length} running
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Network className="h-5 w-5 text-accent" />
              <span className="font-medium">Load Balancers</span>
            </div>
            <div className="text-2xl font-bold">{mockLoadBalancers.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockLoadBalancers.filter(lb => lb.status === "healthy").length} healthy
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-success" />
              <span className="font-medium">Health Score</span>
            </div>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Virtual Machines</h4>
            <div className="space-y-4">
              {mockVMs.map((vm) => (
                <VMCard key={vm.id} vm={vm} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Load Balancers</h4>
            <div className="space-y-4">
              {mockLoadBalancers.map((lb) => (
                <LoadBalancerCard key={lb.id} lb={lb} />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}