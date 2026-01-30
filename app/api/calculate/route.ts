import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateTaxBenefit, TaxCalculationResult } from '@/lib/taxCalculations';
import { appendCalculation } from '@/lib/googleSheets';

// Request body schema matching FormData from CalculatorForm
const requestSchema = z.object({
  nombre: z.string().min(2).max(100),
  email: z.string().email().max(255),
  cedulaNit: z.string().min(5).max(20),
  celular: z.string().min(10).max(15),
  ciudad: z.string().min(2),
  tipoCliente: z.enum(['natural', 'empresa']),
  ingresosMensuales: z.number().min(0),
  otrasDeducciones: z.number().min(0),
  valorVehiculo: z.number().min(1000000).max(1000000000),
  deduccionVehiculoAplicada: z.number().min(0).optional(),
  calcularDeduccionOptima: z.boolean(),
});

export type CalculateRequest = z.infer<typeof requestSchema>;

export interface CalculateResponse {
  success: boolean;
  result?: TaxCalculationResult;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<CalculateResponse>> {
  try {
    const body = await request.json();

    // Validate request body
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const formData = parsed.data;

    // Perform tax calculation
    const result = calculateTaxBenefit({
      monthlyNetIncome: formData.ingresosMensuales,
      otherDeductionsAnnual: formData.otrasDeducciones,
      vehicleDeductionTotal: formData.valorVehiculo,
      vehicleDeductionApplied: formData.deduccionVehiculoAplicada,
      calculateOptimalDeduction: formData.calcularDeduccionOptima,
    });

    // Fire-and-forget: save to Google Sheets (don't await)
    appendCalculation(formData, result).catch((err) => {
      console.error('Background Google Sheets append failed:', err);
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Calculate API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
