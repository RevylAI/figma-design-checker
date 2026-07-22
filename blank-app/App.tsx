/**
 * Demo control: bump DEMO_STAGE from 0 → 10 for a piece-by-piece reveal.
 * Components under src/ stay loaded — only this number changes (fast hot reload).
 *
 *  0 blank canvas
 *  1 CITIZEN brand
 *  2 empty map
 *  3 markers
 *  4 location chrome
 *  5 status chip
 *  6 Nearby sheet
 *  7 first card
 *  8 full feed
 *  9 tabs
 * 10 full interactive app
 */
import { DemoApp } from './src/demo/DemoApp';

export const DEMO_STAGE = 10;

export default function App() {
  return <DemoApp stage={DEMO_STAGE} />;
}
