import { cn } from "@/lib/utils";
import { Car, Truck, Crown } from "lucide-react";

interface VehicleProps {
  type: "normal" | "emergency" | "vip";
  moving?: boolean;
}

export function Vehicle({ type, moving = false }: VehicleProps) {
  const getVehicleIcon = () => {
    switch (type) {
      case "emergency":
        return <Truck className="w-4 h-4" />;
      case "vip":
        return <Crown className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  const getVehicleStyles = () => {
    switch (type) {
      case "emergency":
        return "bg-emergency text-white animate-emergency-flash";
      case "vip":
        return "bg-vip text-black animate-vip-glow";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <div className={cn(
      "p-2 rounded-lg border transition-all duration-300",
      getVehicleStyles(),
      moving && "animate-bounce-slow"
    )}>
      {getVehicleIcon()}
    </div>
  );
}