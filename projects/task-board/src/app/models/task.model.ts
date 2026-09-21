export type Priority = 'low' | 'standard' | 'urgent';
export type Lane = 'queued' | 'moving' | 'delivered';

export interface Task {
  id: string;
  title: string;
  notes: string;
  priority: Priority;
  lane: Lane;
}

export interface LaneConfig {
  key: Lane;
  label: string;
}
