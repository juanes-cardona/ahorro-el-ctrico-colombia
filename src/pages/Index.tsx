import { useState, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { CalculatorForm, FormData } from "@/components/CalculatorForm";
import { ResultsSection } from "@/components/ResultsSection";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const { toast } = useToast();
  const calculatorRef = useRef<HTMLDivElement>(null);

  const handleCalculateClick = () => {
    calculatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setShowResults(true);
    
    toast({
      title: "¡Cálculo completado!",
      description: "Desplázate hacia abajo para ver tus resultados",
    });

    // Scroll to results after a brief delay
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onCalculateClick={handleCalculateClick} />
      
      <div ref={calculatorRef}>
        <CalculatorForm onSubmit={handleFormSubmit} />
      </div>
      
      {showResults && formData && (
        <ResultsSection formData={formData} />
      )}
    </div>
  );
};

export default Index;
