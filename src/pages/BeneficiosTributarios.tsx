import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, CheckCircle2, FileText, Zap, Leaf, TrendingDown, Building2, Car } from "lucide-react";
import { Link } from "react-router-dom";

export default function BeneficiosTributarios() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-white py-6 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/eco-logo.png" alt="Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold">Beneficios Tributarios</h1>
          </div>
          <Link to="/">
            <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Ley 1715 de 2014</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Beneficios Tributarios
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            La Ley 1715 de 2014 tiene por objeto promover el desarrollo y la utilización de fuentes no convencionales de energía,
            la gestión eficiente de la energía, los sistemas de medición inteligente y la reducción de emisiones de gases de efecto invernadero en Colombia.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Section 1: Incentivos */}
        <Card className="mb-8 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className="text-3xl">1.</span>
              ¿Qué incentivos tributarios contempla la Ley 1715?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 1.1 Deducción especial */}
            <div className="bg-primary/5 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                1.1 Deducción especial del impuesto sobre la renta
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Las inversiones en proyectos de Fuentes No Convencionales de Energía (FNCE) o gestión eficiente de la energía tienen una deducción tributaria especial.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  El contribuyente puede deducir hasta el <strong>50%</strong> del valor de la inversión sobre su impuesto de renta.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  La deducción se aplica con límite: no puede exceder el 50% de la renta líquida antes de restar la inversión.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Este beneficio se puede tomar en un periodo de hasta <strong>15 años</strong> a partir del siguiente año gravable a la puesta en operación de la inversión.
                </li>
              </ul>
            </div>

            {/* 1.2 Exclusión de IVA */}
            <div className="bg-secondary/10 rounded-lg p-6 border-l-4 border-secondary">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                1.2 Exclusión de IVA
              </h3>
              <p className="text-muted-foreground">
                Los equipos y servicios nacionales o importados que se destinen a proyectos de FNCE pueden quedar <strong>excluidos del impuesto al valor agregado (IVA)</strong>.
              </p>
            </div>

            {/* 1.3 Exención de aranceles */}
            <div className="bg-accent/30 rounded-lg p-6 border-l-4 border-accent-foreground/30">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
                1.3 Exención de aranceles
              </h3>
              <p className="text-muted-foreground">
                La importación de bienes, maquinaria, equipos y materiales destinados exclusivamente a proyectos bajo esta ley puede quedar <strong>exenta del pago de aranceles</strong>.
              </p>
            </div>

            {/* 1.4 Depreciación acelerada */}
            <div className="bg-muted rounded-lg p-6 border-l-4 border-muted-foreground/30">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                1.4 Incentivo contable – Depreciación acelerada
              </h3>
              <p className="text-muted-foreground mb-3">
                Los activos destinados a proyectos de FNCE o gestión eficiente de la energía pueden acogerse a <strong>depreciación acelerada</strong>, reduciendo más rápidamente la base gravable.
              </p>
              <div className="bg-amber-100 border border-amber-300 rounded-md px-4 py-2 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  Este beneficio aplica únicamente para <strong>Personas Jurídicas</strong> (empresas).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Ámbito de aplicación */}
        <Card className="mb-8 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className="text-3xl">2.</span>
              Ámbito de aplicación de la ley
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">La Ley 1715 aplica a:</p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Building2 className="w-6 h-6 text-primary mt-1" />
                <div>
                  <p className="font-medium">Personas naturales y jurídicas</p>
                  <p className="text-sm text-muted-foreground">Que realicen inversiones en tecnologías ambientalmente sostenibles.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Zap className="w-6 h-6 text-primary mt-1" />
                <div>
                  <p className="font-medium">Proyectos de energía renovable</p>
                  <p className="text-sm text-muted-foreground">Autogeneración, gestión eficiente de energía y sistemas de medición inteligente.</p>
                </div>
              </div>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                La ley también define la función de entidades como el <strong>Ministerio de Minas y Energía</strong> y la <strong>UPME</strong> para certificar, reglamentar y divulgar estos beneficios.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Requisitos */}
        <Card className="mb-8 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className="text-3xl">3.</span>
              Requisitos generales para aplicar los beneficios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">Para acceder a estos incentivos tributarios normalmente es necesario:</p>

            <div className="space-y-4">
              <div className="border rounded-lg p-5">
                <h4 className="font-bold text-lg flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-primary" />
                  a. Certificación de Beneficio Ambiental
                </h4>
                <p className="text-muted-foreground">
                  Obtener la certificación que avale la inversión como proyecto de FNCE o de gestión eficiente de energía (GEE), emitida por la autoridad ambiental competente.
                </p>
              </div>

              <div className="border rounded-lg p-5">
                <h4 className="font-bold text-lg flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-primary" />
                  b. Documentación técnica
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Ficha técnica del equipo o sistema.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Justificación de la inversión en términos de eficiencia o generación de energía limpia.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Memorias de cálculo.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Evidencia de instalación o adquisición.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Consideraciones clave */}
        <Card className="mb-8 shadow-medium bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className="text-3xl">4.</span>
              Consideraciones clave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                <TrendingDown className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">
                  La deducción especial del impuesto sobre la renta puede incluirse anualmente, <strong>sin exceder del 50% de la renta líquida</strong>.
                </p>
              </li>
              <li className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Leaf className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">
                  La deducción y la depreciación acelerada <strong>no son excluyentes</strong>, y pueden tomarse conjuntamente si se cumplen los requisitos.
                </p>
              </li>
              <li className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Zap className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">
                  La vigencia de los beneficios tributarios y arancelarios se mantiene por un periodo de <strong>30 años</strong> contados desde el 1 de julio de 2021.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 5: Vehículos eléctricos */}
        <Card className="mb-8 shadow-medium border-2 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className="text-3xl">5.</span>
              Beneficios tributarios relevantes para vehículos eléctricos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 mb-6">
              <Car className="w-12 h-12 text-primary flex-shrink-0" />
              <p className="text-muted-foreground">
                Aunque la Ley 1715 no está escrita específicamente para vehículos eléctricos, muchas inversiones en tecnologías limpias y eficiencia energética
                (como infraestructura de carga o vehículos eléctricos cuando están incluidos en políticas de eficiencia/estímulo ambiental),
                pueden acogerse a estos beneficios siempre que:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Se obtenga la certificación ambiental correspondiente.</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">La inversión esté alineada con los objetivos de uso eficiente de energía o reducción de emisiones.</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Se cumplan los requisitos para deducción, exclusiones de IVA y aranceles según lo dispuesto en la ley.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-hero text-white border-0">
          <CardContent className="pt-8 text-center">
            <h3 className="text-2xl font-bold mb-4">¿Quieres calcular tu posible beneficio?</h3>
            <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
              Usa nuestra calculadora para estimar cuánto podrías ahorrar en impuestos con la compra de tu vehículo eléctrico.
            </p>
            <Link to="/">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                Ir a la Calculadora
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> Esta información es de carácter educativo. Consulta con un profesional tributario para aplicar estos beneficios a tu caso específico.
          </p>
        </div>
      </footer>
    </div>
  );
}
