import { cn } from "@/lib/utils";
import { 
  Navigation, 
  Clock, 
  Shield, 
  AlertTriangle, 
  Database, 
  Settings,
  Zap,
  RefreshCw
} from "lucide-react";

interface TaskSidebarProps {
  activeTask: number;
  onTaskSelect: (task: number) => void;
  intersectionState: any;
}

const tasks = [
  {
    id: 1,
    title: "Traffic Signals",
    description: "Basic traffic light control",
    icon: Navigation,
    color: "text-traffic-green"
  },
  {
    id: 2,
    title: "Signal Controller",
    description: "Central control system",
    icon: Settings,
    color: "text-primary"
  },
  {
    id: 3,
    title: "Traffic Coordination",
    description: "Multi-signal coordination",
    icon: RefreshCw,
    color: "text-accent"
  },
  {
    id: 4,
    title: "Clock Synchronization",
    description: "Time-based coordination",
    icon: Clock,
    color: "text-traffic-yellow"
  },
  {
    id: 5,
    title: "Critical Section",
    description: "Active road priority",
    icon: Shield,
    color: "text-warning"
  },
  {
    id: 6,
    title: "Deadlock Prevention",
    description: "Conflict resolution",
    icon: AlertTriangle,
    color: "text-traffic-red"
  },
  {
    id: 7,
    title: "Load Balancing",
    description: "Primary/Backup controllers",
    icon: Zap,
    color: "text-emergency"
  },
  {
    id: 8,
    title: "Data Consistency",
    description: "Synchronized database",
    icon: Database,
    color: "text-vip"
  }
];

export function TaskSidebar({ activeTask, onTaskSelect, intersectionState }: TaskSidebarProps) {
  return (
    <div className="w-80 bg-card border-r border-border p-4 h-[calc(100vh-80px)] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">System Tasks</h2>
        <p className="text-sm text-muted-foreground">
          Click on each task to see its demonstration
        </p>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => {
          const IconComponent = task.icon;
          const isActive = activeTask === task.id;
          
          return (
            <button
              key={task.id}
              onClick={() => onTaskSelect(task.id)}
              className={cn(
                "w-full p-4 rounded-lg border transition-all duration-200 text-left",
                "hover:bg-accent/50 hover:border-accent",
                isActive 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-card border-border"
              )}
            >
              <div className="flex items-start gap-3">
                <IconComponent 
                  className={cn(
                    "w-5 h-5 mt-0.5 flex-shrink-0",
                    isActive ? "text-primary" : task.color
                  )} 
                />
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-medium text-sm",
                    isActive ? "text-primary" : "text-foreground"
                  )}>
                    Task {task.id}: {task.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {task.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Status Indicators */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <h3 className="text-sm font-medium mb-3">System Status</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span>Active Road:</span>
            <span className="text-primary font-medium">R{intersectionState.activeRoad}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Emergency Mode:</span>
            <span className={cn(
              "font-medium",
              intersectionState.emergencyMode ? "text-emergency" : "text-muted-foreground"
            )}>
              {intersectionState.emergencyMode ? "ACTIVE" : "OFF"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>VIP Priority:</span>
            <span className={cn(
              "font-medium",
              intersectionState.vipMode ? "text-vip" : "text-muted-foreground"
            )}>
              {intersectionState.vipMode ? "ACTIVE" : "OFF"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}