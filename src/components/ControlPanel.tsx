import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Crown, 
  Zap, 
  RotateCcw, 
  Play, 
  Pause,
  Database,
  Clock,
  Settings
} from "lucide-react";

interface ControlPanelProps {
  activeTask: number;
  intersectionState: any;
  onStateChange: (state: any) => void;
}

export function ControlPanel({ 
  activeTask, 
  intersectionState, 
  onStateChange 
}: ControlPanelProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const handleEmergencyToggle = () => {
    onStateChange({
      ...intersectionState,
      emergencyMode: !intersectionState.emergencyMode,
      vipMode: false,
      activeRoad: intersectionState.emergencyMode ? 1 : intersectionState.activeRoad
    });
  };

  const handleVipToggle = () => {
    onStateChange({
      ...intersectionState,
      vipMode: !intersectionState.vipMode,
      emergencyMode: false,
      activeRoad: intersectionState.vipMode ? 1 : intersectionState.activeRoad
    });
  };

  const handleDeadlockTest = () => {
    onStateChange({
      ...intersectionState,
      deadlockMode: !intersectionState.deadlockMode
    });
  };

  const handleRoadChange = (roadNumber: number) => {
    // Task 2: if switching between pairs (12 <-> 34), run phased transition
    // Opposite pairing: (1,3) and (2,4)
    const currentPair = intersectionState.activeRoad === 1 || intersectionState.activeRoad === 3 ? 13 : 24;
    const nextPair = roadNumber === 1 || roadNumber === 3 ? 13 : 24;

    if (currentPair !== nextPair) {
      // Start transition: pair to turn off goes yellow -> red, then other turns green
      onStateChange({
        ...intersectionState,
        transitionPhase: "yellow",
        transitionPair: currentPair
      });
      // after 2s -> red
      setTimeout(() => {
        onStateChange(prev => ({
          ...prev,
          transitionPhase: "red",
        }));
      }, 2000);
      // after 3s -> switch active and clear transition
      setTimeout(() => {
        onStateChange(prev => ({
          ...prev,
          activeRoad: roadNumber,
          transitionPhase: "idle",
          transitionPair: null
        }));
      }, 3000);
      return;
    }

    // Same pair: immediate switch
    onStateChange({
      ...intersectionState,
      activeRoad: roadNumber
    });
  };

  const handleReset = () => {
    onStateChange({
      activeRoad: 1,
      emergencyMode: false,
      vipMode: false,
      alertMode: false,
      deadlockMode: false,
      syncMode: false,
    });
  };

  return (
    <div className="space-y-4">
      {/* Manual Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Manual Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((road) => (
              <Button
                key={road}
                variant={intersectionState.activeRoad === road ? "default" : "outline"}
                size="sm"
                onClick={() => handleRoadChange(road)}
                disabled={intersectionState.transitionPhase !== "idle"}
                className="btn-traffic"
              >
                Road R{road}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset System
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emergency">Emergency & Priority</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleEmergencyToggle}
            className={cn(
              "w-full btn-emergency",
              intersectionState.emergencyMode && "animate-emergency-flash"
            )}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {intersectionState.emergencyMode ? "Clear Emergency" : "Emergency Vehicle"}
          </Button>
          
          <Button
            onClick={handleVipToggle}
            className={cn(
              "w-full btn-vip",
              intersectionState.vipMode && "animate-vip-glow"
            )}
          >
            <Crown className="w-4 h-4 mr-2" />
            {intersectionState.vipMode ? "Clear VIP" : "VIP Priority"}
          </Button>
        </CardContent>
      </Card>

      {/* Task-Specific Controls */}
      {activeTask === 6 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-traffic-red">Deadlock Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDeadlockTest}
              variant={intersectionState.deadlockMode ? "destructive" : "outline"}
              className="w-full"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {intersectionState.deadlockMode ? "Resolve Deadlock" : "Simulate Deadlock"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* System Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Active Road:</span>
                <span className="font-medium text-primary">R{intersectionState.activeRoad}</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="font-medium">
                  {intersectionState.emergencyMode ? "EMERGENCY" : 
                   intersectionState.vipMode ? "VIP" :
                   intersectionState.deadlockMode ? "DEADLOCK" : "NORMAL"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Task:</span>
                <span className="font-medium text-accent">#{activeTask}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-traffic-green">ACTIVE</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Information */}
      <Card>
        <CardHeader>
          <CardTitle>Task {activeTask} Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {getTaskInfo(activeTask)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getTaskInfo(task: number): string {
  const info = {
    1: "Basic traffic signals control vehicle flow at the intersection. Only one direction gets green light at a time.",
    2: "Central controller coordinates all traffic signals from a single point of control.",
    3: "Multiple traffic signals work together with coordinated timing to optimize traffic flow.",
    4: "All signals synchronize their timing using a central clock for precise coordination.",
    5: "Critical section ensures mutual exclusion - only one road can be active in the intersection.",
    6: "Deadlock prevention detects and resolves conflicts when multiple roads wait indefinitely.",
    7: "Load balancing uses primary/backup controllers with ZooKeeper for failover management.",
    8: "Database consistency ensures all controllers share the same synchronized state information."
  };
  return info[task as keyof typeof info] || "";
}