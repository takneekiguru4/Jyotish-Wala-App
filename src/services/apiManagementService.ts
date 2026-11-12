export type ManagedApiModule =
  | 'panchang'
  | 'kundli'
  | 'milan'
  | 'tyohar'
  | 'location'
  | 'wordpress_blog'
  | 'custom';

export interface ManagedApiConfig {
  id: string;
  name: string;
  module: ManagedApiModule;
  moduleLabel: string;
  providerName: string;
  endpointUrl: string;
  apiKey: string;
  maskedEndpoint: string;
  maskedApiKey: string;
  authType: 'Bearer Token' | 'API Key Header' | 'Basic Auth' | 'Public / Internal Signed';
  httpMethod: 'GET' | 'POST';
  enabled: boolean;
  description: string;
  technicalNotes: string;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'error';
  lastTestMessage?: string;
}

export const API_MODULE_OPTIONS: { value: ManagedApiModule; label: string }[] = [
  { value: 'panchang', label: 'पंचांग एवं मुहूर्त गणना (Panchang API)' },
  { value: 'kundli', label: 'जन्मकुंडली एवं लग्न चक्र (Kundli API)' },
  { value: 'milan', label: 'अष्टकूट कुंडली मिलान (Kundli Milan API)' },
  { value: 'tyohar', label: 'व्रत एवं त्यौहार कैलेंडर (Tyohar API)' },
  { value: 'location', label: 'शहर एवं अक्षांश-देशांतर खोज (Location Geocoding API)' },
  { value: 'wordpress_blog', label: 'वेबसाइट ब्लॉग एवं लेख (WordPress REST API)' },
  { value: 'custom', label: 'अन्य / कस्टम ज्योतिष सेवा (Custom API)' }
];

export const API_AUTH_TYPE_OPTIONS: ManagedApiConfig['authType'][] = [
  'Bearer Token',
  'API Key Header',
  'Basic Auth',
  'Public / Internal Signed'
];

export async function fetchManagedApisFromVault(): Promise<ManagedApiConfig[]> {
  try {
    const res = await fetch('/api/admin/apis');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.apis)) {
        return data.apis;
      }
    }
  } catch (err) {
    console.error('Failed to fetch managed APIs from server vault:', err);
  }
  return [];
}

export async function saveManagedApiToVault(
  payload: Partial<ManagedApiConfig>
): Promise<ManagedApiConfig[]> {
  const res = await fetch('/api/admin/apis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error('Failed to save API configuration');
  }
  const data = await res.json();
  return Array.isArray(data.apis) ? data.apis : [];
}

export async function deleteManagedApiFromVault(id: string): Promise<ManagedApiConfig[]> {
  const res = await fetch(`/api/admin/apis/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error('Failed to delete API configuration');
  }
  const data = await res.json();
  return Array.isArray(data.apis) ? data.apis : [];
}

export async function resetManagedApisInVault(): Promise<ManagedApiConfig[]> {
  const res = await fetch('/api/admin/apis/reset', {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error('Failed to reset API vault');
  }
  const data = await res.json();
  return Array.isArray(data.apis) ? data.apis : [];
}

export async function testManagedApiConnection(
  id: string
): Promise<{ testedApi?: ManagedApiConfig; apis: ManagedApiConfig[] }> {
  const res = await fetch(`/api/admin/apis/${encodeURIComponent(id)}/test`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error('Failed to test API connection');
  }
  const data = await res.json();
  return {
    testedApi: data.testedApi,
    apis: Array.isArray(data.apis) ? data.apis : []
  };
}
