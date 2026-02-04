import { Button } from "@/components/ui/button";
import { Zap, Leaf, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onCalculateClick: () => void;
}

export const HeroSection = ({ onCalculateClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="/hero-electric-car.jpg"
          alt="Vehículo eléctrico moderno"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtOC44MzcgNy4xNjMtMTYgMTYtMTZzMTYgNy4xNjMgMTYgMTYtNy4xNjMgMTYtMTYgMTYtMTYtNy4xNjMtMTYtMTZ6TTAgMTZjMC04LjgzNyA3LjE2My0xNiAxNi0xNnMxNiA3LjE2MyAxNiAxNi03LjE2MyAxNi0xNiAxNi0xNi03LjE2My0xNi0xNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      {/* Floating eco logo */}
      <div className="absolute top-20 right-10 animate-float hidden md:block">
        <img
          src="/eco-logo.png"
          alt="Logo sostenibilidad"
          className="w-32 h-32 opacity-30"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium">Movilidad Sostenible en Colombia</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            ¿Cuánto podrías ahorrar en impuestos con un{" "}
            <span className="text-primary-foreground/90 underline decoration-wavy decoration-primary-foreground/40">
              vehículo eléctrico
            </span>?
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            En Colombia existen beneficios tributarios para quienes invierten en vehículos eléctricos y soluciones de energías limpias. Para acceder a estas ventajas, es necesario realizar el trámite del Certificado de Beneficio Tributario ante la UPME, el cual valida tu proyecto o adquisición frente a los requisitos de la ley.
          </p>

          {/* CTA Button */}
          <Button
            onClick={onCalculateClick}
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Zap className="w-5 h-5 mr-2" />
            Conoce cuál podría ser tu beneficio tributario
          </Button>

          {/* Benefits preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
              <TrendingDown className="w-8 h-8 mb-3 mx-auto" />
              <p className="font-medium">Devolución de IVA</p>
            </div>
            <Link to="/beneficios-tributarios" className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors cursor-pointer">
              <Leaf className="w-8 h-8 mb-3 mx-auto" />
              <p className="font-medium">Beneficios tributarios</p>
            </Link>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
              <Zap className="w-8 h-8 mb-3 mx-auto" />
              <p className="font-medium">Beneficios locales</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
