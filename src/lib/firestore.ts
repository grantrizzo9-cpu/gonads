'use client';
// This is a mock Firestore implementation.
// In a real app, you would import from 'firebase/firestore'
// and use a real Firebase instance.

// Mock functions to simulate Firestore behavior
const MOCK_DB: { [key: string]: any[] } = {};

const collection = (db: any, path: string) => {
    return {
        path: path,
    };
};

const addDoc = async (collectionRef: { path: string }, data: any) => {
    if (!MOCK_DB[collectionRef.path]) {
        MOCK_DB[collectionRef.path] = [];
    }
    const id = `mock_id_${Date.now()}`;
    MOCK_DB[collectionRef.path].push({ id, ...data });
    console.log("Mock Firestore: Document added to", collectionRef.path, { id, ...data });
    return { id };
};

const serverTimestamp = () => new Date().toISOString();


export async function saveWebsite(userId: string, htmlContent: string, themeName: string): Promise<string> {
    if (!userId) {
        throw new Error("User ID is required to save a website.");
    }
    
    // In a real app, you would get the db instance from your firebase setup
    const db = {}; // Mock db object

    const websitesCollectionRef = collection(db, `/users/${userId}/websites`);
    
    const docRef = await addDoc(websitesCollectionRef, {
        htmlContent,
        themeName,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
}
