/**
 * Avalanche Risk Calculator — Extended Model
 * Computes composite avalanche risk score from snowpack,
 * temperature, wind, and slope parameters.
 *
 * Author: anushkajadhav1776-boo
 */

export type AvalancheRiskLevel = 'LOW' | 'MODERATE' | 'CONSIDERABLE' | 'HIGH' | 'EXTREME';

export interface AvalancheInputParams {
  snowpackDepthCm: number;       // Total snowpack depth in cm
  newSnowfall24hCm: number;      // Fresh snowfall in last 24 hours (cm)
  temperatureCelsius: number;    // Current air temperature (°C)
  windSpeedKmh: number;          // Wind speed in km/h
  aspectDegrees: number;         // Slope aspect (0–360°, N=0/360)
  slopeDegrees: number;          // Slope angle (degrees)
  weakLayerDetected: boolean;    // Whether a weak buried layer was detected
  recentAvalancheActivity: boolean; // Recent natural release observed
}

export interface AvalancheRiskResult {
  score: number;                 // 0–100
  level: AvalancheRiskLevel;
  contributingFactors: string[];
  recommendation: string;
}

const RISK_THRESHOLDS: { min: number; level: AvalancheRiskLevel; recommendation: string }[] = [
  { min: 80, level: 'EXTREME',       recommendation: 'All travel in avalanche terrain PROHIBITED. Evacuate risk zones immediately.' },
  { min: 60, level: 'HIGH',          recommendation: 'Very dangerous. Avoid all steep slopes. Rescue teams on high alert.' },
  { min: 40, level: 'CONSIDERABLE',  recommendation: 'Dangerous conditions on steep slopes. Travel with caution and equipment.' },
  { min: 20, level: 'MODERATE',      recommendation: 'Heightened caution on steep or wind-loaded slopes.' },
  { min: 0,  level: 'LOW',           recommendation: 'Generally safe conditions. Standard precautions apply.' },
];

function getAspectFactor(aspectDegrees: number): number {
  // North/NE/NW facing slopes retain snow longer → higher risk
  const northFacing = aspectDegrees <= 45 || aspectDegrees >= 315;
  const eastFacing  = aspectDegrees > 45 && aspectDegrees <= 135;
  if (northFacing) return 1.25;
  if (eastFacing)  return 1.10;
  return 0.90;
}

/**
 * Calculates composite avalanche risk score (0–100) using a
 * weighted multi-factor model based on EAWS (European Avalanche
 * Warning Service) guidelines adapted for the Himalayan context.
 */
export function calculateAvalancheRisk(params: AvalancheInputParams): AvalancheRiskResult {
  const factors: string[] = [];
  let score = 0;

  // --- Snowpack depth contribution (max 20 pts) ---
  const depthScore = Math.min(20, (params.snowpackDepthCm / 300) * 20);
  score += depthScore;
  if (params.snowpackDepthCm > 150) factors.push(`Deep snowpack (${params.snowpackDepthCm} cm)`);

  // --- Fresh snowfall contribution (max 25 pts) ---
  const freshScore = Math.min(25, (params.newSnowfall24hCm / 60) * 25);
  score += freshScore;
  if (params.newSnowfall24hCm > 20) factors.push(`Heavy fresh snowfall (${params.newSnowfall24hCm} cm / 24h)`);

  // --- Temperature contribution (max 15 pts) ---
  // Near-zero temps most dangerous (melt-freeze crust → weak layer)
  const tempScore = params.temperatureCelsius >= -3 && params.temperatureCelsius <= 2
    ? 15
    : Math.max(0, 15 - Math.abs(params.temperatureCelsius + 1) * 2);
  score += tempScore;
  if (params.temperatureCelsius > -2 && params.temperatureCelsius < 3) {
    factors.push(`Near-freezing temperature (${params.temperatureCelsius}°C)`);
  }

  // --- Wind contribution (max 15 pts) ---
  const windScore = Math.min(15, (params.windSpeedKmh / 80) * 15);
  score += windScore;
  if (params.windSpeedKmh > 40) factors.push(`High wind speed (${params.windSpeedKmh} km/h) causing drift`);

  // --- Slope angle contribution (max 15 pts) ---
  // 30–45° is the prime avalanche start-zone range
  const inPrimeZone = params.slopeDegrees >= 28 && params.slopeDegrees <= 50;
  const slopeScore = inPrimeZone ? 15 : Math.max(0, 15 - Math.abs(params.slopeDegrees - 38) * 0.8);
  score += slopeScore;
  if (inPrimeZone) factors.push(`Slope angle in prime release zone (${params.slopeDegrees}°)`);

  // --- Aspect factor multiplier ---
  score *= getAspectFactor(params.aspectDegrees);

  // --- Weak layer bonus (+10 pts) ---
  if (params.weakLayerDetected) {
    score += 10;
    factors.push('Buried weak layer detected (crystal instability)');
  }

  // --- Recent activity bonus (+10 pts) ---
  if (params.recentAvalancheActivity) {
    score += 10;
    factors.push('Recent natural avalanche activity observed nearby');
  }

  score = Math.min(100, Math.round(score));

  const threshold = RISK_THRESHOLDS.find((t) => score >= t.min)!;
  return {
    score,
    level: threshold.level,
    contributingFactors: factors,
    recommendation: threshold.recommendation,
  };
}
