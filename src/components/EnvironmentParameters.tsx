import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, Copy, Eye, EyeOff } from "lucide-react";

interface EnvironmentParameter {
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "secret";
  description?: string;
  required: boolean;
}

interface EnvironmentConfig {
  environment: "dev" | "uat" | "prod";
  parameters: EnvironmentParameter[];
  region: string;
  resourceGroupNaming: string;
  tags: Record<string, string>;
}

const mockConfigs: EnvironmentConfig[] = [
  {
    environment: "dev",
    region: "East US",
    resourceGroupNaming: "rg-webapp-dev",
    parameters: [
      { key: "vmCount", value: "1", type: "number", description: "Number of VMs to deploy", required: true },
      { key: "vmSize", value: "Standard_B1s", type: "string", description: "VM size", required: true },
      { key: "enableBackup", value: "false", type: "boolean", description: "Enable VM backup", required: false },
      { key: "adminUsername", value: "azureuser", type: "string", description: "Admin username", required: true },
      { key: "adminPassword", value: "SecureP@ss123!", type: "secret", description: "Admin password", required: true }
    ],
    tags: {
      Environment: "Development",
      Project: "WebApp",
      Owner: "DevTeam"
    }
  },
  {
    environment: "uat",
    region: "East US",
    resourceGroupNaming: "rg-webapp-uat",
    parameters: [
      { key: "vmCount", value: "2", type: "number", description: "Number of VMs to deploy", required: true },
      { key: "vmSize", value: "Standard_B2s", type: "string", description: "VM size", required: true },
      { key: "enableBackup", value: "true", type: "boolean", description: "Enable VM backup", required: false },
      { key: "adminUsername", value: "azureuser", type: "string", description: "Admin username", required: true },
      { key: "adminPassword", value: "SecureP@ss123!", type: "secret", description: "Admin password", required: true }
    ],
    tags: {
      Environment: "UAT",
      Project: "WebApp",
      Owner: "QATeam"
    }
  },
  {
    environment: "prod",
    region: "East US",
    resourceGroupNaming: "rg-webapp-prod",
    parameters: [
      { key: "vmCount", value: "2", type: "number", description: "Number of VMs to deploy", required: true },
      { key: "vmSize", value: "Standard_D2s_v3", type: "string", description: "VM size", required: true },
      { key: "enableBackup", value: "true", type: "boolean", description: "Enable VM backup", required: false },
      { key: "adminUsername", value: "azureuser", type: "string", description: "Admin username", required: true },
      { key: "adminPassword", value: "SecureP@ss123!", type: "secret", description: "Admin password", required: true }
    ],
    tags: {
      Environment: "Production",
      Project: "WebApp",
      Owner: "OpsTeam",
      CostCenter: "IT-001"
    }
  }
];

const environmentColors = {
  dev: "bg-accent text-accent-foreground",
  uat: "bg-warning text-warning-foreground",
  prod: "bg-destructive text-destructive-foreground"
};

export function EnvironmentParameters() {
  const [configs, setConfigs] = useState<EnvironmentConfig[]>(mockConfigs);
  const [selectedEnv, setSelectedEnv] = useState<"dev" | "uat" | "prod">("dev");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const currentConfig = configs.find(c => c.environment === selectedEnv);

  const updateParameter = (key: string, value: string) => {
    setConfigs(prev => prev.map(config => 
      config.environment === selectedEnv 
        ? {
            ...config,
            parameters: config.parameters.map(param =>
              param.key === key ? { ...param, value } : param
            )
          }
        : config
    ));
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToEnvironment = (targetEnv: "dev" | "uat" | "prod") => {
    if (!currentConfig || targetEnv === selectedEnv) return;

    setConfigs(prev => prev.map(config =>
      config.environment === targetEnv
        ? { ...config, parameters: currentConfig.parameters }
        : config
    ));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Environment Parameters</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Copy Config
          </Button>
          <Button variant="tech" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      <Tabs value={selectedEnv} onValueChange={(value) => setSelectedEnv(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dev" className="relative">
            Development
            <Badge className={`ml-2 ${environmentColors.dev}`} variant="secondary">
              DEV
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="uat" className="relative">
            UAT
            <Badge className={`ml-2 ${environmentColors.uat}`} variant="secondary">
              UAT
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="prod" className="relative">
            Production
            <Badge className={`ml-2 ${environmentColors.prod}`} variant="secondary">
              PROD
            </Badge>
          </TabsTrigger>
        </TabsList>

        {currentConfig && (
          <TabsContent value={selectedEnv} className="space-y-6 mt-6">
            {/* Environment Settings */}
            <Card className="p-4">
              <h4 className="font-medium mb-4">Environment Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="region">Azure Region</Label>
                  <Select defaultValue={currentConfig.region}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="East US">East US</SelectItem>
                      <SelectItem value="West US 2">West US 2</SelectItem>
                      <SelectItem value="Central US">Central US</SelectItem>
                      <SelectItem value="UK South">UK South</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="naming">Resource Group Naming</Label>
                  <Input 
                    id="naming"
                    value={currentConfig.resourceGroupNaming}
                    placeholder="rg-webapp-{env}"
                  />
                </div>
              </div>
            </Card>

            {/* Infrastructure Parameters */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Infrastructure Parameters</h4>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToEnvironment("dev")}
                    disabled={selectedEnv === "dev"}
                  >
                    Copy to DEV
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToEnvironment("uat")}
                    disabled={selectedEnv === "uat"}
                  >
                    Copy to UAT
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToEnvironment("prod")}
                    disabled={selectedEnv === "prod"}
                  >
                    Copy to PROD
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {currentConfig.parameters.map((param) => (
                  <div key={param.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={param.key} className="flex items-center gap-2">
                        {param.key}
                        {param.required && <span className="text-destructive">*</span>}
                      </Label>
                      {param.type === "secret" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSecretVisibility(param.key)}
                        >
                          {showSecrets[param.key] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>

                    {param.description && (
                      <p className="text-xs text-muted-foreground">{param.description}</p>
                    )}

                    {param.type === "boolean" ? (
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id={param.key}
                          checked={param.value === "true"}
                          onCheckedChange={(checked) => 
                            updateParameter(param.key, checked.toString())
                          }
                        />
                        <Label htmlFor={param.key}>{param.value === "true" ? "Enabled" : "Disabled"}</Label>
                      </div>
                    ) : param.type === "secret" ? (
                      <Input
                        id={param.key}
                        type={showSecrets[param.key] ? "text" : "password"}
                        value={param.value}
                        onChange={(e) => updateParameter(param.key, e.target.value)}
                        className="font-mono"
                      />
                    ) : (
                      <Input
                        id={param.key}
                        type={param.type === "number" ? "number" : "text"}
                        value={param.value}
                        onChange={(e) => updateParameter(param.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Resource Tags */}
            <Card className="p-4">
              <h4 className="font-medium mb-4">Resource Tags</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(currentConfig.tags).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label>{key}</Label>
                    <Input value={value} placeholder="Tag value" />
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-4">
                Add Tag
              </Button>
            </Card>

            {/* Parameter Summary */}
            <Card className="p-4">
              <h4 className="font-medium mb-4">Configuration Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">VMs to Deploy:</span>
                    <span className="ml-2 font-medium">
                      {currentConfig.parameters.find(p => p.key === "vmCount")?.value}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">VM Size:</span>
                    <span className="ml-2 font-medium">
                      {currentConfig.parameters.find(p => p.key === "vmSize")?.value}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Backup Enabled:</span>
                    <span className="ml-2 font-medium">
                      {currentConfig.parameters.find(p => p.key === "enableBackup")?.value === "true" ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Region:</span>
                    <span className="ml-2 font-medium">{currentConfig.region}</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
}