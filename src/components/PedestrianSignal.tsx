import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface PedestrianSignalProps {
  active: boolean;
}

export function PedestrianSignal({ active }: PedestrianSignalProps) {
  return (
    <div className={cn(
      "p-1 rounded border transition-all duration-300",
      active 
        ? "bg-traffic-green text-white" 
        : "bg-traffic-red text-white"
    )}>
      <Users className="w-3 h-3" />
    </div>
  );
}