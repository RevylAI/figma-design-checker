export type IncidentSeverity = 'critical' | 'active' | 'stale';

export type IncidentCategory =
  | 'police'
  | 'fire'
  | 'medical'
  | 'traffic'
  | 'assault'
  | 'theft'
  | 'missing'
  | 'other';

export type IncidentUpdate = {
  id: string;
  timeAgo: string;
  text: string;
};

export type IncidentComment = {
  id: string;
  user: string;
  timeAgo: string;
  text: string;
  likes: number;
};

export type Incident = {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  address: string;
  neighborhood: string;
  distanceMi: number;
  timeAgo: string;
  updatedAgo: string;
  viewers: number;
  isLive: boolean;
  summary: string;
  /** 0–1 map position within the fake canvas */
  mapX: number;
  mapY: number;
  updates: IncidentUpdate[];
  comments: IncidentComment[];
};

export type TabId = 'map' | 'alerts' | 'broadcast' | 'you';
