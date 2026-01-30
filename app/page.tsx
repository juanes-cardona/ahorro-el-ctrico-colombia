'use client';

import { useState, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { CalculatorForm, FormData } from "@/components/CalculatorForm";
import { ResultsSection } from "@/components/ResultsSection";
import { useToast } from "@/hooks/use-toast";
import { TaxCalculationResult } from "@/lib/taxCalculations";
import type { CalculateResponse } from "@/app/api/calculate/route";

export default function Home() {
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
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json: CalculateResponse = await response.json();

      if (!json.success || !json.result) {
        throw new Error(json.error || 'Error en el cálculo');
      }

      setResult(json.result);
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
