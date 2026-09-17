/**
 * SOS Validation Service
 * Validates incoming SOS requests and enforces business rules
 * before processing by the EmergencyCommsService.
 *
 * Author: SwatiKharat93
 */

export interface SOSValidationResult {
  valid: boolean;
  errors: string[];
}

export interface RawSOSPayload {
  name?: string;
  phone?: string;
  location?: { lat: number; lng: number };
  injuryDescription?: string;
  headcount?: number;
  emergencyType?: string;
}

const VALID_EMERGENCY_TYPES = [
  'FLOOD',
  'LANDSLIDE',
  'AVALANCHE',
  'MEDICAL',
  'FIRE',
  'EARTHQUAKE',
  'RESCUE_NEEDED',
  'OTHER',
];

const MAX_HEADCOUNT = 500;
const MIN_HEADCOUNT = 1;
const PHONE_REGEX = /^[6-9]\d{9}$/; // Indian mobile number format

/**
 * Validates an incoming SOS request payload.
 * Returns a SOSValidationResult indicating whether the request is
 * valid and any associated error messages.
 */
export function validateSOSRequest(payload: RawSOSPayload): SOSValidationResult {
  const errors: string[] = [];

  // Name validation
  if (!payload.name || payload.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters.');
  }

  // Phone validation
  if (!payload.phone) {
    errors.push('Phone number is required.');
  } else if (!PHONE_REGEX.test(payload.phone.replace(/\s+/g, ''))) {
    errors.push('Phone number must be a valid 10-digit Indian mobile number.');
  }

  // Location validation
  if (!payload.location) {
    errors.push('Location (lat/lng) is required for SOS dispatch.');
  } else {
    const { lat, lng } = payload.location;
    if (lat < 8.0 || lat > 37.6 || lng < 68.0 || lng > 97.4) {
      errors.push('Location coordinates appear to be outside India. Please verify.');
    }
  }

  // Headcount validation
  if (payload.headcount === undefined || payload.headcount === null) {
    errors.push('Headcount (number of people affected) is required.');
  } else if (
    payload.headcount < MIN_HEADCOUNT ||
    payload.headcount > MAX_HEADCOUNT
  ) {
    errors.push(
      `Headcount must be between ${MIN_HEADCOUNT} and ${MAX_HEADCOUNT}.`
    );
  }

  // Emergency type validation
  if (!payload.emergencyType) {
    errors.push('Emergency type is required.');
  } else if (!VALID_EMERGENCY_TYPES.includes(payload.emergencyType.toUpperCase())) {
    errors.push(
      `Invalid emergency type. Must be one of: ${VALID_EMERGENCY_TYPES.join(', ')}.`
    );
  }

  // Injury description
  if (payload.injuryDescription && payload.injuryDescription.length > 1000) {
    errors.push('Injury description must not exceed 1000 characters.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Determines the priority level of an SOS request based on
 * headcount, emergency type, and injury severity keywords.
 */
export function calculateSOSPriority(payload: RawSOSPayload): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  const type = (payload.emergencyType || '').toUpperCase();
  const count = payload.headcount || 1;
  const desc = (payload.injuryDescription || '').toLowerCase();

  const criticalKeywords = ['unconscious', 'cardiac', 'drowning', 'trapped', 'bleeding heavily', 'not breathing'];
  const hasCriticalKeyword = criticalKeywords.some((kw) => desc.includes(kw));

  if (hasCriticalKeyword || count >= 50 || type === 'FLOOD' || type === 'AVALANCHE') {
    return 'CRITICAL';
  }
  if (count >= 10 || type === 'LANDSLIDE' || type === 'EARTHQUAKE') {
    return 'HIGH';
  }
  if (count >= 3 || type === 'MEDICAL' || type === 'FIRE') {
    return 'MEDIUM';
  }
  return 'LOW';
}
