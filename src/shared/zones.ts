// Zone definitions for RTS visualizer
// Each zone has a type, position, and behavior rules

export interface Zone {
  id: string;
  name: string;
  type: 'base' | 'research' | 'battlefield' | 'factory' | 'intel';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  description: string;
}

export const ZONES: Zone[] = [
  {
    id: 'base-camp',
    name: '🏠 Base Camp',
    type: 'base',
    x: 50,
    y: 50,
    width: 300,
    height: 200,
    color: '#3b82f6',
    description: 'Main session and idle agents'
  },
  {
    id: 'research-forest',
    name: '🌲 Research Forest',
    type: 'research',
    x: 400,
    y: 50,
    width: 300,
    height: 200,
    color: '#22c55e',
    description: 'Skill evaluations and learning tasks'
  },
  {
    id: 'battlefield',
    name: '⚔️ Battlefield',
    type: 'battlefield',
    x: 50,
    y: 300,
    width: 300,
    height: 200,
    color: '#ef4444',
    description: 'Active tasks and running agents'
  },
  {
    id: 'code-factory',
    name: '🏭 Code Factory',
    type: 'factory',
    x: 400,
    y: 300,
    width: 300,
    height: 200,
    color: '#f59e0b',
    description: 'Builds, prototypes, and code generation'
  },
  {
    id: 'intel-center',
    name: '📊 Intel Center',
    type: 'intel',
    x: 750,
    y: 50,
    width: 200,
    height: 450,
    color: '#8b5cf6',
    description: 'Reports, dashboards, and metrics'
  }
];

// Assign agents to zones based on their type/status
export function assignAgentToZone(agent: any): { x: number; y: number } {
  let zone: Zone;
  
  if (agent.type === 'main' || agent.status === 'idle') {
    zone = ZONES.find(z => z.id === 'base-camp')!;
  } else if (agent.type === 'skill-eval' || agent.label?.includes('skill')) {
    zone = ZONES.find(z => z.id === 'research-forest')!;
  } else if (agent.status === 'running') {
    zone = ZONES.find(z => z.id === 'battlefield')!;
  } else if (agent.label?.includes('build') || agent.label?.includes('code')) {
    zone = ZONES.find(z => z.id === 'code-factory')!;
  } else {
    zone = ZONES.find(z => z.id === 'base-camp')!;
  }
  
  // Random position within zone (with padding)
  const padding = 30;
  return {
    x: zone.x + padding + Math.random() * (zone.width - padding * 2),
    y: zone.y + padding + Math.random() * (zone.height - padding * 2)
  };
}
