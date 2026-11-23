/**
 * 报销工作台配置：部门、分类、状态与示例数据
 */

export const DEPARTMENTS = [
  '维保',
  '改装',
  '洗美',
  '贴膜',
  '门店运维',
  '投放充值款',
  '福利费',
  '客户退款',
  '货运物流',
  '打车费',
  '停车费',
  '代驾费',
  '财务费用',
  '开思采购款',
  '上月开思采购款',
  '其他',
];

export const DEPT_CATEGORIES = {
  维保: ['配件', '耗材', '辅料', '药剂', '工具', '设备', '外包', '供应商结算', '备货产品', '其他'],
  改装: ['配件', '耗材', '辅料', '药剂', '工具', '设备', '外包', '供应商结算', '备货产品', '其他'],
  洗美: ['耗材', '药剂', '工具', '设备', '其他'],
  贴膜: ['耗材', '配件', '工具', '设备', '外包', '备货产品', '其他'],
  门店运维: ['能源费', '耗材', '工具', '设备', '物业费', '其他'],
  投放充值款: ['小红书投放充值款'],
  福利费: ['月租停车费', '员工餐饮费', '聚餐费'],
  客户退款: ['客户退款', '其他'],
  货运物流: ['货运物流', '其他'],
  打车费: ['打车费', '其他'],
  停车费: ['停车费', '其他'],
  代驾费: ['代驾费', '其他'],
  财务费用: ['财务费用', '其他'],
  开思采购款: ['开思采购款', '其他'],
  上月开思采购款: ['上月开思采购款', '其他'],
  其他: ['其他'],
};

export const STATUS_LIST = [
  { id: 'pending', label: '待报销', en: 'PENDING', hint: '进行中 · 荧光高亮', accent: '#d9ff43' },
  { id: 'reimbursed', label: '已报销', en: 'REIMBURSED', hint: '已完成', accent: '#d8b477' },
  { id: 'supplemented', label: '已补充附件', en: 'SUPPLEMENTED', hint: '附件已补充', accent: '#8fbbe8' },
];

export const STATUS_MAP = Object.fromEntries(STATUS_LIST.map((s) => [s.id, s]));

export const EMPLOYEE_NAMES = ['林晓', '陈默', '苏禾', '周野', '王海', '李敏', '周师傅', '陈师傅'];

export const ATTACHMENT_ACCEPT = '.png,.jpg,.jpeg,.webp,.gif,.bmp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv';

export function categoriesFor(department) {
  return DEPT_CATEGORIES[department] || ['其他'];
}

export function isHighValuePart(category, amount) {
  return category === '配件' && Number(amount) >= 3000;
}

export function highValueText(task) {
  if (!task.highValuePart) return '—';
  return `高额配件 · 跨月：${task.crossMonth ? '是' : '否'} · 备货成本：${task.stockingCost ? '是' : '否'}`;
}

/** 月度财务报表：图片中的业务单元列 */
export const BUSINESS_UNITS = [
  { key: 'maintenance', label: '维修、保养' },
  { key: 'bodyPaint', label: '钣喷' },
  { key: 'carWash', label: '洗车、美容' },
  { key: 'film', label: '贴膜' },
  { key: 'modification', label: '改装' },
  { key: 'storeOps', label: '门店运维' },
  { key: 'online', label: '线上运营' },
];

/** 月度财务报表：图片中的成本分类行（第 2—31 行） */
export const MONTHLY_COST_ROWS = [
  '财务费用',
  '后台管理费',
  '经营贷款利息',
  '物管物业费',
  '运费物流费',
  '停车费',
  '打车费',
  '代驾费',
  '配件',
  '耗材',
  '辅料',
  '药剂',
  '备货产品',
  '上月开思采购款',
  '本月开思采购款',
  '审车备案款',
  '工具',
  '设备',
  '装修费',
  '救援拖车费',
  '能源费（水电网气费）',
  '外包',
  '投放充值款',
  '业务招待费',
  '招聘费',
  '加班跑腿费',
  '福利费',
  '客户退款',
  '季度报税',
  '赔款',
];

const UNIT_BY_DEPT = {
  维保: 'maintenance',
  钣喷: 'bodyPaint',
  洗美: 'carWash',
  贴膜: 'film',
  改装: 'modification',
  门店运维: 'storeOps',
  投放充值款: 'online',
};

export function financialUnitFor(task) {
  return UNIT_BY_DEPT[task.department] || 'storeOps';
}

const CATEGORY_ROW = {
  配件: '配件',
  耗材: '耗材',
  辅料: '辅料',
  药剂: '药剂',
  备货产品: '备货产品',
  工具: '工具',
  设备: '设备',
  外包: '外包',
  供应商结算: '外包',
  月租停车费: '停车费',
  员工餐饮费: '福利费',
  聚餐费: '福利费',
  能源费: '能源费（水电网气费）',
  物业费: '物管物业费',
  小红书投放充值款: '投放充值款',
  货运物流: '运费物流费',
  打车费: '打车费',
  停车费: '停车费',
  代驾费: '代驾费',
  财务费用: '财务费用',
  开思采购款: '本月开思采购款',
  上月开思采购款: '上月开思采购款',
  客户退款: '客户退款',
  其他: '后台管理费',
};

const DEPT_ROW = {
  财务费用: '财务费用',
  货运物流: '运费物流费',
  打车费: '打车费',
  停车费: '停车费',
  代驾费: '代驾费',
  开思采购款: '本月开思采购款',
  上月开思采购款: '上月开思采购款',
  客户退款: '客户退款',
  投放充值款: '投放充值款',
  福利费: '福利费',
  其他: '后台管理费',
};

export function financialCostRowFor(task) {
  return CATEGORY_ROW[task.category] || DEPT_ROW[task.department] || '后台管理费';
}

export function mapCostToStatement(task) {
  return {
    unit: financialUnitFor(task),
    costRow: financialCostRowFor(task),
    amount: Number(task.amount) || 0,
  };
}


export function createSampleTasks() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const today = (time) => `${date}T${time}`;
  const stamp = now.toISOString();
  const tasks = [
    {
      id: 'GW-RB-SAMPLE-1',
      applicant: '王海',
      amount: 4680,
      department: '维保',
      category: '配件',
      appliedAt: today('09:20'),
      hasInvoice: false,
      content: '前保险杠总成、雾灯支架与水箱框架采购，供应商到货入库。',
      status: 'pending',
      highValuePart: true,
      crossMonth: true,
      stockingCost: false,
      attachments: [],
      collapsed: false,
      invoiceReceived: false,
      invoiceReceivedAt: null,
      order: 10,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 'GW-RB-SAMPLE-2',
      applicant: '李敏',
      amount: 860,
      department: '洗美',
      category: '耗材',
      appliedAt: today('10:05'),
      hasInvoice: true,
      content: '洗美耗材补充：预洗液、轮胎蜡、细节刷与超细纤维毛巾。',
      status: 'pending',
      highValuePart: false,
      crossMonth: null,
      stockingCost: null,
      attachments: [],
      collapsed: false,
      invoiceReceived: false,
      invoiceReceivedAt: null,
      order: 20,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 'GW-RB-SAMPLE-3',
      applicant: '陈默',
      amount: 2360,
      department: '改装',
      category: '设备',
      appliedAt: today('11:30'),
      hasInvoice: true,
      content: '四轮定位仪传感器维修与标定，已由供应商开票结算。',
      status: 'reimbursed',
      highValuePart: false,
      crossMonth: null,
      stockingCost: null,
      attachments: [],
      collapsed: false,
      invoiceReceived: false,
      invoiceReceivedAt: null,
      reimbursedAt: stamp,
      reimbursedFrom: 'pending',
      order: 30,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 'GW-RB-SAMPLE-4',
      applicant: '苏禾',
      amount: 1280,
      department: '福利费',
      category: '员工餐饮费',
      appliedAt: today('13:15'),
      hasInvoice: false,
      content: '门店员工周末加班餐费，票据已补充完毕，等待归档核查。',
      status: 'supplemented',
      highValuePart: false,
      crossMonth: null,
      stockingCost: null,
      attachments: [],
      collapsed: false,
      invoiceReceived: false,
      invoiceReceivedAt: null,
      order: 40,
      createdAt: stamp,
      updatedAt: stamp,
    },
  ];
  return tasks;
}
