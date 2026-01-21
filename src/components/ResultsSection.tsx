import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  TrendingUp, 
  FileText, 
  AlertCircle, 
  MessageCircle, 
  Calculator,
  ArrowRight,
  Lightbulb,
  AlertTriangle
} from "lucide-react";
import { 
  calculateTaxBenefit, 
  formatCOP, 
  formatUVT,
  UVT_VALUE,
  TaxCalculationResult 
} from "@/lib/taxCalculations";
import type { FormData } from "@/components/CalculatorForm";

interface ResultsSectionProps {
  formData: FormData;
}

export const ResultsSection = ({ formData }: ResultsSectionProps) => {
  // Calcular resultados usando el nuevo módulo
  const result: TaxCalculationResult = calculateTaxBenefit({
    monthlyNetIncome: formData.ingresosMensuales,
    otherDeductionsAnnual: formData.otrasDeducciones,
    vehicleDeductionTotal: formData.valorVehiculo,
    vehicleDeductionApplied: formData.deduccionVehiculoAplicada,
    calculateOptimalDeduction: formData.calcularDeduccionOptima,
  });

  const getBracketColor = (rate: number) => {
    if (rate === 0) return "text-green-600 bg-green-100";
    if (rate === 0.19) return "text-blue-600 bg-blue-100";
    if (rate === 0.28) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <section className="py-20 px-4 bg-gradient-card">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Resultados de tu Estimación</h2>
          <p className="text-muted-foreground text-lg">
            Basado en la tabla de renta colombiana (UVT {new Date().getFullYear()}: ${UVT_VALUE.toLocaleString('es-CO')})
          </p>
        </div>

        {/* Alertas */}
        {result.alerts.length > 0 && (
          <div className="space-y-3 mb-8">
            {result.alerts.map((alert, index) => (
              <Alert key={index} variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Resultado Principal - Ahorro */}
        <Card className="mb-8 shadow-medium border-2 border-primary/20">
          <CardContent className="pt-8 text-center">
            <p className="text-lg text-muted-foreground mb-2">Tu ahorro anual estimado en impuestos:</p>
            <p className="text-5xl md:text-6xl font-bold text-primary mb-4">
              {formatCOP(result.annualSavings)}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="bg-muted/50 rounded-lg px-4 py-2">
                <p className="text-sm text-muted-foreground">Ahorro por cada $1.000.000</p>
                <p className="text-xl font-semibold">{formatCOP(result.savingsPerMillionExact)}</p>
              </div>
              <div className={`rounded-lg px-4 py-2 ${getBracketColor(result.bracketWithoutVehicle.marginalRate)}`}>
                <p className="text-sm opacity-80">Tasa marginal actual</p>
                <p className="text-xl font-semibold">{result.bracketWithoutVehicle.bracketName}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Estimación basada en la tabla de renta - No constituye asesoría tributaria formal
            </p>
          </CardContent>
        </Card>

        {/* Deducción Óptima Recomendada */}
        {result.optimalDeduction && result.optimalDeduction.recommendedDeduction > 0 && (
          <Card className="mb-8 bg-primary/5 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lightbulb className="w-5 h-5" />
                Deducción Óptima Recomendada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Deducción recomendada este año</p>
                    <p className="text-2xl font-bold text-primary">{formatCOP(result.optimalDeduction.recommendedDeduction)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ahorro estimado con esta deducción</p>
                    <p className="text-xl font-semibold text-green-600">{formatCOP(result.optimalDeduction.estimatedSavings)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nuevo tramo estimado</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getBracketColor(result.optimalDeduction.newBracket.marginalRate)}`}>
                      {result.optimalDeduction.newBracket.bracketName}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo para años siguientes</p>
                    <p className="text-xl font-semibold">{formatCOP(result.optimalDeduction.remainingVehicleDeduction)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-foreground flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  {result.optimalDeduction.reason}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparación de Escenarios */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Sin Vehículo */}
          <Card className="border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <Calculator className="w-5 h-5" />
                Sin Deducción del Vehículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ingreso anual neto:</span>
                <span className="font-medium">{formatCOP(result.annualNetIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deducciones totales:</span>
                <span className="font-medium">{formatCOP(result.totalDeductionsWithoutVehicle)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Renta líquida:</span>
                <div className="text-right">
                  <span className="font-medium block">{formatCOP(result.rentaLiquidaWithoutVehicleCOP)}</span>
                  <span className="text-xs text-muted-foreground">{formatUVT(result.rentaLiquidaWithoutVehicleUVT)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tramo:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${getBracketColor(result.bracketWithoutVehicle.marginalRate)}`}>
                  {result.bracketWithoutVehicle.bracketName} ({result.bracketWithoutVehicle.uvtRange})
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Impuesto estimado:</span>
                <div className="text-right">
                  <span className="font-bold text-lg">{formatCOP(result.taxWithoutVehicleCOP)}</span>
                  <span className="text-xs text-muted-foreground block">{formatUVT(result.taxWithoutVehicleUVT)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Con Vehículo */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Calculator className="w-5 h-5" />
                Con Deducción del Vehículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ingreso anual neto:</span>
                <span className="font-medium">{formatCOP(result.annualNetIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deducciones totales:</span>
                <div className="text-right">
                  <span className="font-medium block">{formatCOP(result.totalDeductionsWithVehicle)}</span>
                  <span className="text-xs text-green-600">+{formatCOP(result.vehicleDeductionApplied)} vehículo</span>
                </div>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Renta líquida:</span>
                <div className="text-right">
                  <span className="font-medium block">{formatCOP(result.rentaLiquidaWithVehicleCOP)}</span>
                  <span className="text-xs text-muted-foreground">{formatUVT(result.rentaLiquidaWithVehicleUVT)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tramo:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${getBracketColor(result.bracketWithVehicle.marginalRate)}`}>
                  {result.bracketWithVehicle.bracketName} ({result.bracketWithVehicle.uvtRange})
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Impuesto estimado:</span>
                <div className="text-right">
                  <span className="font-bold text-lg text-primary">{formatCOP(result.taxWithVehicleCOP)}</span>
                  <span className="text-xs text-muted-foreground block">{formatUVT(result.taxWithVehicleUVT)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información de Límites */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Límites de Deducciones Aplicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Límite máximo permitido</p>
                <p className="text-lg font-semibold">{formatCOP(result.maxDeductionsLimitCOP)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.deductionsLimitReason === 'uvt' 
                    ? `Limitado por 1340 UVT (${formatUVT(result.maxDeductionsLimitUVT)})`
                    : `Limitado por 40% del ingreso neto anual`}
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Deducciones usadas (sin vehículo)</p>
                <p className="text-lg font-semibold">{formatCOP(result.totalDeductionsWithoutVehicle)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Espacio disponible: {formatCOP(Math.max(0, result.maxDeductionsLimitCOP - result.totalDeductionsWithoutVehicle))}
                </p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Deducción vehículo aplicada</p>
                <p className="text-lg font-semibold text-primary">{formatCOP(result.vehicleDeductionApplied)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Del total: {formatCOP(formData.valorVehiculo)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Rangos UVT */}
        <Card className="mb-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Tabla de Impuesto de Renta {new Date().getFullYear()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Rango UVT</th>
                    <th className="text-left py-2 px-3">Rango COP</th>
                    <th className="text-center py-2 px-3">Tasa</th>
                    <th className="text-left py-2 px-3">Fórmula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`border-b ${result.bracketWithoutVehicle.marginalRate === 0 ? 'bg-green-50' : ''}`}>
                    <td className="py-2 px-3">0 - 1090</td>
                    <td className="py-2 px-3">{formatCOP(0)} - {formatCOP(1090 * UVT_VALUE)}</td>
                    <td className="text-center py-2 px-3"><span className="px-2 py-0.5 rounded bg-green-100 text-green-700">0%</span></td>
                    <td className="py-2 px-3">$0</td>
                  </tr>
                  <tr className={`border-b ${result.bracketWithoutVehicle.marginalRate === 0.19 ? 'bg-blue-50' : ''}`}>
                    <td className="py-2 px-3">&gt;1090 - 1700</td>
                    <td className="py-2 px-3">&gt;{formatCOP(1090 * UVT_VALUE)} - {formatCOP(1700 * UVT_VALUE)}</td>
                    <td className="text-center py-2 px-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">19%</span></td>
                    <td className="py-2 px-3">(Renta UVT - 1090) × 19%</td>
                  </tr>
                  <tr className={`border-b ${result.bracketWithoutVehicle.marginalRate === 0.28 ? 'bg-orange-50' : ''}`}>
                    <td className="py-2 px-3">&gt;1700 - 4100</td>
                    <td className="py-2 px-3">&gt;{formatCOP(1700 * UVT_VALUE)} - {formatCOP(4100 * UVT_VALUE)}</td>
                    <td className="text-center py-2 px-3"><span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700">28%</span></td>
                    <td className="py-2 px-3">(Renta UVT - 1700) × 28% + 115.9 UVT</td>
                  </tr>
                  <tr className={`${result.bracketWithoutVehicle.marginalRate === 0.33 ? 'bg-red-50' : ''}`}>
                    <td className="py-2 px-3">&gt;4100</td>
                    <td className="py-2 px-3">&gt;{formatCOP(4100 * UVT_VALUE)}</td>
                    <td className="text-center py-2 px-3"><span className="px-2 py-0.5 rounded bg-red-100 text-red-700">33%</span></td>
                    <td className="py-2 px-3">(Renta UVT - 4100) × 33% + 787.9 UVT</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              UVT {new Date().getFullYear()}: ${UVT_VALUE.toLocaleString('es-CO')} COP
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-hero text-white border-0">
          <CardContent className="pt-8 text-center">
            <h3 className="text-2xl font-bold mb-4">¿Listo para dar el siguiente paso?</h3>
            <p className="text-lg mb-6 text-white/90">
              Habla con tu contador o asesor tributario para evaluar cómo estos beneficios 
              aplican específicamente a tu caso y maximiza tu ahorro.
            </p>
            
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mb-6"
              onClick={() => {
                const phoneNumber = "573001234567";
                const message = encodeURIComponent(
                  `Hola, me interesa conocer más sobre los beneficios tributarios de vehículos eléctricos. Mi estimación de ahorro fue de ${formatCOP(result.annualSavings)}.`
                );
                window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contáctanos por WhatsApp
            </Button>
            
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">La normatividad colombiana premia a quienes le apuestan a la movilidad sostenible</span>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Disclaimer:</strong> Esta herramienta es únicamente informativa y ofrece estimaciones aproximadas 
              basadas en la tabla de renta colombiana. No reemplaza la asesoría de un contador público o experto tributario 
              ni constituye recomendación fiscal. La normatividad puede cambiar y la aplicación de los beneficios depende 
              del perfil de cada contribuyente.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
