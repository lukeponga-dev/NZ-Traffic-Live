import { collection, getDocs, query, where, doc, setDoc, getDocFromServer } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Incident } from "../types";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Mock data for seeding if empty
const mockIncidents: Incident[] = [
  {
    id: "inc-1",
    type: "Crash",
    severity: "Severe",
    status: "Active",
    description: "Multi-vehicle crash blocking two lanes. Expect major delays.",
    lat: -36.8509,
    lng: 174.7645,
    startTime: new Date(Date.now() - 3600000).toISOString(),
    updatedTime: new Date().toISOString(),
  },
  {
    id: "inc-2",
    type: "Roadworks",
    severity: "Minor",
    status: "Planned",
    description: "Stop/Go traffic management in place for resurfacing.",
    lat: -41.2865,
    lng: 174.7762,
    startTime: new Date(Date.now() - 86400000).toISOString(),
    updatedTime: new Date(Date.now() - 3600000).toISOString(),
  }
];

export async function fetchIncidents(lat?: number, lng?: number, radiusKm: number = 500): Promise<Incident[]> {
  const path = 'incidents';
  try {
    const q = query(collection(db, path));
    const querySnapshot = await getDocs(q);
    let incidents = querySnapshot.docs.map(doc => doc.data() as Incident);

    // If no incidents in DB, seed with mock data (only if admin/dev)
    if (incidents.length === 0) {
      console.log("No incidents found in Firestore, seeding mock data...");
      // In a real app, this would be a backend task or admin-only
      // For this demo, we'll return mock data but not seed automatically to avoid permission issues
      return mockIncidents;
    }

    if (lat === undefined || lng === undefined) {
      return incidents;
    }

    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;

    return incidents.filter(inc => {
      const dLat = toRad(inc.lat - lat);
      const dLng = toRad(inc.lng - lng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat)) * Math.cos(toRad(inc.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance <= radiusKm;
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
