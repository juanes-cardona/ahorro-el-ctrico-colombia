'use client';

import { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calculator, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es muy largo"),
  email: z.string().email("Correo electrónico inválido").max(255, "El correo es muy largo"),
  cedulaNit: z.string().min(5, "Ingresa un documento válido").max(20, "El documento es muy largo"),
  celular: z.string().min(10, "El celular debe tener al menos 10 dígitos").max(15, "El celular es muy largo"),
  ciudad: z.string().min(2, "Selecciona una ciudad"),
  tipoCliente: z.enum(["natural", "empresa"], { required_error: "Selecciona el tipo de cliente" }),
  ingresosMensuales: z.number().min(0, "Los ingresos deben ser positivos"),
  otrasDeducciones: z.number().min(0, "Las deducciones no pueden ser negativas"),
  valorVehiculo: z.number().min(1000000, "El valor del vehículo debe ser al menos $1,000,000").max(1000000000, "El valor es muy alto"),
  deduccionVehiculoAplicada: z.number().min(0, "La deducción no puede ser negativa").optional(),
  calcularDeduccionOptima: z.boolean(),
});

export type FormData = z.infer<typeof formSchema>;

interface CalculatorFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export const CalculatorForm = ({ onSubmit, isLoading }: CalculatorFormProps) => {
  const [formData, setFormData] = useState<Partial<FormData>>({
    otrasDeducciones: 0,
    calcularDeduccionOptima: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const ciudadesColombia = [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", 
    "Cúcuta", "Bucaramanga", "Pereira", "Ibagué", "Santa Marta", "Otra"
  ];

  const formatInputAsCurrency = (value: number | undefined): string => {
    if (value === undefined || value === 0) return "";
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const parseFormattedNumber = (value: string): number => {
    const cleaned = value.replace(/\./g, "").replace(/,/g, "");
    return parseFloat(cleaned) || 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = formSchema.parse(formData);
      setErrors({});
      onSubmit(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <TooltipProvider>
      <section id="calculator" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <Card className="shadow-medium">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Calculadora de Beneficios Tributarios</CardTitle>
              <CardDescription className="text-lg">
                Calcula tu ahorro basado en rangos UVT y tasas marginales colombianas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Información Personal</h3>
                  
                  <div>
                    <Label htmlFor="nombre">Nombre Completo *</Label>
                    <Input
                      id="nombre"
                      type="text"
                      value={formData.nombre || ""}
                      onChange={(e) => updateField("nombre", e.target.value)}
                      className={errors.nombre ? "border-destructive" : ""}
                    />
                    {errors.nombre && <p className="text-sm text-destructive mt-1">{errors.nombre}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="cedulaNit">Cédula de Ciudadanía / NIT *</Label>
                    <Input
                      id="cedulaNit"
                      type="text"
                      value={formData.cedulaNit || ""}
                      onChange={(e) => updateField("cedulaNit", e.target.value)}
                      className={errors.cedulaNit ? "border-destructive" : ""}
                      placeholder="Ej: 1234567890"
                    />
                    {errors.cedulaNit && <p className="text-sm text-destructive mt-1">{errors.cedulaNit}</p>}
                  </div>

                  <div>
                    <Label htmlFor="celular">Celular *</Label>
                    <Input
                      id="celular"
                      type="tel"
                      value={formData.celular || ""}
                      onChange={(e) => updateField("celular", e.target.value)}
                      className={errors.celular ? "border-destructive" : ""}
                      placeholder="Ej: 3001234567"
                    />
                    {errors.celular && <p className="text-sm text-destructive mt-1">{errors.celular}</p>}
                  </div>

                  <div>
                    <Label htmlFor="ciudad">Ciudad *</Label>
                    <Select value={formData.ciudad} onValueChange={(value) => updateField("ciudad", value)}>
                      <SelectTrigger className={errors.ciudad ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecciona tu ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        {ciudadesColombia.map((ciudad) => (
                          <SelectItem key={ciudad} value={ciudad}>
                            {ciudad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.ciudad && <p className="text-sm text-destructive mt-1">{errors.ciudad}</p>}
                  </div>

                  <div>
                    <Label htmlFor="tipoCliente">Tipo de Cliente *</Label>
                    <Select value={formData.tipoCliente} onValueChange={(value) => updateField("tipoCliente", value)}>
                      <SelectTrigger className={errors.tipoCliente ? "border-destructive" : ""}>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">Persona Natural</SelectItem>
                        <SelectItem value="empresa">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.tipoCliente && <p className="text-sm text-destructive mt-1">{errors.tipoCliente}</p>}
                  </div>
                </div>

                {/* Información financiera */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-foreground">Información Financiera</h3>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="ingresosMensuales">Ingreso Mensual Neto (COP) *</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Ingreso después de deducciones de nómina (seguridad social, etc.)</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="ingresosMensuales"
                      type="text"
                      inputMode="numeric"
                      value={formatInputAsCurrency(formData.ingresosMensuales)}
                      onChange={(e) => updateField("ingresosMensuales", parseFormattedNumber(e.target.value))}
                      className={errors.ingresosMensuales ? "border-destructive" : ""}
                      placeholder="Ej: 10.000.000"
                    />
                    {errors.ingresosMensuales && <p className="text-sm text-destructive mt-1">{errors.ingresosMensuales}</p>}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="otrasDeducciones">Deducciones Anuales Actuales (sin vehículo) (COP)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Incluye: aportes FPV, AFC, medicina prepagada, intereses de vivienda, dependientes, etc.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="otrasDeducciones"
                      type="text"
                      inputMode="numeric"
                      value={formatInputAsCurrency(formData.otrasDeducciones)}
                      onChange={(e) => updateField("otrasDeducciones", parseFormattedNumber(e.target.value))}
                      className={errors.otrasDeducciones ? "border-destructive" : ""}
                      placeholder="Ej: 5.000.000"
                    />
                    {errors.otrasDeducciones && <p className="text-sm text-destructive mt-1">{errors.otrasDeducciones}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Total anual de deducciones que ya aplicas (FPV, AFC, medicina prepagada, etc.)
                    </p>
                  </div>
                </div>

                {/* Información del vehículo */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-foreground">Información del Vehículo Eléctrico</h3>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="valorVehiculo">Valor Deducible del Vehículo (COP) *</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Valor total que puede deducirse por el vehículo eléctrico. Puede distribuirse en varios años.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="valorVehiculo"
                      type="text"
                      inputMode="numeric"
                      value={formatInputAsCurrency(formData.valorVehiculo)}
                      onChange={(e) => updateField("valorVehiculo", parseFormattedNumber(e.target.value))}
                      className={errors.valorVehiculo ? "border-destructive" : ""}
                      placeholder="Ej: 150.000.000"
                    />
                    {errors.valorVehiculo && <p className="text-sm text-destructive mt-1">{errors.valorVehiculo}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Valor del vehículo sin IVA que puede ser deducido
                    </p>
                  </div>

                  {/* Toggle para deducción óptima */}
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex-1">
                      <Label htmlFor="calcularDeduccionOptima" className="font-medium">
                        Calcular Deducción Óptima Anual
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sugiere cuánto deducir este año para quedar tributando al 19% como máximo
                      </p>
                    </div>
                    <Switch
                      id="calcularDeduccionOptima"
                      checked={formData.calcularDeduccionOptima ?? true}
                      onCheckedChange={(checked) => updateField("calcularDeduccionOptima", checked)}
                    />
                  </div>

                  {/* Campo opcional para deducción específica */}
                  {!formData.calcularDeduccionOptima && (
                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="deduccionVehiculoAplicada">Deducción del Vehículo a Aplicar Este Año (COP)</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Si deseas simular un monto específico de deducción para este año</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="deduccionVehiculoAplicada"
                        type="text"
                        inputMode="numeric"
                        value={formatInputAsCurrency(formData.deduccionVehiculoAplicada)}
                        onChange={(e) => updateField("deduccionVehiculoAplicada", parseFormattedNumber(e.target.value))}
                        placeholder="Dejar vacío para usar el valor total"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Opcional: si no especificas, se usará el valor total del vehículo
                      </p>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Calculando..." : "Calcular Beneficio Tributario"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </TooltipProvider>
  );
};
