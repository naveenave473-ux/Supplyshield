export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type POStatus = 'on_track' | 'delayed' | 'critical' | 'received';

export type ReplenishmentStatus = 'in_transit' | 'delayed' | 'shortage' | 'healthy';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  status: POStatus;
  orderDate: string;
  expectedDeliveryDate: string;
  revisedDeliveryDate: string;
  riskScore: number; // 0 to 100
  deliveryProgress: number; // 0 to 100
  carrier: string;
  trackingNumber: string;
  delayReason?: string;
  destinationFacility: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  tier: 1 | 2 | 3;
  category: string;
  onTimeDeliveryRate: number; // percentage e.g. 88
  qualityScore: number; // percentage e.g. 96
  riskLevel: RiskLevel;
  leadTimeDays: number;
  activeOrdersCount: number;
  totalSpend: number;
  location: string;
  country: string;
  contactName: string;
  contactEmail: string;
  capacityUtilization: number; // percentage e.g. 84
  financialStabilityRating: string; // e.g. 'AAA', 'A-', 'BBB'
  supportedMaterials: string[];
  geopoliticalRisk: 'low' | 'medium' | 'high';
}

export interface MaterialRisk {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minRequiredStock: number;
  safetyStock: number;
  dailyBurnRate: number;
  daysOfCoverage: number;
  replenishmentStatus: ReplenishmentStatus;
  riskScore: number; // 0 to 100
  unitCost: number;
  leadTimeDays: number;
  primarySupplier: string;
  primarySupplierId: string;
  alternateSuppliersAvailable: number;
  impactedProductionLines: string[];
  lastAuditDate: string;
}

export interface Recommendation {
  id: string;
  title: string;
  targetMaterialSku: string;
  targetMaterialName: string;
  currentSupplier: string;
  recommendedSupplier: string;
  recommendedSupplierId: string;
  rationale: string[];
  impactScore: number; // 0 - 100
  costVariancePercent: number; // e.g. -2.5%
  leadTimeImprovementDays: number; // e.g. 6 days faster
  compatibilityScore: number; // percentage e.g. 98%
  capacityAvailable: string;
  status: 'active' | 'applied' | 'dismissed';
  confidence: number; // 0 - 100%
  potentialSavings: number;
  createdDate: string;
}

export interface CommunicationTemplate {
  id: string;
  title: string;
  category: 'expedite' | 'risk_warning' | 'audit_request' | 'allocation_check';
  subject: string;
  body: string;
}

export interface MessageLog {
  id: string;
  recipientSupplier: string;
  recipientEmail: string;
  subject: string;
  body: string;
  templateType: string;
  timestamp: string;
  status: 'sent' | 'draft';
}

export interface ImportHistoryItem {
  id: string;
  fileName: string;
  rowsProcessed: number;
  validRows: number;
  errorRows: number;
  status: 'success' | 'warning' | 'failed';
  importedAt: string;
  fileSize: string;
  source: string;
  errorSummary?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  read: boolean;
  linkTo?: string;
}
