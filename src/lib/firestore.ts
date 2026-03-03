import {
    collection,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    where,
    type QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

export interface SavedWebsite {
    id: string;
    htmlContent: string;
    themeName: string;
    createdAt: string;
}

export async function saveWebsite(userId: string, htmlContent: string, themeName: string): Promise<string> {
    if (!userId) throw new Error("User ID is required to save a website.");
    
    const websitesRef = collection(db, `users/${userId}/websites`);
    const docRef = await addDoc(websitesRef, {
        htmlContent,
        themeName,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function getWebsites(userId: string): Promise<SavedWebsite[]> {
    if (!userId) return [];
    
    const websitesRef = collection(db, `users/${userId}/websites`);
    const snapshot = await getDocs(websitesRef);
    
    const websites = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as SavedWebsite));
    
    return websites.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function deleteWebsite(userId: string, websiteId: string): Promise<void> {
    if (!userId || !websiteId) throw new Error("User ID and Website ID are required.");
    
    const websiteDocRef = doc(db, `users/${userId}/websites`, websiteId);
    await deleteDoc(websiteDocRef);
}


// --- Domain and Hosting Management ---

export async function setDomainMapping(domainName: string, websiteId: string, userId: string): Promise<void> {
    const mappingRef = doc(db, 'domains', domainName);
    await setDoc(mappingRef, { userId, websiteId });
}

export async function getWebsiteForDomain(domainName: string): Promise<SavedWebsite | null> {
    const mappingRef = doc(db, 'domains', domainName);
    const mappingSnap = await getDoc(mappingRef);

    if (!mappingSnap.exists()) {
        console.log(`No domain mapping found for ${domainName}`);
        return null;
    }

    const { userId, websiteId } = mappingSnap.data();
    
    const websiteRef = doc(db, `users/${userId}/websites`, websiteId);
    const websiteSnap = await getDoc(websiteRef);

    if (!websiteSnap.exists()) {
        console.log(`Website ${websiteId} not found for user ${userId}`);
        return null;
    }
    
    return { id: websiteSnap.id, ...websiteSnap.data() } as SavedWebsite;
}

export async function getDomainMappingsForUser(userId: string): Promise<Array<{ domain: string; websiteId: string }>> {
    const domainsRef = collection(db, 'domains');
    const q = query(domainsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
        domain: doc.id,
        websiteId: doc.data().websiteId
    }));
}
