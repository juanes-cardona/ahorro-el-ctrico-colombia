/**
 * Módulo de Cálculo Tributario Colombiano
 * Basado en rangos UVT y tasas marginales (19% / 28% / 33%)
 * 
 * NOTA: Los parámetros UVT_VALUE y límites se pueden actualizar fácilmente cada año.
 */

// ============================================
// PARÁMETROS CONFIGURABLES (actualizar cada año)
// ============================================

/** Valor de la Unidad de Valor Tributario para 2025 */
export const UVT_VALUE = 49799;

/** Límite máximo de deducciones en UVT */
export const MAX_DEDUCTIONS_UVT = 1340;

/** Límite máximo del 25% de renta exenta laboral en UVT */
export const MAX_25_PERCENT_EXEMPTION_UVT = 790;

/** Límite máximo de deducciones como porcentaje del ingreso neto anual */
export const MAX_DEDUCTIONS_RATE = 0.40;

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface TaxCalculationInput {
  /** Ingreso mensual neto (COP) */
  monthlyNetIncome: number;
  /** Deducciones anuales actuales sin vehículo (COP) */
  otherDeductionsAnnual: number;
  /** Valor total deducible del vehículo (COP) */
  vehicleDeductionTotal: number;
  /** Deducción del vehículo aplicada este año (COP) - opcional */
  vehicleDeductionApplied?: number;
  /** Calcular deducción óptima anual (sí/no) */
  calculateOptimalDeduction: boolean;
  /** Incluir el 25% de renta exenta laboral (por defecto: true) */
  include25PercentExemption?: boolean;
}

export interface TaxBracketInfo {
  /** Nombre del tramo: "0%", "19%", "28%", "33%" */
  bracketName: string;
  /** Tasa marginal como número: 0, 0.19, 0.28, 0.33 */
  marginalRate: number;
  /** Rango en UVT del tramo */
  uvtRange: string;
}

export interface TaxCalculationResult {
  // Datos de entrada procesados
  annualNetIncome: number;
  annualNetIncomeUVT: number;
  
  // Límites de deducciones
  maxDeductionsLimitCOP: number;
  maxDeductionsLimitUVT: number;
  deductionsLimitReason: 'uvt' | 'rate';
  
  // Escenario SIN vehículo
  totalDeductionsWithoutVehicle: number;
  exemption25PercentWithoutVehicle: number;
  totalDeductionsAndExemptionsWithoutVehicle: number;
  rentaLiquidaWithoutVehicleCOP: number;
  rentaLiquidaWithoutVehicleUVT: number;
  taxWithoutVehicleCOP: number;
  taxWithoutVehicleUVT: number;
  bracketWithoutVehicle: TaxBracketInfo;
  
  // Escenario CON vehículo
  vehicleDeductionApplied: number;
  totalDeductionsWithVehicle: number;
  exemption25PercentWithVehicle: number;
  totalDeductionsAndExemptionsWithVehicle: number;
  rentaLiquidaWithVehicleCOP: number;
  rentaLiquidaWithVehicleUVT: number;
  taxWithVehicleCOP: number;
  taxWithVehicleUVT: number;
  bracketWithVehicle: TaxBracketInfo;
  
  // Ahorro
  annualSavings: number;
  savingsPerMillion: number;
  savingsPerMillionExact: number;
  
  // Deducción óptima (si se solicitó)
  optimalDeduction: OptimalDeductionResult | null;
  
  // Alertas
  alerts: string[];
}

export interface OptimalDeductionResult {
  /** Deducción recomendada este año (COP) */
  recommendedDeduction: number;
  /** Nuevo tramo estimado después de aplicar */
  newBracket: TaxBracketInfo;
  /** Ahorro anual estimado con deducción recomendada */
  estimatedSavings: number;
  /** Saldo de deducción del vehículo para años siguientes */
  remainingVehicleDeduction: number;
  /** Razón de la recomendación */
  reason: string;
}

// ============================================
// FUNCIONES DE CÁLCULO
// ============================================

/**
 * Calcula el impuesto en UVT según la tabla de rangos
 */
export function calculateTaxUVT(rentaUVT: number): number {
  if (rentaUVT <= 0) return 0;
  
  if (rentaUVT <= 1090) {
    // Tramo 0%
    return 0;
  } else if (rentaUVT <= 1700) {
    // Tramo 19%
    return (rentaUVT - 1090) * 0.19;
  } else if (rentaUVT <= 4100) {
    // Tramo 28%
    return (rentaUVT - 1700) * 0.28 + 115.9; // (1700-1090)*0.19 = 115.9
  } else {
    // Tramo 33%
    return (rentaUVT - 4100) * 0.33 + 787.9; // 115.9 + (4100-1700)*0.28 = 787.9
  }
}

/**
 * Obtiene información del tramo tributario basado en renta líquida en UVT
 */
export function getTaxBracketInfo(rentaUVT: number): TaxBracketInfo {
  if (rentaUVT <= 1090) {
    return {
      bracketName: "0%",
      marginalRate: 0,
      uvtRange: "0 - 1090 UVT"
    };
  } else if (rentaUVT <= 1700) {
    return {
      bracketName: "19%",
      marginalRate: 0.19,
      uvtRange: "1090 - 1700 UVT"
    };
  } else if (rentaUVT <= 4100) {
    return {
      bracketName: "28%",
      marginalRate: 0.28,
      uvtRange: "1700 - 4100 UVT"
    };
  } else {
    return {
      bracketName: "33%",
      marginalRate: 0.33,
      uvtRange: "> 4100 UVT"
    };
  }
}

/**
 * Convierte COP a UVT
 */
export function copToUVT(cop: number): number {
  return cop / UVT_VALUE;
}

/**
 * Convierte UVT a COP
 */
export function uvtToCOP(uvt: number): number {
  return uvt * UVT_VALUE;
}

/**
 * Calcula el ahorro exacto por cada $1.000.000 adicional deducido
 * Toma en cuenta el cambio de tramos
 */
export function calculateSavingsPerMillion(rentaLiquidaCOP: number): number {
  const taxAtBase = calculateTaxUVT(copToUVT(rentaLiquidaCOP)) * UVT_VALUE;
  const taxAfterMillion = calculateTaxUVT(copToUVT(rentaLiquidaCOP - 1000000)) * UVT_VALUE;
  return Math.max(0, taxAtBase - taxAfterMillion);
}

/**
 * Calcula la deducción óptima para quedar en el tramo del 19% (max 1700 UVT)
 */
export function calculateOptimalDeduction(
  rentaLiquidaWithoutVehicleCOP: number,
  otherDeductionsAnnual: number,
  maxDeductionsLimitCOP: number,
  vehicleDeductionTotal: number
): OptimalDeductionResult {
  const targetRentaUVT = 1700;
  const targetRentaCOP = targetRentaUVT * UVT_VALUE;
  
  const rentaLiquidaWithoutVehicleUVT = copToUVT(rentaLiquidaWithoutVehicleCOP);
  
  // Si ya está en 19% o menos, no necesita deducción adicional
  if (rentaLiquidaWithoutVehicleUVT <= targetRentaUVT) {
    const isIn19Percent = rentaLiquidaWithoutVehicleUVT > 1090;
    return {
      recommendedDeduction: 0,
      newBracket: getTaxBracketInfo(rentaLiquidaWithoutVehicleUVT),
      estimatedSavings: 0,
      remainingVehicleDeduction: vehicleDeductionTotal,
      reason: isIn19Percent 
        ? "Ya estás en el tramo del 19%. Puedes deducir el vehículo para reducir más tu impuesto, pero el ahorro será al 19% o menos."
        : "Tu renta líquida está en el tramo exento (0%). No obtendrías beneficio tributario adicional al deducir."
    };
  }
  
  // Calcular cuánto se necesita deducir para llegar a 1700 UVT
  const requiredExtraDeduction = rentaLiquidaWithoutVehicleCOP - targetRentaCOP;
  
  // Espacio disponible para deducciones del vehículo
  const availableForVehicle = Math.max(0, maxDeductionsLimitCOP - otherDeductionsAnnual);
  
  // Deducción óptima: el mínimo entre lo necesario, lo disponible y el total del vehículo
  const optimalDeduction = Math.min(requiredExtraDeduction, availableForVehicle, vehicleDeductionTotal);
  
  // Calcular nueva renta y tramo
  const newRentaCOP = rentaLiquidaWithoutVehicleCOP - optimalDeduction;
  const newRentaUVT = copToUVT(newRentaCOP);
  const newBracket = getTaxBracketInfo(newRentaUVT);
  
  // Calcular ahorro
  const taxWithoutDeduction = calculateTaxUVT(rentaLiquidaWithoutVehicleUVT) * UVT_VALUE;
  const taxWithDeduction = calculateTaxUVT(newRentaUVT) * UVT_VALUE;
  const estimatedSavings = Math.max(0, taxWithoutDeduction - taxWithDeduction);
  
  // Determinar razón
  let reason = "";
  if (optimalDeduction >= requiredExtraDeduction) {
    reason = `Con esta deducción quedarás en el tramo del 19%, el más beneficioso antes del 28%.`;
  } else if (optimalDeduction >= vehicleDeductionTotal) {
    reason = `Se aplica el valor total deducible del vehículo. Quedarás en el tramo del ${newBracket.bracketName}.`;
  } else {
    reason = `Se aplica el máximo permitido por límites de deducciones (40% o 1340 UVT). Quedarás en el tramo del ${newBracket.bracketName}.`;
  }
  
  return {
    recommendedDeduction: optimalDeduction,
    newBracket,
    estimatedSavings,
    remainingVehicleDeduction: vehicleDeductionTotal - optimalDeduction,
    reason
  };
}

/**
 * Función principal de cálculo tributario
 */
export function calculateTaxBenefit(input: TaxCalculationInput): TaxCalculationResult {
  const alerts: string[] = [];
  const include25Percent = input.include25PercentExemption !== false; // Por defecto true
  
  // 1. Calcular ingreso neto anual
  const annualNetIncome = input.monthlyNetIncome * 12;
  const annualNetIncomeUVT = copToUVT(annualNetIncome);
  
  // 2. Calcular límite máximo de deducciones (40% o 1340 UVT)
  const limitByUVT = MAX_DEDUCTIONS_UVT * UVT_VALUE;
  const limitByRate = MAX_DEDUCTIONS_RATE * annualNetIncome;
  const maxDeductionsLimitCOP = Math.min(limitByUVT, limitByRate);
  const deductionsLimitReason: 'uvt' | 'rate' = limitByUVT <= limitByRate ? 'uvt' : 'rate';
  
  // 3. Validar deducciones actuales
  let otherDeductionsAnnual = input.otherDeductionsAnnual;
  if (otherDeductionsAnnual > maxDeductionsLimitCOP) {
    alerts.push(`Tus deducciones actuales (${formatCOP(otherDeductionsAnnual)}) superan el límite permitido. Se ajustarán al máximo de ${formatCOP(maxDeductionsLimitCOP)}.`);
    otherDeductionsAnnual = maxDeductionsLimitCOP;
  }
  
  // 4. Escenario SIN vehículo
  const totalDeductionsWithoutVehicle = otherDeductionsAnnual;
  
  // Calcular el 25% de renta exenta sobre el subtotal (ingreso - deducciones)
  // Límite máximo: 790 UVT
  const subtotalWithoutVehicle = Math.max(0, annualNetIncome - totalDeductionsWithoutVehicle);
  const max25PercentLimit = MAX_25_PERCENT_EXEMPTION_UVT * UVT_VALUE;
  const raw25PercentWithoutVehicle = include25Percent ? subtotalWithoutVehicle * 0.25 : 0;
  const exemption25PercentWithoutVehicle = Math.min(raw25PercentWithoutVehicle, max25PercentLimit);
  
  // Total deducciones + 25% exento, limitado al tope
  const totalDeductionsAndExemptionsWithoutVehicle = Math.min(
    totalDeductionsWithoutVehicle + exemption25PercentWithoutVehicle,
    maxDeductionsLimitCOP
  );
  
  const rentaLiquidaWithoutVehicleCOP = Math.max(0, annualNetIncome - totalDeductionsAndExemptionsWithoutVehicle);
  const rentaLiquidaWithoutVehicleUVT = copToUVT(rentaLiquidaWithoutVehicleCOP);
  const taxWithoutVehicleUVT = calculateTaxUVT(rentaLiquidaWithoutVehicleUVT);
  const taxWithoutVehicleCOP = taxWithoutVehicleUVT * UVT_VALUE;
  const bracketWithoutVehicle = getTaxBracketInfo(rentaLiquidaWithoutVehicleUVT);
  
  // 5. Calcular deducción óptima si se solicita
  let optimalDeduction: OptimalDeductionResult | null = null;
  let vehicleDeductionApplied = input.vehicleDeductionApplied ?? input.vehicleDeductionTotal;
  
  if (input.calculateOptimalDeduction) {
    optimalDeduction = calculateOptimalDeduction(
      rentaLiquidaWithoutVehicleCOP,
      totalDeductionsAndExemptionsWithoutVehicle,
      maxDeductionsLimitCOP,
      input.vehicleDeductionTotal
    );
    vehicleDeductionApplied = optimalDeduction.recommendedDeduction;
  }
  
  // 6. Limitar deducción del vehículo al espacio disponible
  const availableForVehicle = Math.max(0, maxDeductionsLimitCOP - totalDeductionsAndExemptionsWithoutVehicle);
  if (vehicleDeductionApplied > availableForVehicle) {
    alerts.push(`La deducción del vehículo se limita a ${formatCOP(availableForVehicle)} por el tope de deducciones.`);
    vehicleDeductionApplied = availableForVehicle;
  }
  
  if (vehicleDeductionApplied > input.vehicleDeductionTotal) {
    vehicleDeductionApplied = input.vehicleDeductionTotal;
  }
  
  // 7. Escenario CON vehículo
  const totalDeductionsWithVehicle = otherDeductionsAnnual + vehicleDeductionApplied;
  
  // Recalcular el 25% sobre el nuevo subtotal (con vehículo deducido)
  // Límite máximo: 790 UVT
  const subtotalWithVehicle = Math.max(0, annualNetIncome - totalDeductionsWithVehicle);
  const raw25PercentWithVehicle = include25Percent ? subtotalWithVehicle * 0.25 : 0;
  const exemption25PercentWithVehicle = Math.min(raw25PercentWithVehicle, max25PercentLimit);
  
  // Total deducciones + 25% exento, limitado al tope
  const totalDeductionsAndExemptionsWithVehicle = Math.min(
    totalDeductionsWithVehicle + exemption25PercentWithVehicle,
    maxDeductionsLimitCOP
  );
  
  const rentaLiquidaWithVehicleCOP = Math.max(0, annualNetIncome - totalDeductionsAndExemptionsWithVehicle);
  const rentaLiquidaWithVehicleUVT = copToUVT(rentaLiquidaWithVehicleCOP);
  const taxWithVehicleUVT = calculateTaxUVT(rentaLiquidaWithVehicleUVT);
  const taxWithVehicleCOP = taxWithVehicleUVT * UVT_VALUE;
  const bracketWithVehicle = getTaxBracketInfo(rentaLiquidaWithVehicleUVT);
  
  // 8. Calcular ahorro
  const annualSavings = Math.max(0, taxWithoutVehicleCOP - taxWithVehicleCOP);
  
  // 9. Calcular ahorro por millón (aproximación y exacto)
  const savingsPerMillion = bracketWithoutVehicle.marginalRate * 1000000;
  const savingsPerMillionExact = calculateSavingsPerMillion(rentaLiquidaWithoutVehicleCOP);
  
  // 10. Alertas adicionales
  if (availableForVehicle <= 0) {
    alerts.push("Tus deducciones actuales ya alcanzan el límite máximo. No podrás deducir el vehículo este año.");
  }
  
  if (bracketWithoutVehicle.marginalRate === 0) {
    alerts.push("Tu renta líquida actual está en el tramo exento (0%). El beneficio tributario por el vehículo sería mínimo o nulo.");
  }
  
  return {
    annualNetIncome,
    annualNetIncomeUVT,
    maxDeductionsLimitCOP,
    maxDeductionsLimitUVT: copToUVT(maxDeductionsLimitCOP),
    deductionsLimitReason,
    totalDeductionsWithoutVehicle,
    exemption25PercentWithoutVehicle,
    totalDeductionsAndExemptionsWithoutVehicle,
    rentaLiquidaWithoutVehicleCOP,
    rentaLiquidaWithoutVehicleUVT,
    taxWithoutVehicleCOP,
    taxWithoutVehicleUVT,
    bracketWithoutVehicle,
    vehicleDeductionApplied,
    totalDeductionsWithVehicle,
    exemption25PercentWithVehicle,
    totalDeductionsAndExemptionsWithVehicle,
    rentaLiquidaWithVehicleCOP,
    rentaLiquidaWithVehicleUVT,
    taxWithVehicleCOP,
    taxWithVehicleUVT,
    bracketWithVehicle,
    annualSavings,
    savingsPerMillion,
    savingsPerMillionExact,
    optimalDeduction,
    alerts
  };
}

// ============================================
// UTILIDADES DE FORMATEO
// ============================================

export function formatCOP(valor: number): string {
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    maximumFractionDigits: 0 
  }).format(valor);
}

export function formatUVT(valor: number): string {
  return new Intl.NumberFormat('es-CO', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(valor) + " UVT";
}

export function formatPercent(valor: number): string {
  return (valor * 100).toFixed(0) + "%";
}
