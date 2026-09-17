/**
 * Landslide ML Feature Extractor
 * Extracts and normalizes feature vectors for the AI-based
 * Landslide Early Warning Engine from raw sensor telemetry.
 *
 * Author: anjalihere26
 */

export interface RawSensorTelemetry {
  rainfallMmPerHour: number;
  cumulativeRainfall7dMm: number;
  soilSaturationPercent: number;
  groundDisplacementMmPerYear: number;
  slopeAngleDegrees: number;
  elevationMeters: number;
  temperatureCelsius: number;
  geologySoilType: 'CLAY' | 'SAND' | 'LOAM' | 'ROCK' | 'MIXED';
  historicalLandslideCount: number; // in the past 10 years within 5 km radius
}

export interface LandslideFeatureVector {
  fRainfall: number;          // 0–1
  fCumulative: number;        // 0–1
  fSoilSaturation: number;    // 0–1
  fDisplacement: number;      // 0–1
  fSlope: number;             // 0–1
  fElevation: number;         // 0–1
  fTemperature: number;       // 0–1
  fGeology: number;           // 0–1 (categorical encoding)
  fHistory: number;           // 0–1
  weightedScore: number;      // Final 0–100 risk score
}

// Geology susceptibility mapping (higher = more susceptible)
const GEOLOGY_SUSCEPTIBILITY: Record<RawSensorTelemetry['geologySoilType'], number> = {
  CLAY:  0.90,
  LOAM:  0.70,
  MIXED: 0.60,
  SAND:  0.45,
  ROCK:  0.20,
};

// Feature weights (must sum to 1.0)
const WEIGHTS = {
  fRainfall:       0.22,
  fCumulative:     0.18,
  fSoilSaturation: 0.16,
  fDisplacement:   0.14,
  fSlope:          0.12,
  fElevation:      0.05,
  fTemperature:    0.04,
  fGeology:        0.05,
  fHistory:        0.04,
};

/**
 * Clamps a value between 0 and 1.
 */
function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Extracts normalized feature vector from raw sensor telemetry.
 * Each feature is normalized to [0, 1] using domain-specific
 * thresholds derived from Himalayan geological research.
 */
export function extractFeatureVector(telemetry: RawSensorTelemetry): LandslideFeatureVector {
  const fRainfall       = clamp(telemetry.rainfallMmPerHour / 50.0);
  const fCumulative     = clamp(telemetry.cumulativeRainfall7dMm / 350.0);
  const fSoilSaturation = clamp(telemetry.soilSaturationPercent / 100.0);
  const fDisplacement   = clamp(telemetry.groundDisplacementMmPerYear / 100.0);
  const fSlope          = clamp(telemetry.slopeAngleDegrees / 60.0);
  const fElevation      = clamp(telemetry.elevationMeters / 5000.0);
  // Freeze–thaw cycling near 0°C accelerates slope failure
  const fTemperature    = clamp(1.0 - Math.abs(telemetry.temperatureCelsius) / 30.0);
  const fGeology        = GEOLOGY_SUSCEPTIBILITY[telemetry.geologySoilType];
  const fHistory        = clamp(telemetry.historicalLandslideCount / 20.0);

  const weightedScore = Math.round(
    (fRainfall       * WEIGHTS.fRainfall +
     fCumulative     * WEIGHTS.fCumulative +
     fSoilSaturation * WEIGHTS.fSoilSaturation +
     fDisplacement   * WEIGHTS.fDisplacement +
     fSlope          * WEIGHTS.fSlope +
     fElevation      * WEIGHTS.fElevation +
     fTemperature    * WEIGHTS.fTemperature +
     fGeology        * WEIGHTS.fGeology +
     fHistory        * WEIGHTS.fHistory) * 100
  );

  return {
    fRainfall,
    fCumulative,
    fSoilSaturation,
    fDisplacement,
    fSlope,
    fElevation,
    fTemperature,
    fGeology,
    fHistory,
    weightedScore,
  };
}

/**
 * Returns the top contributing factors (features with highest
 * weighted contribution) for explainability display in the UI.
 */
export function getTopContributingFactors(
  vector: LandslideFeatureVector,
  topN = 4
): { factor: string; contribution: number; percentage: number }[] {
  const contributions = [
    { factor: 'Hourly Rainfall Intensity',        contribution: vector.fRainfall       * WEIGHTS.fRainfall },
    { factor: '7-Day Cumulative Rainfall',         contribution: vector.fCumulative     * WEIGHTS.fCumulative },
    { factor: 'Soil Saturation Level',             contribution: vector.fSoilSaturation * WEIGHTS.fSoilSaturation },
    { factor: 'Ground Displacement (InSAR)',       contribution: vector.fDisplacement   * WEIGHTS.fDisplacement },
    { factor: 'Slope Angle',                       contribution: vector.fSlope          * WEIGHTS.fSlope },
    { factor: 'Elevation',                         contribution: vector.fElevation      * WEIGHTS.fElevation },
    { factor: 'Freeze-Thaw Temperature Cycling',   contribution: vector.fTemperature    * WEIGHTS.fTemperature },
    { factor: 'Soil Geology Susceptibility',       contribution: vector.fGeology        * WEIGHTS.fGeology },
    { factor: 'Historical Landslide Frequency',    contribution: vector.fHistory        * WEIGHTS.fHistory },
  ];

  const total = contributions.reduce((sum, c) => sum + c.contribution, 0);

  return contributions
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, topN)
    .map((c) => ({
      factor: c.factor,
      contribution: Math.round(c.contribution * 100) / 100,
      percentage: total > 0 ? Math.round((c.contribution / total) * 100) : 0,
    }));
}
