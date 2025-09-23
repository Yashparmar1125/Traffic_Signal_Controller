import { cn } from "@/lib/utils";

interface TrafficLightProps {
  status: "red" | "yellow" | "green" | "off";
  orientation?: "vertical" | "horizontal";
  emergency?: boolean;
}

export function TrafficLight({ 
  status, 
  orientation = "vertical", 
  emergency = false 
}: TrafficLightProps) {
  const isVertical = orientation === "vertical";
  
  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-2 shadow-md",
      isVertical ? "flex flex-col gap-1" : "flex gap-1",
      emergency && "animate-emergency-flash"
    )}>
      {/* Red Light */}
      <div className={cn(
        "traffic-light",
        status === "red" ? "red" : "off"
      )} />
      
      {/* Yellow Light */}
      <div className={cn(
        "traffic-light",
        status === "yellow" ? "yellow" : "off"
      )} />
      
      {/* Green Light */}
      <div className={cn(
        "traffic-light", 
        status === "green" ? "green" : "off"
      )} />
    </div>
  );
}