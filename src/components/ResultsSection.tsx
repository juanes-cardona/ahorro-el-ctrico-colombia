import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, FileText, AlertCircle } from "lucide-react";

interface FormData {
  nombre: string;
  email: string;
  ciudad: string;
  tipoCliente: "natural" | "empresa";
  ingresosMensuales: number;
  dependientes: number;
  aportesFPV: number;
  aportesAFC: number;
  otrasDeducciones: number;
  usoProductivo: "si" | "no";
  valorVehiculo: number;
}

interface ResultsSectionProps {
  formData: FormData;
}

const calcularBeneficio = (data: FormData): number => {
  const ingresosAnuales = data.ingresosMensuales * 12;
  const deduccionesActuales = (data.aportesFPV * 12) + (data.aportesAFC * 12) + data.otrasDeducciones;
  
  // Porcentaje base de beneficio sobre el valor del vehículo
  let porcentajeBeneficio = 0.15; // 15% base
  
  // Ajuste por nivel de ingresos (mayor ingreso, mayor capacidad de deducción)
  if (ingresosAnuales > 100000000) { // Más de 100M anuales
    porcentajeBeneficio += 0.05;
  } else if (ingresosAnuales > 50000000) { // Más de 50M anuales
    porcentajeBeneficio += 0.03;
  }
  
  // Ajuste por tipo de cliente
  if (data.tipoCliente === "empresa") {
    porcentajeBeneficio += 0.03; // Empresas tienen más opciones de deducción
  }
  
  // Ajuste por uso productivo
  if (data.usoProductivo === "si") {
    porcentajeBeneficio += 0.05; // Mayor beneficio si es para uso productivo
  }
  
  // Ajuste por deducciones actuales (si ya tiene deducciones, puede aprovechar más)
  if (deduccionesActuales > 10000000) {
    porcentajeBeneficio += 0.02;
  }
  
  // Beneficio base: porcentaje del valor del vehículo
  let beneficioEstimado = data.valorVehiculo * porcentajeBeneficio;
  
  // Adicional: ahorro en IVA (aproximadamente 5% del valor del vehículo)
  const ahorroIVA = data.valorVehiculo * 0.05;
  beneficioEstimado += ahorroIVA;
  
  // Limitar el beneficio al 30% del valor del vehículo como máximo
  const beneficioMaximo = data.valorVehiculo * 0.30;
  
  return Math.min(beneficioEstimado, beneficioMaximo);
};

export const ResultsSection = ({ formData }: ResultsSectionProps) => {
  const beneficioEstimado = calcularBeneficio(formData);
  const formatearCOP = (valor: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);

  return (
    <section className="py-20 px-4 bg-gradient-card">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Resultados de tu Estimación</h2>
          <p className="text-muted-foreground text-lg">
            Basado en la información proporcionada
          </p>
        </div>

        {/* Resultado Principal */}
        <Card className="mb-8 shadow-medium border-2 border-primary/20">
          <CardContent className="pt-8 text-center">
            <p className="text-lg text-muted-foreground mb-2">Tu posible ahorro anual en impuestos podría estar alrededor de:</p>
            <p className="text-5xl md:text-6xl font-bold text-primary mb-4">
              {formatearCOP(beneficioEstimado)}
            </p>
            <p className="text-sm text-muted-foreground">
              Estimación aproximada - No constituye asesoría tributaria formal
            </p>
          </CardContent>
        </Card>

        {/* Resumen de Datos */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Resumen de tu Información
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo de cliente:</span>
                <span className="font-medium">{formData.tipoCliente === "natural" ? "Persona Natural" : "Empresa"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ingresos anuales:</span>
                <span className="font-medium">{formatearCOP(formData.ingresosMensuales * 12)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor del vehículo:</span>
                <span className="font-medium">{formatearCOP(formData.valorVehiculo)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uso productivo:</span>
                <span className="font-medium">{formData.usoProductivo === "si" ? "Sí" : "No"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Componentes del Beneficio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Reducción de IVA</p>
                  <p className="text-sm text-muted-foreground">Tarifa preferencial en vehículos eléctricos</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Deducciones fiscales</p>
                  <p className="text-sm text-muted-foreground">Por inversión en energías limpias</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Beneficios locales</p>
                  <p className="text-sm text-muted-foreground">Reducción en impuesto vehicular (según ciudad)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información Educativa */}
        <Card className="mb-8 bg-primary/5">
          <CardHeader>
            <CardTitle>Beneficios de la Movilidad Eléctrica en Colombia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">
              En Colombia, la movilidad eléctrica se promueve activamente con diversos beneficios establecidos 
              en la normatividad vigente, incluyendo la Ley 1715 de 2014 y la Ley 2099 de 2021:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Deducciones en Impuesto de Renta</h4>
                  <p className="text-sm text-muted-foreground">
                    Posibles deducciones por inversiones en proyectos de energías limpias y eficiencia energética, 
                    lo que incluye vehículos eléctricos destinados a actividades productivas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Reducción de IVA</h4>
                  <p className="text-sm text-muted-foreground">
                    Tarifa preferencial de IVA del 5% en la compra de ciertos vehículos eléctricos, 
                    en comparación con el 19% aplicable a vehículos convencionales.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Aranceles Preferenciales</h4>
                  <p className="text-sm text-muted-foreground">
                    Exención o reducción de aranceles en la importación de vehículos eléctricos y sus componentes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Beneficios Municipales</h4>
                  <p className="text-sm text-muted-foreground">
                    Muchas ciudades colombianas ofrecen descuentos en el impuesto vehicular y otros beneficios 
                    locales para propietarios de vehículos eléctricos.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t mt-6">
              <p className="text-center text-lg font-medium text-foreground">
                💚 Invertir en un vehículo eléctrico no solo cuida el planeta, también puede cuidar tu bolsillo.
              </p>
            </div>
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
              <strong>Disclaimer:</strong> Esta herramienta es únicamente informativa y ofrece estimaciones aproximadas. 
              No reemplaza la asesoría de un contador público o experto tributario ni constituye recomendación fiscal. 
              La normatividad puede cambiar y la aplicación de los beneficios depende del perfil de cada contribuyente.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
