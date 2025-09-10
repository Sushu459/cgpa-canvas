import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, GraduationCap, RotateCcw } from "lucide-react";

interface CalculationResult {
  cgpa: number;
  percentage: number;
  classification: 'distinction' | 'first-class' | 'second-class';
  message: string;
}

const CGPACalculator = () => {
  const [semesters, setSemesters] = useState<number>(4);
  const [sgpas, setSgpas] = useState<string[]>(Array(4).fill(""));
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleSemesterChange = (newSemesters: number) => {
    setSemesters(newSemesters);
    setSgpas(Array(newSemesters).fill(""));
    setResult(null);
  };

  const handleSgpaChange = (index: number, value: string) => {
    const newSgpas = [...sgpas];
    newSgpas[index] = value;
    setSgpas(newSgpas);
  };

  const calculateCGPA = () => {
    const validSgpas = sgpas
      .map(sgpa => parseFloat(sgpa))
      .filter(sgpa => !isNaN(sgpa) && sgpa >= 0 && sgpa <= 10);

    if (validSgpas.length === 0) return;

    const totalSgpa = validSgpas.reduce((sum, sgpa) => sum + sgpa, 0);
    const cgpa = totalSgpa / validSgpas.length;
    const percentage = cgpa * 9.5;

    let classification: 'distinction' | 'first-class' | 'second-class';
    let message: string;

    if (cgpa >= 8.5) {
      classification = 'distinction';
      message = '🏆 Outstanding! You achieved Distinction!';
    } else if (cgpa >= 6.5) {
      classification = 'first-class';
      message = '🎉 Excellent! You earned First Class!';
    } else {
      classification = 'second-class';
      message = '📚 Good job! Keep working harder!';
    }

    setResult({ cgpa, percentage, classification, message });
  };

  const resetCalculator = () => {
    setSgpas(Array(semesters).fill(""));
    setResult(null);
  };

  const getGradeColors = (classification?: string) => {
    switch (classification) {
      case 'distinction':
        return {
          bg: 'bg-distinction/20',
          text: 'text-distinction',
          border: 'border-distinction/30',
          shadow: 'shadow-distinction-glow',
        };
      case 'first-class':
        return {
          bg: 'bg-first-class/20',
          text: 'text-first-class',
          border: 'border-first-class/30',
          shadow: 'shadow-first-class-glow',
        };
      case 'second-class':
        return {
          bg: 'bg-second-class/20',
          text: 'text-second-class',
          border: 'border-second-class/30',
          shadow: 'shadow-second-class-glow',
        };
      default:
        return {
          bg: 'bg-primary/20',
          text: 'text-primary',
          border: 'border-primary/30',
          shadow: 'shadow-glow',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-distinction/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-first-class/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CGPA Calculator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Calculate your Cumulative Grade Point Average with style
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Semester Selection */}
          <Card className="bg-glass backdrop-blur-glass border-glass-border shadow-glass animate-scale-in">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Select Number of Semesters</h2>
                <p className="text-sm text-muted-foreground">Choose between 2 to 8 semesters</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <Button
                    key={num}
                    variant={semesters === num ? "default" : "outline"}
                    onClick={() => handleSemesterChange(num)}
                    className={`min-w-12 transition-all duration-300 ${
                      semesters === num 
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                        : 'hover:scale-105'
                    }`}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SGPA Input Fields */}
          <Card className="bg-glass backdrop-blur-glass border-glass-border shadow-glass animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Enter Your SGPA</h2>
                <p className="text-sm text-muted-foreground">Enter SGPA for each semester (0-10 scale)</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sgpas.map((sgpa, index) => {
                  const colors = ['bg-primary/10', 'bg-distinction/10', 'bg-first-class/10', 'bg-second-class/10'];
                  const colorClass = colors[index % colors.length];
                  
                  return (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Semester {index + 1}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.01"
                        value={sgpa}
                        onChange={(e) => handleSgpaChange(index, e.target.value)}
                        placeholder="Enter SGPA"
                        className={`${colorClass} border-2 focus:border-primary/50 transition-all duration-300 focus:scale-105 backdrop-blur-sm`}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={calculateCGPA}
              size="lg"
              className="bg-gradient-primary text-primary-foreground px-8 py-4 text-lg font-semibold shadow-glow hover:shadow-lg transition-all duration-300 hover:scale-105 animate-glow"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calculate CGPA
            </Button>
            
            <Button
              onClick={resetCalculator}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>

          {/* Results Card */}
          {result && (
            <Card className={`${getGradeColors(result.classification).bg} backdrop-blur-glass border-2 ${getGradeColors(result.classification).border} ${getGradeColors(result.classification).shadow} animate-slide-up`}>
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      {result.message}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getGradeColors(result.classification).text} mb-2`}>
                        {result.cgpa.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">CGPA</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getGradeColors(result.classification).text} mb-2`}>
                        {result.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Percentage</div>
                    </div>
                    
                    <div className="text-center">
                      <Badge 
                        className={`${getGradeColors(result.classification).bg} ${getGradeColors(result.classification).text} ${getGradeColors(result.classification).border} text-lg px-4 py-2 font-semibold border-2`}
                      >
                        {result.classification.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CGPACalculator;