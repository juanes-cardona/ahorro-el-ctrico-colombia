import { useState, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { CalculatorForm, FormData } from "@/components/CalculatorForm";
import { ResultsSection } from "@/components/ResultsSection";
import { useToast } from "@/hooks/use-toast";
import { TaxCalculationResult, calculateTaxBenefit } from "@/lib/taxCalculations";

export default function Index() {
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const calculatorRef = useRef<HTMLDivElement>(null);

  const handleCalculateClick = () => {
    calculatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    setFormData(data);

    try {
      // Calculate directly in the browser
      const calculationResult = calculateTaxBenefit({
        monthlyNetIncome: data.ingresosMensuales,
        otherDeductionsAnnual: data.otrasDeducciones,
        vehicleDeductionTotal: data.valorVehiculo,
        vehicleDeductionApplied: data.deduccionVehiculoAplicada,
        calculateOptimalDeduction: data.calcularDeduccionOptima,
      });

      setResult(calculationResult);
      setShowResults(true);

      toast({
        title: "¡Cálculo completado!",
        description: "Desplázate hacia abajo para ver tus resultados",
      });

      // Scroll to results section by ID
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Error",
        description: "No se pudo realizar el cálculo. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onCalculateClick={handleCalculateClick} />

      <div ref={calculatorRef}>
        <CalculatorForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      </div>

      {showResults && formData && result && (
        <ResultsSection formData={formData} result={result} />
      )}
    </div>
  );
}
