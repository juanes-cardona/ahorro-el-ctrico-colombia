import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

const formSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es muy largo"),
  email: z.string().email("Correo electrónico inválido").max(255, "El correo es muy largo"),
  cedulaNit: z.string().min(5, "Ingresa un documento válido").max(20, "El documento es muy largo"),
  celular: z.string().min(10, "El celular debe tener al menos 10 dígitos").max(15, "El celular es muy largo"),
  ciudad: z.string().min(2, "Selecciona una ciudad"),
  tipoCliente: z.enum(["natural", "empresa"], { required_error: "Selecciona el tipo de cliente" }),
  ingresosMensuales: z.number().min(0, "Los ingresos deben ser positivos"),
  dependientes: z.number().min(0, "El número de dependientes no puede ser negativo").max(20),
  aportesFPV: z.number().min(0, "Los aportes no pueden ser negativos"),
  aportesAFC: z.number().min(0, "Los aportes no pueden ser negativos"),
  otrasDeducciones: z.number().min(0, "Las deducciones no pueden ser negativas"),
  valorVehiculo: z.number().min(1000000, "El valor del vehículo debe ser al menos $1,000,000").max(1000000000, "El valor es muy alto"),
});

type FormData = z.infer<typeof formSchema>;

interface CalculatorFormProps {
  onSubmit: (data: FormData) => void;
}

export const CalculatorForm = ({ onSubmit }: CalculatorFormProps) => {
  const [formData, setFormData] = useState<Partial<FormData>>({
    dependientes: 0,
    aportesFPV: 0,
    aportesAFC: 0,
    otrasDeducciones: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const ciudadesColombia = [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", 
    "Cúcuta", "Bucaramanga", "Pereira", "Ibagué", "Santa Marta", "Otra"
  ];

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
    <section id="calculator" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-medium">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl">Calculadora de Beneficios</CardTitle>
            <CardDescription className="text-lg">
              Completa tus datos para estimar tu posible ahorro tributario
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
                  <Label htmlFor="ingresosMensuales">Ingresos Mensuales (COP) *</Label>
                  <Input
                    id="ingresosMensuales"
                    type="number"
                    min="0"
                    value={formData.ingresosMensuales || ""}
                    onChange={(e) => updateField("ingresosMensuales", parseFloat(e.target.value) || 0)}
                    className={errors.ingresosMensuales ? "border-destructive" : ""}
                  />
                  {errors.ingresosMensuales && <p className="text-sm text-destructive mt-1">{errors.ingresosMensuales}</p>}
                </div>

                <div>
                  <Label htmlFor="dependientes">Número de Dependientes</Label>
                  <Input
                    id="dependientes"
                    type="number"
                    min="0"
                    value={formData.dependientes}
                    onChange={(e) => updateField("dependientes", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="aportesFPV">Aportes Mensuales a FPV (COP)</Label>
                  <Input
                    id="aportesFPV"
                    type="number"
                    min="0"
                    value={formData.aportesFPV}
                    onChange={(e) => updateField("aportesFPV", parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="aportesAFC">Aportes Mensuales a AFC (COP)</Label>
                  <Input
                    id="aportesAFC"
                    type="number"
                    min="0"
                    value={formData.aportesAFC}
                    onChange={(e) => updateField("aportesAFC", parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="otrasDeducciones">Otras Deducciones Anuales Aproximadas (COP)</Label>
                  <Input
                    id="otrasDeducciones"
                    type="number"
                    min="0"
                    value={formData.otrasDeducciones}
                    onChange={(e) => updateField("otrasDeducciones", parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ej: medicina prepagada, intereses de vivienda, etc.
                  </p>
                </div>
              </div>

              {/* Información del vehículo */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-foreground">Información del Vehículo</h3>
                
                <div>
                  <Label htmlFor="valorVehiculo">Valor Aproximado del Vehículo Eléctrico Sin IVA (COP) *</Label>
                  <Input
                    id="valorVehiculo"
                    type="number"
                    min="1000000"
                    value={formData.valorVehiculo || ""}
                    onChange={(e) => updateField("valorVehiculo", parseFloat(e.target.value) || 0)}
                    className={errors.valorVehiculo ? "border-destructive" : ""}
                  />
                  {errors.valorVehiculo && <p className="text-sm text-destructive mt-1">{errors.valorVehiculo}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    Ingresa el valor del vehículo antes de IVA
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Calcular Beneficio Tributario
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
