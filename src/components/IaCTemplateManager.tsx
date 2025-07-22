import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileCode, Download, Upload, Save, Play } from "lucide-react";

interface IaCTemplate {
  id: string;
  name: string;
  type: "arm" | "terraform" | "bicep";
  description: string;
  content: string;
  lastModified: string;
  version: string;
}

const mockTemplates: IaCTemplate[] = [
  {
    id: "1",
    name: "Web Server + Load Balancer",
    type: "arm",
    description: "ARM template for VM web servers with Azure Load Balancer",
    content: `{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmCount": {
      "type": "int",
      "defaultValue": 2,
      "metadata": {
        "description": "Number of VMs to deploy"
      }
    },
    "vmSize": {
      "type": "string",
      "defaultValue": "Standard_B2s",
      "metadata": {
        "description": "Size of the VM"
      }
    },
    "environment": {
      "type": "string",
      "allowedValues": ["dev", "uat", "prod"],
      "metadata": {
        "description": "Environment name"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Network/loadBalancers",
      "apiVersion": "2021-05-01",
      "name": "[concat('lb-', parameters('environment'))]",
      "location": "[resourceGroup().location]",
      "properties": {
        "frontendIPConfigurations": [
          {
            "name": "LoadBalancerFrontend",
            "properties": {
              "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses', concat('pip-lb-', parameters('environment')))]"
              }
            }
          }
        ],
        "backendAddressPools": [
          {
            "name": "BackendPool"
          }
        ],
        "loadBalancingRules": [
          {
            "name": "HTTPRule",
            "properties": {
              "frontendIPConfiguration": {
                "id": "[resourceId('Microsoft.Network/loadBalancers/frontendIPConfigurations', concat('lb-', parameters('environment')), 'LoadBalancerFrontend')]"
              },
              "backendAddressPool": {
                "id": "[resourceId('Microsoft.Network/loadBalancers/backendAddressPools', concat('lb-', parameters('environment')), 'BackendPool')]"
              },
              "protocol": "Tcp",
              "frontendPort": 80,
              "backendPort": 80
            }
          }
        ]
      }
    }
  ]
}`,
    lastModified: "2 hours ago",
    version: "v1.2.0"
  },
  {
    id: "2", 
    name: "Multi-Environment Infrastructure",
    type: "terraform",
    description: "Terraform configuration for scalable web infrastructure",
    content: `variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["dev", "uat", "prod"], var.environment)
    error_message = "Environment must be dev, uat, or prod."
  }
}

variable "vm_count" {
  description = "Number of VMs to deploy"
  type        = number
  default     = 2
}

variable "vm_size" {
  description = "VM size"
  type        = string
  default     = "Standard_B2s"
}

resource "azurerm_resource_group" "main" {
  name     = "rg-webapp-\${var.environment}"
  location = "East US"
  
  tags = {
    Environment = var.environment
    Project     = "WebApp"
  }
}

resource "azurerm_virtual_network" "main" {
  name                = "vnet-webapp-\${var.environment}"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "web" {
  name                 = "subnet-web"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_public_ip" "lb" {
  name                = "pip-lb-\${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                = "Standard"
}

resource "azurerm_lb" "main" {
  name                = "lb-webapp-\${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                = "Standard"

  frontend_ip_configuration {
    name                 = "LoadBalancerFrontend"
    public_ip_address_id = azurerm_public_ip.lb.id
  }
}`,
    lastModified: "1 day ago",
    version: "v2.1.0"
  }
];

export function IaCTemplateManager() {
  const [templates, setTemplates] = useState<IaCTemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0].id);
  const [editMode, setEditMode] = useState(false);

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  const templateTypeColors = {
    arm: "bg-primary text-primary-foreground",
    terraform: "bg-accent text-accent-foreground", 
    bicep: "bg-success text-success-foreground"
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileCode className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Infrastructure Templates</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="tech" size="sm" onClick={() => setEditMode(!editMode)}>
            <Save className="h-4 w-4 mr-2" />
            {editMode ? "Save" : "Edit"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template List */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Templates</h4>
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-sm">{template.name}</h5>
                  <Badge className={templateTypeColors[template.type]}>
                    {template.type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{template.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{template.version}</span>
                  <span>{template.lastModified}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-3">
          {currentTemplate && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{currentTemplate.name}</h4>
                  <p className="text-sm text-muted-foreground">{currentTemplate.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev">Development</SelectItem>
                      <SelectItem value="uat">UAT</SelectItem>
                      <SelectItem value="prod">Production</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="deploy" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Deploy
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="template" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="template">Template</TabsTrigger>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="validation">Validation</TabsTrigger>
                </TabsList>

                <TabsContent value="template">
                  <Textarea
                    value={currentTemplate.content}
                    readOnly={!editMode}
                    className="min-h-[500px] font-mono text-sm"
                    placeholder="IaC template content..."
                  />
                </TabsContent>

                <TabsContent value="parameters">
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h5 className="font-medium mb-3">Environment Parameters</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">VM Count</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="2" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">VM Size</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Standard_B2s" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Standard_B1s">Standard_B1s</SelectItem>
                              <SelectItem value="Standard_B2s">Standard_B2s</SelectItem>
                              <SelectItem value="Standard_D2s_v3">Standard_D2s_v3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="validation">
                  <Card className="p-4">
                    <h5 className="font-medium mb-3">Template Validation</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span>Syntax validation passed</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span>Resource dependencies validated</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-warning rounded-full"></div>
                        <span>Cost estimation: $45-60/month (UAT)</span>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}