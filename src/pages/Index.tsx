import { useState } from "react";
import { TrafficIntersection } from "@/components/TrafficIntersection";
import { TaskSidebar } from "@/components/TaskSidebar";
import { ControlPanel } from "@/components/ControlPanel";

const Index = () => {
  const [activeTask, setActiveTask] = useState<number>(1);
  const [intersectionState, setIntersectionState] = useState({
    activeRoad: 1,
    emergencyMode: false,
    vipMode: false,
    alertMode: false,
    deadlockMode: false,
    syncMode: false,
    transitionPhase: "idle" as "idle" | "yellow" | "red",
    transitionPair: null as 13 | 24 | null,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">
              Smart City Traffic Control System
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Interactive Demonstration
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <TaskSidebar 
          activeTask={activeTask} 
          onTaskSelect={setActiveTask}
          intersectionState={intersectionState}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            {/* Traffic Intersection */}
            <div className="lg:col-span-2">
              <TrafficIntersection 
                activeTask={activeTask}
                intersectionState={intersectionState}
                onStateChange={setIntersectionState}
              />
            </div>

            {/* Control Panel */}
            <div className="lg:col-span-1">
              <ControlPanel 
                activeTask={activeTask}
                intersectionState={intersectionState}
                onStateChange={setIntersectionState}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;