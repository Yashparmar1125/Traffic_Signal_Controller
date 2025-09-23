import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TrafficLight } from "./TrafficLight";
import { Vehicle } from "./Vehicle";
import { PedestrianSignal } from "./PedestrianSignal";
import { Car, Users, AlertTriangle, Crown, Database, Clock } from "lucide-react";

interface TrafficIntersectionProps {
  activeTask: number;
  intersectionState: {
    activeRoad: number;
    emergencyMode: boolean;
    vipMode: boolean;
    alertMode: boolean;
    deadlockMode: boolean;
    syncMode: boolean;
    transitionPhase?: "idle" | "yellow" | "red";
    transitionPair?: 13 | 24 | null;
  };
  onStateChange: (state: any) => void;
}

export function TrafficIntersection({ 
  activeTask, 
  intersectionState, 
  onStateChange 
}: TrafficIntersectionProps) {
  const [cycleTime, setCycleTime] = useState(0);

  // Auto-cycle traffic lights
  useEffect(() => {
    if (
      intersectionState.emergencyMode ||
      intersectionState.vipMode ||
      intersectionState.deadlockMode ||
      activeTask === 2 ||
      (intersectionState.transitionPhase && intersectionState.transitionPhase !== "idle")
    ) {
      return;
    }

    const interval = setInterval(() => {
      setCycleTime(prev => prev + 1);
      
      if (cycleTime % 5 === 0) {
        const nextRoad = (intersectionState.activeRoad % 4) + 1;
        onStateChange({
          ...intersectionState,
          activeRoad: nextRoad
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cycleTime, intersectionState, onStateChange]);

  // Task 2: Central controller automatic pair switching with phased transition
  useEffect(() => {
    if (
      activeTask !== 2 ||
      intersectionState.emergencyMode ||
      intersectionState.vipMode ||
      intersectionState.deadlockMode
    ) {
      return;
    }

    const interval = setInterval(() => {
      const currentPair = (intersectionState.activeRoad === 1 || intersectionState.activeRoad === 3) ? 13 : 24;
      // Start yellow for outgoing pair
      onStateChange({
        ...intersectionState,
        transitionPhase: "yellow",
        transitionPair: currentPair,
      });
      // After 2s -> red
      setTimeout(() => {
        onStateChange(prev => ({
          ...prev,
          transitionPhase: "red",
        }));
      }, 2000);
      // After 3s -> switch to opposite pair and clear transition
      setTimeout(() => {
        onStateChange(prev => ({
          ...prev,
          activeRoad: (currentPair === 13) ? 2 : 1,
          transitionPhase: "idle",
          transitionPair: null,
        }));
      }, 3000);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeTask, intersectionState.activeRoad, intersectionState.emergencyMode, intersectionState.vipMode, intersectionState.deadlockMode, onStateChange]);

  const getRoadStatus = (roadNumber: number) => {
    // Task 2: central controller pair transition (12 <-> 34)
    if (activeTask === 2 && intersectionState.transitionPhase !== "idle") {
      const activePair = intersectionState.transitionPair; // 13 or 24
      const isInPair13 = roadNumber === 1 || roadNumber === 3;
      const pairForRoad = isInPair13 ? 13 : 24;
      if (pairForRoad === activePair) {
        if (intersectionState.transitionPhase === "yellow") return "yellow";
        if (intersectionState.transitionPhase === "red") return "red";
      }
    }
    // Task 2: when idle, operate in opposite-road pair mode (R1↔R3, R2↔R4)
    if (activeTask === 2 && (!intersectionState.transitionPhase || intersectionState.transitionPhase === "idle")) {
      const active = intersectionState.activeRoad;
      const activePairIs13 = active === 1 || active === 3; // R1-R3 pair
      const isRoadIn13 = roadNumber === 1 || roadNumber === 3;
      if (activePairIs13 === isRoadIn13) {
        return "green";
      }
      return "red";
    }
    if (intersectionState.emergencyMode || intersectionState.vipMode) {
      return intersectionState.activeRoad === roadNumber ? "green" : "red";
    }
    if (intersectionState.deadlockMode) {
      return roadNumber <= 2 ? "yellow" : "red";
    }
    return intersectionState.activeRoad === roadNumber ? "green" : "red";
  };

  return (
    <div className="relative bg-card rounded-lg border border-border p-6 h-full">
      {/* Task Title */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          Task {activeTask}: Interactive Intersection
        </h2>
        <p className="text-sm text-muted-foreground">
          {getTaskDescription(activeTask)}
        </p>
      </div>

      {/* Intersection Grid */}
      <div className="relative flex-1 bg-background rounded-lg p-12 mt-8 min-h-[420px] md:min-h-[520px]">
        {/* Critical Section Highlight */}
        {activeTask === 5 && (
          <div className="absolute inset-8 bg-warning/10 border-2 border-warning border-dashed rounded-lg animate-pulse">
            <div className="absolute top-2 left-2 bg-warning text-warning-foreground px-2 py-1 rounded text-xs font-medium">
              Critical Section: R{intersectionState.activeRoad}
            </div>
          </div>
        )}

        {/* Road R1 (North) */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 road-vertical rounded-md">
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10">
            <TrafficLight 
              status={getRoadStatus(1)} 
              orientation="vertical"
              emergency={intersectionState.emergencyMode && intersectionState.activeRoad === 1}
            />
          </div>
          <div className="absolute top-10 left-1 z-10">
            <PedestrianSignal active={getRoadStatus(1) === "red"} />
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            {(intersectionState.emergencyMode && intersectionState.activeRoad === 1) && (
              <Vehicle type="emergency" moving={true} />
            )}
            {(intersectionState.vipMode && intersectionState.activeRoad === 1) && (
              <Vehicle type="vip" moving={true} />
            )}
          </div>
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-medium text-primary z-20 whitespace-nowrap bg-card/80 px-1 py-0.5 rounded">
            R1 (North)
          </div>
        </div>

        {/* Road R2 (East) */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 road-horizontal rounded-md">
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
            <TrafficLight 
              status={getRoadStatus(2)} 
              orientation="horizontal"
              emergency={intersectionState.emergencyMode && intersectionState.activeRoad === 2}
            />
          </div>
          <div className="absolute right-8 top-1 z-10">
            <PedestrianSignal active={getRoadStatus(2) === "red"} />
          </div>
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10">
            {(intersectionState.emergencyMode && intersectionState.activeRoad === 2) && (
              <Vehicle type="emergency" moving={true} />
            )}
            {(intersectionState.vipMode && intersectionState.activeRoad === 2) && (
              <Vehicle type="vip" moving={true} />
            )}
          </div>
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-medium text-primary z-20 whitespace-nowrap bg-card/80 px-1 py-0.5 rounded">
            R2 (East)
          </div>
        </div>

        {/* Road R3 (South) */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 road-vertical rounded-md">
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
            <TrafficLight 
              status={getRoadStatus(3)} 
              orientation="vertical"
              emergency={intersectionState.emergencyMode && intersectionState.activeRoad === 3}
            />
          </div>
          <div className="absolute bottom-10 right-1 z-10">
            <PedestrianSignal active={getRoadStatus(3) === "red"} />
          </div>
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
            {(intersectionState.emergencyMode && intersectionState.activeRoad === 3) && (
              <Vehicle type="emergency" moving={true} />
            )}
            {(intersectionState.vipMode && intersectionState.activeRoad === 3) && (
              <Vehicle type="vip" moving={true} />
            )}
          </div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-medium text-primary z-20 whitespace-nowrap bg-card/80 px-1 py-0.5 rounded">
            R3 (South)
          </div>
        </div>

        {/* Road R4 (West) */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 road-horizontal rounded-md">
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
            <TrafficLight 
              status={getRoadStatus(4)} 
              orientation="horizontal"
              emergency={intersectionState.emergencyMode && intersectionState.activeRoad === 4}
            />
          </div>
          <div className="absolute left-8 bottom-1 z-10">
            <PedestrianSignal active={getRoadStatus(4) === "red"} />
          </div>
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10">
            {(intersectionState.emergencyMode && intersectionState.activeRoad === 4) && (
              <Vehicle type="emergency" moving={true} />
            )}
            {(intersectionState.vipMode && intersectionState.activeRoad === 4) && (
              <Vehicle type="vip" moving={true} />
            )}
          </div>
          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-medium text-primary z-20 whitespace-nowrap bg-card/80 px-1 py-0.5 rounded">
            R4 (West)
          </div>
        </div>

        {/* Central Intersection (render only when needed) */}
        {(activeTask === 2 || activeTask === 4 || activeTask === 7 || activeTask === 8) && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-road rounded border-2 border-road-marking border-dashed pointer-events-none">
            {/* Central Controller */}
            {(activeTask === 2 || activeTask === 7) && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-primary text-primary-foreground p-2 rounded-full animate-sync-pulse">
                  <Car className="w-4 h-4" />
                </div>
              </div>
            )}
            
            {/* Clock Sync Indicator */}
            {activeTask === 4 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Clock className="w-6 h-6 text-traffic-yellow animate-rotate" />
              </div>
            )}
            
            {/* Database Sync */}
            {activeTask === 8 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Database className="w-6 h-6 text-vip animate-sync-pulse" />
              </div>
            )}
          </div>
        )}

        {/* Deadlock Indicators */}
        {activeTask === 6 && intersectionState.deadlockMode && (
          <div className="absolute top-2 right-2">
            <div className="bg-traffic-red text-white p-2 rounded-lg animate-emergency-flash">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs ml-1">Deadlock Detected</span>
            </div>
          </div>
        )}

        {/* Load Balancer Indicators */}
        {activeTask === 7 && (
          <>
            <div className="absolute top-2 left-2">
              <div className="bg-primary text-primary-foreground p-2 rounded text-xs">
                Primary Controller
              </div>
            </div>
            <div className="absolute top-2 left-32">
              <div className="bg-secondary text-secondary-foreground p-2 rounded text-xs">
                Backup Controller
              </div>
            </div>
            <div className="absolute top-12 left-2">
              <div className="bg-accent text-accent-foreground p-1 rounded text-xs animate-sync-pulse">
                ZooKeeper
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function getTaskDescription(task: number): string {
  const descriptions = {
    1: "Traffic Signals: 4 roads (R1–R4) with vehicle + pedestrian signals. Only one road GREEN, opposite RED. Pedestrians walk on RED roads.",
    2: "Controller: Central controller manages all signals.",
    3: "Traffic Coordination: Multi-signal coordination across the intersection.", 
    4: "Clock Sync (Task 4): Master clock synchronizes road controllers.",
    5: "Critical Section (Task 5): Signal state = CS, only one road accesses at a time.",
    6: "Deadlock (Task 6): Two roads waiting for CS → resolved by priority/timeout.",
    7: "Load Balancing (Task 7): Primary + Backup controller, ZooKeeper ensures failover.",
    8: "Consistency (Task 8): Shared DB for signals, pedestrians, clock → same across servers."
  };
  return descriptions[task as keyof typeof descriptions] || "";
}