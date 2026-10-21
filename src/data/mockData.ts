import { PurchaseOrder, Supplier, MaterialRisk, Recommendation, ImportHistoryItem, NotificationItem, CommunicationTemplate } from '../types';

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-98214',
    poNumber: 'PO-2026-98214',
    supplierId: 'SUP-001',
    supplierName: 'Kyoto Nano-Silicon Ltd',
    itemCode: 'MAT-3301',
    itemName: 'STM32 Microcontroller Unit 48MHz',
    category: 'Semiconductors',
    quantity: 12500,
    unit: 'pcs',
    unitPrice: 14.80,
    totalValue: 185000,
    status: 'critical',
    orderDate: '2026-09-12',
    expectedDeliveryDate: '2026-10-18',
    revisedDeliveryDate: '2026-11-04',
    riskScore: 89,
    deliveryProgress: 35,
    carrier: 'Nippon Cargo Air',
    trackingNumber: 'NCA-9921-8840',
    delayReason: 'Silicon ingot defect at Tier-2 foundry in Kumamoto',
    destinationFacility: 'Assembly Plant Alpha - Detroit, MI'
  },
  {
    id: 'PO-98203',
    poNumber: 'PO-2026-98203',
    supplierId: 'SUP-002',
    supplierName: 'Titan Aerospace Metallurgy',
    itemCode: 'MAT-1084',
    itemName: 'Ti-6Al-4V Grade 5 Titanium Billets',
    category: 'Raw Metals',
    quantity: 450,
    unit: 'kg',
    unitPrice: 220.00,
    totalValue: 99000,
    status: 'delayed',
    orderDate: '2026-09-28',
    expectedDeliveryDate: '2026-10-22',
    revisedDeliveryDate: '2026-10-29',
    riskScore: 68,
    deliveryProgress: 70,
    carrier: 'Maersk Line Intermodal',
    trackingNumber: 'MSKU-881903-2',
    delayReason: 'Port congestion at Rotterdam terminal gate 4',
    destinationFacility: 'Advanced Machining Center - Austin, TX'
  },
  {
    id: 'PO-98188',
    poNumber: 'PO-2026-98188',
    supplierId: 'SUP-003',
    supplierName: 'Precision Actuation Corp',
    itemCode: 'MAT-5542',
    itemName: 'Brushless DC Servo Actuator 24V',
    category: 'Electromechanical',
    quantity: 820,
    unit: 'units',
    unitPrice: 310.50,
    totalValue: 254610,
    status: 'on_track',
    orderDate: '2026-10-02',
    expectedDeliveryDate: '2026-10-28',
    revisedDeliveryDate: '2026-10-28',
    riskScore: 22,
    deliveryProgress: 85,
    carrier: 'FedEx Freight Priority',
    trackingNumber: 'FXF-102948-US',
    destinationFacility: 'Robotics Integration Hub - San Jose, CA'
  },
  {
    id: 'PO-98175',
    poNumber: 'PO-2026-98175',
    supplierId: 'SUP-004',
    supplierName: 'Rheinmetall Components GmbH',
    itemCode: 'MAT-7709',
    itemName: 'Hardened Armor Grade Ceramic Plate',
    category: 'Structural Composites',
    quantity: 3200,
    unit: 'sq.ft',
    unitPrice: 75.00,
    totalValue: 240000,
    status: 'on_track',
    orderDate: '2026-09-18',
    expectedDeliveryDate: '2026-10-25',
    revisedDeliveryDate: '2026-10-25',
    riskScore: 18,
    deliveryProgress: 90,
    carrier: 'DHL Global Forwarding',
    trackingNumber: 'DHL-DE-778210',
    destinationFacility: 'Defense Assembly Division - Huntsville, AL'
  },
  {
    id: 'PO-98150',
    poNumber: 'PO-2026-98150',
    supplierId: 'SUP-005',
    supplierName: 'Apex Microelectronics Inc',
    itemCode: 'MAT-2109',
    itemName: 'Multi-Layer Ceramic Capacitors 100uF',
    category: 'Passive Electronics',
    quantity: 50000,
    unit: 'pcs',
    unitPrice: 0.95,
    totalValue: 47500,
    status: 'delayed',
    orderDate: '2026-09-05',
    expectedDeliveryDate: '2026-10-15',
    revisedDeliveryDate: '2026-10-26',
    riskScore: 74,
    deliveryProgress: 60,
    carrier: 'Kuehne + Nagel Logistics',
    trackingNumber: 'KN-99210-AIR',
    delayReason: 'Customs clearance audit on dual-use compliance',
    destinationFacility: 'Assembly Plant Alpha - Detroit, MI'
  },
  {
    id: 'PO-98122',
    poNumber: 'PO-2026-98122',
    supplierId: 'SUP-006',
    supplierName: 'Vectron Dynamics Inc',
    itemCode: 'MAT-9180',
    itemName: 'Optical Transceiver Module 100G QSFP28',
    category: 'Photonics & Telecom',
    quantity: 1400,
    unit: 'units',
    unitPrice: 185.00,
    totalValue: 259000,
    status: 'critical',
    orderDate: '2026-08-30',
    expectedDeliveryDate: '2026-10-10',
    revisedDeliveryDate: '2026-11-12',
    riskScore: 92,
    deliveryProgress: 20,
    carrier: 'UPS Supply Chain Freight',
    trackingNumber: '1Z-992-881-A2',
    delayReason: 'Subcomponent laser diode assembly yield failure',
    destinationFacility: 'Telecom Systems Plant - Dallas, TX'
  },
  {
    id: 'PO-98099',
    poNumber: 'PO-2026-98099',
    supplierId: 'SUP-007',
    supplierName: 'Foxconn Advanced Components',
    itemCode: 'MAT-4412',
    itemName: 'CNC Anodized Aluminum Enclosure Chassis',
    category: 'Mechanical Hardware',
    quantity: 6500,
    unit: 'pcs',
    unitPrice: 28.50,
    totalValue: 185250,
    status: 'received',
    orderDate: '2026-09-01',
    expectedDeliveryDate: '2026-10-12',
    revisedDeliveryDate: '2026-10-12',
    riskScore: 8,
    deliveryProgress: 100,
    carrier: 'Expeditors Ocean',
    trackingNumber: 'EXP-882190-OC',
    destinationFacility: 'Assembly Plant Alpha - Detroit, MI'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Kyoto Nano-Silicon Ltd',
    code: 'KYOTO-JP',
    tier: 1,
    category: 'Semiconductors',
    onTimeDeliveryRate: 72.4,
    qualityScore: 94.2,
    riskLevel: 'critical',
    leadTimeDays: 45,
    activeOrdersCount: 4,
    totalSpend: 1420000,
    location: 'Kyoto Prefecture',
    country: 'Japan',
    contactName: 'Kenji Takahashi',
    contactEmail: 'k.takahashi@kyoto-nanosilicon.co.jp',
    capacityUtilization: 96.5,
    financialStabilityRating: 'A-',
    supportedMaterials: ['STM32 MCU', 'Power MOSFETs', 'GaN Switches'],
    geopoliticalRisk: 'medium'
  },
  {
    id: 'SUP-002',
    name: 'Titan Aerospace Metallurgy',
    code: 'TITAN-DE',
    tier: 1,
    category: 'Raw Metals',
    onTimeDeliveryRate: 81.0,
    qualityScore: 98.8,
    riskLevel: 'high',
    leadTimeDays: 28,
    activeOrdersCount: 3,
    totalSpend: 890000,
    location: 'Duisburg',
    country: 'Germany',
    contactName: 'Ingrid Schneider',
    contactEmail: 'i.schneider@titan-metallurgy.de',
    capacityUtilization: 88.0,
    financialStabilityRating: 'AA',
    supportedMaterials: ['Ti-6Al-4V Grade 5', 'Inconel 718', 'Hastelloy C-276'],
    geopoliticalRisk: 'low'
  },
  {
    id: 'SUP-003',
    name: 'Precision Actuation Corp',
    code: 'PREC-US',
    tier: 1,
    category: 'Electromechanical',
    onTimeDeliveryRate: 95.8,
    qualityScore: 99.1,
    riskLevel: 'low',
    leadTimeDays: 14,
    activeOrdersCount: 5,
    totalSpend: 1650000,
    location: 'Boulder, CO',
    country: 'United States',
    contactName: 'Marcus Vance',
    contactEmail: 'marcus.vance@precisionactuation.com',
    capacityUtilization: 74.0,
    financialStabilityRating: 'AAA',
    supportedMaterials: ['BLDC Actuators', 'Harmonic Drives', 'Optical Encoders'],
    geopoliticalRisk: 'low'
  },
  {
    id: 'SUP-004',
    name: 'Rheinmetall Components GmbH',
    code: 'RHEIN-DE',
    tier: 2,
    category: 'Structural Composites',
    onTimeDeliveryRate: 93.5,
    qualityScore: 97.4,
    riskLevel: 'low',
    leadTimeDays: 21,
    activeOrdersCount: 2,
    totalSpend: 740000,
    location: 'Düsseldorf',
    country: 'Germany',
    contactName: 'Dieter Koch',
    contactEmail: 'd.koch@rheinmetall-components.com',
    capacityUtilization: 82.0,
    financialStabilityRating: 'AAA',
    supportedMaterials: ['Ceramic Armor', 'Boron Carbide Plates', 'Carbon Prepreg'],
    geopoliticalRisk: 'low'
  },
  {
    id: 'SUP-005',
    name: 'Apex Microelectronics Inc',
    code: 'APEX-TW',
    tier: 2,
    category: 'Passive Electronics',
    onTimeDeliveryRate: 79.2,
    qualityScore: 91.0,
    riskLevel: 'medium',
    leadTimeDays: 32,
    activeOrdersCount: 6,
    totalSpend: 580000,
    location: 'Hsinchu Science Park',
    country: 'Taiwan',
    contactName: 'Chen Wei-Lun',
    contactEmail: 'wl.chen@apex-microelectronics.tw',
    capacityUtilization: 92.0,
    financialStabilityRating: 'BBB+',
    supportedMaterials: ['MLCC Capacitors', 'Chip Inductors', 'Ferrite Beads'],
    geopoliticalRisk: 'high'
  },
  {
    id: 'SUP-006',
    name: 'Vectron Dynamics Inc',
    code: 'VECT-SG',
    tier: 1,
    category: 'Photonics & Telecom',
    onTimeDeliveryRate: 64.0,
    qualityScore: 89.5,
    riskLevel: 'critical',
    leadTimeDays: 52,
    activeOrdersCount: 3,
    totalSpend: 1120000,
    location: 'Jurong East',
    country: 'Singapore',
    contactName: 'Rachel Tan',
    contactEmail: 'rachel.tan@vectrondynamics.sg',
    capacityUtilization: 98.2,
    financialStabilityRating: 'BBB',
    supportedMaterials: ['100G Transceivers', 'DFB Laser Diodes', 'Optical Splitters'],
    geopoliticalRisk: 'low'
  },
  {
    id: 'SUP-007',
    name: 'Foxconn Advanced Components',
    code: 'FOX-CN',
    tier: 2,
    category: 'Mechanical Hardware',
    onTimeDeliveryRate: 96.2,
    qualityScore: 96.8,
    riskLevel: 'low',
    leadTimeDays: 18,
    activeOrdersCount: 4,
    totalSpend: 1950000,
    location: 'Shenzhen',
    country: 'China',
    contactName: 'Li Ming',
    contactEmail: 'li.ming@foxconn-adv.com',
    capacityUtilization: 78.5,
    financialStabilityRating: 'AA',
    supportedMaterials: ['CNC Chassis', 'Stamped Sheetmetal', 'Die-Cast Zinc'],
    geopoliticalRisk: 'medium'
  }
];

export const mockMaterialRisks: MaterialRisk[] = [
  {
    id: 'MAT-3301',
    sku: 'MCU-STM32-H743',
    name: 'STM32 Microcontroller Unit 48MHz',
    category: 'Semiconductors',
    currentStock: 1420,
    unit: 'pcs',
    minRequiredStock: 4000,
    safetyStock: 2500,
    dailyBurnRate: 310,
    daysOfCoverage: 4.6,
    replenishmentStatus: 'shortage',
    riskScore: 94,
    unitCost: 14.80,
    leadTimeDays: 45,
    primarySupplier: 'Kyoto Nano-Silicon Ltd',
    primarySupplierId: 'SUP-001',
    alternateSuppliersAvailable: 2,
    impactedProductionLines: ['Line 1 (Robotics Core)', 'Line 4 (Automotive ECU)'],
    lastAuditDate: '2026-10-16'
  },
  {
    id: 'MAT-9180',
    sku: 'OPT-QSFP28-100G',
    name: 'Optical Transceiver Module 100G QSFP28',
    category: 'Photonics & Telecom',
    currentStock: 180,
    unit: 'units',
    minRequiredStock: 600,
    safetyStock: 350,
    dailyBurnRate: 32,
    daysOfCoverage: 5.6,
    replenishmentStatus: 'delayed',
    riskScore: 91,
    unitCost: 185.00,
    leadTimeDays: 52,
    primarySupplier: 'Vectron Dynamics Inc',
    primarySupplierId: 'SUP-006',
    alternateSuppliersAvailable: 1,
    impactedProductionLines: ['Line 2 (Telecom Backbone Rack)'],
    lastAuditDate: '2026-10-18'
  },
  {
    id: 'MAT-2109',
    sku: 'CAP-MLCC-100UF-0805',
    name: 'Multi-Layer Ceramic Capacitors 100uF',
    category: 'Passive Electronics',
    currentStock: 18400,
    unit: 'pcs',
    minRequiredStock: 35000,
    safetyStock: 20000,
    dailyBurnRate: 1950,
    daysOfCoverage: 9.4,
    replenishmentStatus: 'delayed',
    riskScore: 78,
    unitCost: 0.95,
    leadTimeDays: 32,
    primarySupplier: 'Apex Microelectronics Inc',
    primarySupplierId: 'SUP-005',
    alternateSuppliersAvailable: 3,
    impactedProductionLines: ['Line 1', 'Line 3', 'Line 4'],
    lastAuditDate: '2026-10-15'
  },
  {
    id: 'MAT-1084',
    sku: 'TI-BILLET-GR5-450',
    name: 'Ti-6Al-4V Grade 5 Titanium Billets',
    category: 'Raw Metals',
    currentStock: 160,
    unit: 'kg',
    minRequiredStock: 300,
    safetyStock: 150,
    dailyBurnRate: 14,
    daysOfCoverage: 11.4,
    replenishmentStatus: 'in_transit',
    riskScore: 62,
    unitCost: 220.00,
    leadTimeDays: 28,
    primarySupplier: 'Titan Aerospace Metallurgy',
    primarySupplierId: 'SUP-002',
    alternateSuppliersAvailable: 2,
    impactedProductionLines: ['Precision CNC Cell 2'],
    lastAuditDate: '2026-10-19'
  },
  {
    id: 'MAT-5542',
    sku: 'ACT-BLDC-24V-HD',
    name: 'Brushless DC Servo Actuator 24V',
    category: 'Electromechanical',
    currentStock: 940,
    unit: 'units',
    minRequiredStock: 500,
    safetyStock: 300,
    dailyBurnRate: 28,
    daysOfCoverage: 33.5,
    replenishmentStatus: 'healthy',
    riskScore: 19,
    unitCost: 310.50,
    leadTimeDays: 14,
    primarySupplier: 'Precision Actuation Corp',
    primarySupplierId: 'SUP-003',
    alternateSuppliersAvailable: 3,
    impactedProductionLines: ['Line 1 (Robotics Core)'],
    lastAuditDate: '2026-10-17'
  },
  {
    id: 'MAT-7709',
    sku: 'CER-ARMOR-B4C-12',
    name: 'Hardened Armor Grade Ceramic Plate',
    category: 'Structural Composites',
    currentStock: 4800,
    unit: 'sq.ft',
    minRequiredStock: 2500,
    safetyStock: 1500,
    dailyBurnRate: 115,
    daysOfCoverage: 41.7,
    replenishmentStatus: 'healthy',
    riskScore: 14,
    unitCost: 75.00,
    leadTimeDays: 21,
    primarySupplier: 'Rheinmetall Components GmbH',
    primarySupplierId: 'SUP-004',
    alternateSuppliersAvailable: 1,
    impactedProductionLines: ['Defense Assembly Cell 3'],
    lastAuditDate: '2026-10-14'
  }
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'REC-001',
    title: 'Switch Secondary Sourcing for STM32 MCU to Alps Semiconductor',
    targetMaterialSku: 'MCU-STM32-H743',
    targetMaterialName: 'STM32 Microcontroller Unit 48MHz',
    currentSupplier: 'Kyoto Nano-Silicon Ltd (96% utilized, 17-day delay)',
    recommendedSupplier: 'Alps Alpine Semi (Sendai, JP)',
    recommendedSupplierId: 'SUP-ALT-01',
    rationale: [
      'Kyoto Nano-Silicon is experiencing Tier-2 ingot yields issues extending lead time by 17 days.',
      'Alps Alpine holds 14,000 pre-certified units ready in Osaka warehouse with 98.4% spec compatibility.',
      'Lead time reduction from 45 days down to 6 days via direct domestic transit.',
      'Unit price variance is +$0.40/unit (+2.7%), mitigating a shutdown risk valued at $340,000.'
    ],
    impactScore: 96,
    costVariancePercent: 2.7,
    leadTimeImprovementDays: 39,
    compatibilityScore: 98.4,
    capacityAvailable: '14,000 units on standby',
    status: 'active',
    confidence: 94,
    potentialSavings: 312000,
    createdDate: '2026-10-19'
  },
  {
    id: 'REC-002',
    title: 'Route Optical Transceiver Demand to Lumentum Advanced Optical',
    targetMaterialSku: 'OPT-QSFP28-100G',
    targetMaterialName: 'Optical Transceiver Module 100G QSFP28',
    currentSupplier: 'Vectron Dynamics Inc (Subcomponent failure)',
    recommendedSupplier: 'Lumentum Commercial Ops (San Jose, CA)',
    recommendedSupplierId: 'SUP-ALT-02',
    rationale: [
      'Vectron Dynamics is stalled with 33-day delivery slippage.',
      'Lumentum has passed military & industrial thermal cycling certification.',
      'Enables domestic air freight bypassing Pacific shipping bottleneck.',
      'Delivers -4.2% unit price benefit through pre-negotiated tier volume pricing.'
    ],
    impactScore: 92,
    costVariancePercent: -4.2,
    leadTimeImprovementDays: 24,
    compatibilityScore: 100.0,
    capacityAvailable: '2,500 units/month',
    status: 'active',
    confidence: 91,
    potentialSavings: 145000,
    createdDate: '2026-10-18'
  },
  {
    id: 'REC-003',
    title: 'Consolidate MLCC Capacitor Batch with TDK Electronics North America',
    targetMaterialSku: 'CAP-MLCC-100UF-0805',
    targetMaterialName: 'Multi-Layer Ceramic Capacitors 100uF',
    currentSupplier: 'Apex Microelectronics Inc (Customs audit hold)',
    recommendedSupplier: 'TDK Electronics NA (Greensboro, NC)',
    recommendedSupplierId: 'SUP-ALT-03',
    rationale: [
      'Avoids 11-day customs audit hold on cross-strait shipments.',
      'Fully qualified alternate on ERP approved manufacturer list (AML #7701).',
      'Guarantees 12-day inventory coverage buffer during Q4 peak ramp.'
    ],
    impactScore: 84,
    costVariancePercent: -1.5,
    leadTimeImprovementDays: 14,
    compatibilityScore: 99.2,
    capacityAvailable: '120,000 pcs in regional DC',
    status: 'active',
    confidence: 88,
    potentialSavings: 58000,
    createdDate: '2026-10-17'
  }
];

export const mockImportHistory: ImportHistoryItem[] = [
  {
    id: 'IMP-2026-1082',
    fileName: 'SAP_S4HANA_PO_EXTRACT_20261019.csv',
    rowsProcessed: 1420,
    validRows: 1412,
    errorRows: 8,
    status: 'warning',
    importedAt: '2026-10-19 18:34:10',
    fileSize: '412 KB',
    source: 'SAP S/4HANA ERP Connector',
    errorSummary: '8 rows skipped due to missing carrier tracking codes in line items'
  },
  {
    id: 'IMP-2026-1077',
    fileName: 'ORACLE_NETSUITE_INVENTORY_SNAPSHOT.csv',
    rowsProcessed: 3840,
    validRows: 3840,
    errorRows: 0,
    status: 'success',
    importedAt: '2026-10-17 09:12:44',
    fileSize: '1.2 MB',
    source: 'Oracle NetSuite API',
  },
  {
    id: 'IMP-2026-1065',
    fileName: 'SUPPLIER_SCORECARD_Q3_REVISED.xlsx',
    rowsProcessed: 48,
    validRows: 48,
    errorRows: 0,
    status: 'success',
    importedAt: '2026-10-12 14:05:12',
    fileSize: '94 KB',
    source: 'Direct Upload',
  },
  {
    id: 'IMP-2026-1051',
    fileName: 'BOM_ROBOTICS_ALPHA_V3_RAW.csv',
    rowsProcessed: 620,
    validRows: 588,
    errorRows: 32,
    status: 'warning',
    importedAt: '2026-10-08 11:22:01',
    fileSize: '188 KB',
    source: 'Siemens Teamcenter PLM',
    errorSummary: '32 items flagged with obsolete revision tags'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: 'Severe Delay: STM32 Microcontrollers',
    description: 'PO-2026-98214 delayed by 17 days. Plant Alpha production at risk in 4.6 days.',
    timestamp: '14 minutes ago',
    type: 'critical',
    read: false,
    linkTo: '/purchase-orders'
  },
  {
    id: 'NOTIF-02',
    title: 'AI Mitigation Plan Generated',
    description: 'High confidence recommendation available for MAT-3301 with Alps Alpine.',
    timestamp: '42 minutes ago',
    type: 'warning',
    read: false,
    linkTo: '/recommendations'
  },
  {
    id: 'NOTIF-03',
    title: 'Port Clearance Delay: Rotterdam',
    description: 'PO-2026-98203 Titanium Billets updated with revised delivery Oct 29.',
    timestamp: '2 hours ago',
    type: 'warning',
    read: true,
    linkTo: '/purchase-orders'
  },
  {
    id: 'NOTIF-04',
    title: 'Inventory Audit Completed',
    description: '3,840 materials synchronized with Oracle NetSuite without variances.',
    timestamp: '1 day ago',
    type: 'success',
    read: true,
    linkTo: '/inventory-risks'
  }
];

export const mockCommunicationTemplates: CommunicationTemplate[] = [
  {
    id: 'TMPL-01',
    title: 'Expedite Critical Delivery Request',
    category: 'expedite',
    subject: 'URGENT: Expedite Delivery Request for {PO_NUMBER} - {ITEM_NAME}',
    body: `Dear {SUPPLIER_CONTACT},

We are contacting you regarding Purchase Order {PO_NUMBER} for {ITEM_NAME} (Quantity: {QUANTITY} {UNIT}), currently scheduled for delivery on {EXPECTED_DATE}.

Our automated intelligence system indicates potential delay factors with this shipment. This material directly feeds our active production line at {DESTINATION_FACILITY}, where factory safety stock will deplete in {DAYS_COVERAGE} days.

Please provide urgent confirmation on:
1. Current dispatch milestone and confirmed carrier tracking details.
2. Feasibility of expediting via priority air freight (we are prepared to discuss express freight allowances).3. Earliest guaranteed dock date at our facility.

Given the critical production impact, we request your response within 4 business hours.

Best regards,
Procurement Risk Operations
SupplyShield Command Center`
  },
  {
    id: 'TMPL-02',
    title: 'Supply Chain Risk Warning & Contingency Notice',
    category: 'risk_warning',
    subject: 'Supply Disruption Notice & Sourcing Contingency - {ITEM_NAME}',
    body: `Dear {SUPPLIER_CONTACT},

As part of SupplyShield's continuous supplier risk monitoring, we have flagged critical delivery variance on {PO_NUMBER}.

Your reported revised delivery date of {REVISED_DATE} exceeds our contracted tolerance threshold and creates an estimated production exposure of {TOTAL_VALUE}.

Please be advised that we are evaluating qualified secondary suppliers on our Approved Vendor List (AVL) to split allocation unless immediate recovery milestones can be verified by 17:00 EST today.

Please confirm your recovery schedule immediately.

Sincerely,
Global Strategic Sourcing Group`
  },
  {
    id: 'TMPL-03',
    title: 'Tier-2 Production Capacity Audit Request',
    category: 'audit_request',
    subject: 'Capacity Utilization & Raw Material Buffer Verification: {SUPPLIER_NAME}',
    body: `Dear {SUPPLIER_CONTACT},

To ensure continuity of our mutual supply agreements for Q4/Q1, SupplyShield requires an updated capacity verification for {SUPPLIER_NAME}.

Please provide:
1. Current factory utilization rate at your primary manufacturing facility.
2. Safety stock levels for precursor subcomponents and raw ingots.
3. Any regional geopolitical or logistics bottlenecks impacting lead times over 30 days.

Thank you for your partnership in maintaining transparent supply resilience.

Best regards,
Supplier Quality & Assurance Team`
  },
  {
    id: 'TMPL-04',
    title: 'Material Allocation & Spot-Buy Sourcing Inquiry',
    category: 'allocation_check',
    subject: 'Immediate Availability & Spot Allocation Inquiry: {ITEM_NAME}',
    body: `Dear Sales Operations Team,

SupplyShield is evaluating immediate spot capacity for {ITEM_NAME} (Target Specification SKU: {SKU}).

We have an immediate demand requirement for {QUANTITY} {UNIT} with preferred delivery within 10 business days to our facility.

Please confirm:
1. Available spot inventory in your regional distribution centers.
2. Quoted spot unit price for immediate purchase order release.
3. Certificate of Conformance (CoC) and lead-time guarantee.

We look forward to your prompt response.

Regards,
Strategic Procurement Lead`
  }
];

// Chart datasets
export const deliveryPerformanceChartData = [
  { month: 'May', onTime: 94, delayed: 6, target: 95 },
  { month: 'Jun', onTime: 91, delayed: 9, target: 95 },
  { month: 'Jul', onTime: 87, delayed: 13, target: 95 },
  { month: 'Aug', onTime: 82, delayed: 18, target: 95 },
  { month: 'Sep', onTime: 78, delayed: 22, target: 95 },
  { month: 'Oct (Current)', onTime: 73, delayed: 27, target: 95 }
];

export const supplierRiskDistributionData = [
  { name: 'Low Risk (Tier 1)', value: 42, color: '#0FD3F2' }, // Neon Cyan
  { name: 'Medium Risk', value: 28, color: '#007CB8' },       // Ocean Cerulean
  { name: 'High Risk', value: 18, color: '#4C128A' },         // Royal Violet
  { name: 'Critical Risk', value: 12, color: '#921CC0' }      // Electric Violet
];

export const inventoryCoverageDemandData = [
  { day: 'Day 1', currentStock: 4800, projectedDemand: 3200, safetyThreshold: 2500 },
  { day: 'Day 5', currentStock: 4100, projectedDemand: 3500, safetyThreshold: 2500 },
  { day: 'Day 10', currentStock: 3300, projectedDemand: 3900, safetyThreshold: 2500 },
  { day: 'Day 15', currentStock: 2400, projectedDemand: 4300, safetyThreshold: 2500 },
  { day: 'Day 20', currentStock: 1700, projectedDemand: 4800, safetyThreshold: 2500 },
  { day: 'Day 25', currentStock: 950, projectedDemand: 5200, safetyThreshold: 2500 },
  { day: 'Day 30', currentStock: 350, projectedDemand: 5800, safetyThreshold: 2500 }
];

export const shortageExposureTrendData = [
  { week: 'W38', exposureValue: 185000, atRiskItems: 4 },
  { week: 'W39', exposureValue: 240000, atRiskItems: 6 },
  { week: 'W40', exposureValue: 310000, atRiskItems: 8 },
  { week: 'W41', exposureValue: 490000, atRiskItems: 11 },
  { week: 'W42 (Current)', exposureValue: 647500, atRiskItems: 14 }
];
