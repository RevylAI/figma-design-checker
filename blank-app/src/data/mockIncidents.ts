import type { Incident } from '../types';

/** Mock SoHo / Lower Manhattan incident feed for the Citizen rebuild. */
export const USER_LOCATION = {
  neighborhood: 'SoHo',
  city: 'New York',
  label: 'SoHo, NYC',
  nearbyUsers: 8420,
};

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    title: 'Police Activity Near Broadway',
    category: 'police',
    severity: 'critical',
    address: '512 Broadway',
    neighborhood: 'SoHo',
    distanceMi: 0.2,
    timeAgo: '4m',
    updatedAgo: '1m',
    viewers: 1284,
    isLive: true,
    summary:
      'Multiple NYPD units responding. Streets partially blocked between Spring and Broome. No injuries reported yet.',
    mapX: 0.52,
    mapY: 0.38,
    updates: [
      {
        id: 'u1',
        timeAgo: '1m',
        text: 'Officers on scene. Pedestrians being redirected west on Spring St.',
      },
      {
        id: 'u2',
        timeAgo: '3m',
        text: 'Scanner: possible fight outside retail store. Additional unit requested.',
      },
      {
        id: 'u3',
        timeAgo: '4m',
        text: 'Alert created from 911 radio traffic.',
      },
    ],
    comments: [
      {
        id: 'c1',
        user: 'maya_k',
        timeAgo: '2m',
        text: 'Hearing sirens from my window on Greene. Looks busy.',
        likes: 18,
      },
      {
        id: 'c2',
        user: 'jordan.lee',
        timeAgo: '3m',
        text: 'Avoid Broadway if you can — traffic is stacked.',
        likes: 41,
      },
    ],
  },
  {
    id: 'inc-2',
    title: 'Structure Fire — Smoke Visible',
    category: 'fire',
    severity: 'critical',
    address: '88 Mercer St',
    neighborhood: 'SoHo',
    distanceMi: 0.4,
    timeAgo: '12m',
    updatedAgo: '3m',
    viewers: 3560,
    isLive: true,
    summary:
      'FDNY on scene for a reported fire in a commercial building. Heavy smoke reported from upper floors.',
    mapX: 0.34,
    mapY: 0.46,
    updates: [
      {
        id: 'u1',
        timeAgo: '3m',
        text: 'Ladder company opening roof. Nearby businesses evacuated.',
      },
      {
        id: 'u2',
        timeAgo: '8m',
        text: 'Smoke visible from Mercer & Spring. Water on the fire.',
      },
      {
        id: 'u3',
        timeAgo: '12m',
        text: '911 callers report smoke coming from 3rd floor.',
      },
    ],
    comments: [
      {
        id: 'c1',
        user: 'soho_watcher',
        timeAgo: '5m',
        text: 'Huge plume from my rooftop. Stay upwind.',
        likes: 92,
      },
    ],
  },
  {
    id: 'inc-3',
    title: 'Armed Robbery — Suspect Fled on Foot',
    category: 'theft',
    severity: 'critical',
    address: '120 Prince St',
    neighborhood: 'SoHo',
    distanceMi: 0.3,
    timeAgo: '28m',
    updatedAgo: '9m',
    viewers: 2104,
    isLive: false,
    summary:
      'Witnesses reported a robbery at a boutique. Suspect described as wearing a black hoodie, last seen running toward West Broadway.',
    mapX: 0.62,
    mapY: 0.52,
    updates: [
      {
        id: 'u1',
        timeAgo: '9m',
        text: 'NYPD canvassing with photos. No shots fired.',
      },
      {
        id: 'u2',
        timeAgo: '18m',
        text: 'Store employees OK. Merchandise stolen.',
      },
      {
        id: 'u3',
        timeAgo: '28m',
        text: 'Alert created.',
      },
    ],
    comments: [
      {
        id: 'c1',
        user: 'alexr',
        timeAgo: '11m',
        text: 'Saw someone sprinting past Crosby around then.',
        likes: 27,
      },
    ],
  },
  {
    id: 'inc-4',
    title: 'Multi-Vehicle Crash Blocking Lane',
    category: 'traffic',
    severity: 'active',
    address: 'Houston St & West Broadway',
    neighborhood: 'Hudson Square',
    distanceMi: 0.6,
    timeAgo: '41m',
    updatedAgo: '15m',
    viewers: 640,
    isLive: false,
    summary:
      'Three-car collision. Right lane closed westbound. EMS evaluating one driver.',
    mapX: 0.28,
    mapY: 0.68,
    updates: [
      {
        id: 'u1',
        timeAgo: '15m',
        text: 'Tow trucks arriving. Expect delays through Canal.',
      },
      {
        id: 'u2',
        timeAgo: '41m',
        text: 'Crash reported; police directing traffic.',
      },
    ],
    comments: [],
  },
  {
    id: 'inc-5',
    title: 'Medical Emergency — Person Down',
    category: 'medical',
    severity: 'active',
    address: 'Spring St Station',
    neighborhood: 'SoHo',
    distanceMi: 0.5,
    timeAgo: '55m',
    updatedAgo: '22m',
    viewers: 318,
    isLive: false,
    summary:
      'EMS treating an unresponsive person on the platform. Trains briefly held.',
    mapX: 0.72,
    mapY: 0.42,
    updates: [
      {
        id: 'u1',
        timeAgo: '22m',
        text: 'Patient transported. Service resuming.',
      },
      {
        id: 'u2',
        timeAgo: '55m',
        text: 'EMS requested at Spring St (C/E).',
      },
    ],
    comments: [
      {
        id: 'c1',
        user: 'commuter_nyc',
        timeAgo: '30m',
        text: 'Platform was cleared quickly. Hope they are OK.',
        likes: 14,
      },
    ],
  },
  {
    id: 'inc-6',
    title: 'Missing Teen — Last Seen Near Canal',
    category: 'missing',
    severity: 'active',
    address: 'Canal St & Broadway',
    neighborhood: 'Chinatown',
    distanceMi: 0.9,
    timeAgo: '2h',
    updatedAgo: '35m',
    viewers: 4890,
    isLive: false,
    summary:
      'Family seeking 16-year-old last seen wearing a blue backpack and gray hoodie. If spotted, call 911.',
    mapX: 0.78,
    mapY: 0.78,
    updates: [
      {
        id: 'u1',
        timeAgo: '35m',
        text: 'Tip line open. Citizen users asked to keep eyes out.',
      },
      {
        id: 'u2',
        timeAgo: '2h',
        text: 'Missing person alert posted by family.',
      },
    ],
    comments: [
      {
        id: 'c1',
        user: 'neighborly',
        timeAgo: '40m',
        text: 'Sharing this in my building group chat.',
        likes: 63,
      },
    ],
  },
  {
    id: 'inc-7',
    title: 'Assault Outside Bar — Suspect Detained',
    category: 'assault',
    severity: 'stale',
    address: '210 Lafayette St',
    neighborhood: 'Nolita',
    distanceMi: 0.7,
    timeAgo: '3h',
    updatedAgo: '1h',
    viewers: 902,
    isLive: false,
    summary:
      'Altercation outside a bar earlier this evening. One person detained. Area cleared.',
    mapX: 0.58,
    mapY: 0.22,
    updates: [
      {
        id: 'u1',
        timeAgo: '1h',
        text: 'Suspect in custody. No further threat.',
      },
      {
        id: 'u2',
        timeAgo: '3h',
        text: 'Police responding to assault call.',
      },
    ],
    comments: [],
  },
  {
    id: 'inc-8',
    title: 'Gas Leak Smell Reported',
    category: 'other',
    severity: 'stale',
    address: '45 Crosby St',
    neighborhood: 'SoHo',
    distanceMi: 0.35,
    timeAgo: '5h',
    updatedAgo: '3h',
    viewers: 211,
    isLive: false,
    summary:
      'Con Edison and FDNY investigated a reported gas odor. Area ventilated; all clear.',
    mapX: 0.44,
    mapY: 0.58,
    updates: [
      {
        id: 'u1',
        timeAgo: '3h',
        text: 'All clear — no leak found at main.',
      },
      {
        id: 'u2',
        timeAgo: '5h',
        text: 'Odor reported by residents.',
      },
    ],
    comments: [],
  },
];

export function getIncidentById(id: string): Incident | undefined {
  return MOCK_INCIDENTS.find((i) => i.id === id);
}

export function getCriticalNearby(): Incident[] {
  return MOCK_INCIDENTS.filter(
    (i) => i.severity === 'critical' && i.distanceMi <= 0.5,
  ).sort((a, b) => a.distanceMi - b.distanceMi);
}

export const MOCK_ALERT_PREFS = [
  { id: 'major', label: 'Major incidents only', enabled: false },
  { id: 'crime', label: 'Crime & police', enabled: true },
  { id: 'fire', label: 'Fire & medical', enabled: true },
  { id: 'traffic', label: 'Traffic & road closures', enabled: true },
  { id: 'missing', label: 'Missing persons', enabled: true },
  { id: 'helicopter', label: 'Helicopter overhead', enabled: false },
];
