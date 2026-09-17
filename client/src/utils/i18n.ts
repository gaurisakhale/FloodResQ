export type Language = 
  | 'en' // English
  | 'hi' // Hindi
  | 'ne' // Nepali
  | 'bn' // Bengali
  | 'as' // Assamese
  | 'gu' // Gujarati
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'mr' // Marathi
  | 'or' // Odia
  | 'pa' // Punjabi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'ur' // Urdu
  | 'mni' // Manipuri
  | 'mizo'; // Mizo

const englishKeys = {
  systemTitle: 'FloodGuard',
  subtitle: 'Himalayan Flash Flood, Landslide & Disaster Risk Platform',
  navHome: 'Home',
  navDashboard: 'Live Risk Map',
  navSOS: 'Satellite SOS',
  navRescueConsole: 'Rescue Console',
  navAdmin: 'Admin & Sensors',
  navAlerts: 'Citizen Alerts',
  navAbout: 'Data & Methodology',
  reportEmergency: 'REPORT EMERGENCY SOS',
  liteModeOn: 'Lite Mode ON (Low Bandwidth)',
  liteModeOff: 'Standard Graphics Mode',
  liveRegionalStatus: 'Live Regional Risk Status',
  stationsOnline: 'Stations Online',
  activeIncidents: 'Active SOS Signals',
  highestRiskZone: 'Highest Risk Corridor',
  severeAlert: 'SEVERE FLASH FLOOD WARNING',
  evacuateNow: 'EVACUATE IMMEDIATELY TO DESIGNATED HIGH GROUND',
  predictiveOverlay: 'Predictive Risk Escalation Forecast',
  hoursAhead: 'Hours Forecast',
  satelliteMode: 'Satellite Direct Protocol',
  standardMode: 'Standard Cell Network',
  urgencyCritical: 'CRITICAL (Life Threatening)',
  urgencyHigh: 'HIGH (Rising Water Level)',
  urgencyMedium: 'MEDIUM (Trapped In House)',
  urgencyLow: 'LOW (Precautionary Evacuation)',
  sendSOS: 'TRANSMIT SATELLITE SOS',
  rescuePriority: 'Priority Score',
  assignTeam: 'Assign Team',
  status: 'Status',
  language: 'Language',
  
  navHillDashboard: 'Hill Area Risk',
  navSoilSaturation: 'Soil Saturation',
  navInSAR: 'InSAR Landslide',
  navLandslide: 'Landslide Warning',
  navAvalanche: 'Avalanche Radar',
  navWeather: 'AI Weather Forecast',
  navHazardMap: 'GIS Hazard Map',
  navFirstAidSOS: 'First Aid SOS',
  navTraining: 'Disaster Training',
  navGovernment: 'Gov Dashboard',
  navIntegration: 'Integration Status',
  firstAidTitle: 'Request Emergency First Aid Kit',
  firstAidDescription: 'Request emergency first-aid kits and medical assistance from the nearest configured Himalayan rescue center.',
  sendFirstAidSOS: 'Send First Aid SOS',
  requestFirstAidKit: 'REQUEST FIRST AID KIT',
  riskLow: 'LOW',
  riskModerate: 'MODERATE',
  riskHigh: 'HIGH',
  riskVeryHigh: 'VERY HIGH',
  riskCritical: 'CRITICAL',
  soilSaturationTitle: 'Soil Saturation Monitoring',
  inSARTitle: 'InSAR Ground Displacement',
  landslideTitle: 'Landslide Early Warning',
  avalancheTitle: 'Avalanche Monitoring Radar',
  weatherTitle: 'AI Weather Forecast',
  trainingTitle: 'Digital Disaster Training',
  safetyDisclaimer: 'This platform supports disaster awareness and emergency coordination. AI-generated or model-based risk estimates are advisory and should not replace official warnings from government disaster-management, meteorological, geological, or emergency-response authorities. In an emergency, follow instructions issued by authorized local agencies.'
};

const hindiKeys: typeof englishKeys = {
  ...englishKeys,
  subtitle: 'हिमालयी फ्लैश फ्लड, भूस्खलन और आपदा जोखिम मंच',
  navHome: 'होम',
  navDashboard: 'लाइव जोखिम मानचित्र',
  navSOS: 'सैटेलाइट एसओएस',
  navRescueConsole: 'रेस्क्यू कंसोल',
  navAdmin: 'एडमिन',
  navAlerts: 'नागरिक अलर्ट',
  navAbout: 'डेटा प्रणाली',
  reportEmergency: 'आपत्कालीन एसओएस भेजें',
  liveRegionalStatus: 'क्षेत्रीय जोखिम स्थिति',
  firstAidTitle: 'आपातकालीन प्राथमिक चिकित्सा किट का अनुरोध करें',
  firstAidDescription: 'निकटतम बचाव केंद्र से प्राथमिक चिकित्सा किट और चिकित्सा सहायता का अनुरोध करें।',
  sendFirstAidSOS: 'प्राथमिक चिकित्सा एसओएस भेजें',
  requestFirstAidKit: 'प्राथमिक चिकित्सा किट का अनुरोध करें',
  riskLow: 'निम्न',
  riskModerate: 'मध्यम',
  riskHigh: 'उच्च',
  riskVeryHigh: 'अत्यधिक उच्च',
  riskCritical: 'गंभीर',
  soilSaturationTitle: 'मिट्टी संतृप्ति निगरानी',
  inSARTitle: 'इनसार भू-विस्थापन निगरानी',
  landslideTitle: 'भूस्खलन पूर्व चेतावनी',
  avalancheTitle: 'हिमस्खलन निगरानी रडार',
  weatherTitle: 'एआई मौसम पूर्वानुमान',
  trainingTitle: 'डिजिटल आपदा प्रशिक्षण',
};

export const translations: Record<Language, Record<string, string>> = {
  en: englishKeys,
  hi: hindiKeys,
  ne: hindiKeys,
  bn: hindiKeys,
  as: hindiKeys,
  gu: englishKeys,
  kn: englishKeys,
  ml: englishKeys,
  mr: hindiKeys,
  or: englishKeys,
  pa: hindiKeys,
  ta: englishKeys,
  te: englishKeys,
  ur: hindiKeys,
  mni: englishKeys,
  mizo: englishKeys
};

export function getTranslation(lang: Language, key: string): string {
  return translations[lang]?.[key] || translations.en[key as keyof typeof englishKeys] || key;
}
