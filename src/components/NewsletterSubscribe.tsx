import { useState } from "react";
import { Bell, CheckCircle2, Loader2, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { makes } from "@/data/sampleVehicles";

interface NewsletterSubscribeProps {
  variant?: "inline" | "modal";
  className?: string;
}

export function NewsletterSubscribe({ variant = "inline", className }: NewsletterSubscribeProps) {
  const [email, setEmail] = useState("");
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        variant: "destructive",
        title: "Email richiesta",
        description: "Inserisci un indirizzo email valido.",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSuccess(true);

    toast({
      title: "Iscrizione completata!",
      description: "Riceverai notifiche sui nuovi arrivi.",
    });

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setEmail("");
      setSelectedMakes([]);
      setPriceMax("");
      setIsOpen(false);
    }, 3000);
  };

  const toggleMake = (make: string) => {
    if (selectedMakes.includes(make)) {
      setSelectedMakes(selectedMakes.filter((m) => m !== make));
    } else if (selectedMakes.length < 5) {
      setSelectedMakes([...selectedMakes, make]);
    }
  };

  if (variant === "modal") {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className={className}>
            <Bell className="w-4 h-4 mr-2" />
            Notifiche Nuovi Arrivi
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifiche Nuovi Arrivi
            </DialogTitle>
            <DialogDescription>
              Ricevi un'email quando arrivano nuove auto che corrispondono ai tuoi criteri.
            </DialogDescription>
          </DialogHeader>

          {isSuccess ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Iscrizione Completata!</h3>
              <p className="text-muted-foreground mt-2">
                Ti avviseremo quando arrivano nuove auto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tua@email.it"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Marche preferite (max 5)</Label>
                <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2 border border-border rounded-lg">
                  {makes.slice(0, 20).map((make) => (
                    <div key={make.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`make-${make.key}`}
                        checked={selectedMakes.includes(make.value)}
                        onCheckedChange={() => toggleMake(make.value)}
                        disabled={!selectedMakes.includes(make.value) && selectedMakes.length >= 5}
                      />
                      <label
                        htmlFor={`make-${make.key}`}
                        className="text-sm text-foreground cursor-pointer"
                      >
                        {make.value}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedMakes.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Selezionate: {selectedMakes.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Budget massimo</Label>
                <Select value={priceMax} onValueChange={setPriceMax}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15000">Fino a € 15.000</SelectItem>
                    <SelectItem value="20000">Fino a € 20.000</SelectItem>
                    <SelectItem value="25000">Fino a € 25.000</SelectItem>
                    <SelectItem value="30000">Fino a € 30.000</SelectItem>
                    <SelectItem value="40000">Fino a € 40.000</SelectItem>
                    <SelectItem value="50000">Fino a € 50.000</SelectItem>
                    <SelectItem value="any">Qualsiasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iscrizione in corso...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Attiva Notifiche
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Puoi cancellare l'iscrizione in qualsiasi momento.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Inline variant
  return (
    <div className={className}>
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Car className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              Non perdere i nuovi arrivi!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Iscriviti per ricevere notifiche quando arrivano nuove auto.
            </p>

            {isSuccess ? (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Iscrizione completata!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="tua@email.it"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Iscriviti"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
