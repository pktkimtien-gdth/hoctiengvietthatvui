/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  doc, 
  writeBatch,
  query,
  where
} from 'firebase/firestore';
import { Resource, VideoLesson, GameItem, Quiz, StudentStats, QuizHistory } from '../types';

// The Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyC1dMdYno2nHsND6r_o7oxt1pU6f9yJkOc",
  authDomain: "hoctiengvietthatvui.firebaseapp.com",
  projectId: "hoctiengvietthatvui",
  storageBucket: "hoctiengvietthatvui.firebasestorage.app",
  messagingSenderId: "905589201919",
  appId: "1:905589201919:web:099cc720af7e5602c125ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
export type { User };

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
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

// Error handling in accordance with Firebase Skill guidelines
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
    },
    operationType,
    path
  };
  console.warn('Firestore Warning (falling back to Sandbox Mode): ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper: Seed Firestore database if it is empty
export async function seedDatabaseIfEmpty(
  initialResources: Resource[],
  initialVideos: VideoLesson[],
  initialGames: GameItem[],
  initialQuizzes: Quiz[]
) {
  try {
    const resSnap = await getDocs(collection(db, 'resources'));
    if (resSnap.empty) {
      console.log('Seeding initial resources...');
      for (const item of initialResources) {
        await setDoc(doc(db, 'resources', item.id), item);
      }
    }

    const vidSnap = await getDocs(collection(db, 'videos'));
    if (vidSnap.empty) {
      console.log('Seeding initial videos...');
      for (const item of initialVideos) {
        await setDoc(doc(db, 'videos', item.id), item);
      }
    }

    const gameSnap = await getDocs(collection(db, 'games'));
    if (gameSnap.empty) {
      console.log('Seeding initial games...');
      for (const item of initialGames) {
        await setDoc(doc(db, 'games', item.id), item);
      }
    }

    const quizSnap = await getDocs(collection(db, 'quizzes'));
    if (quizSnap.empty) {
      console.log('Seeding initial quizzes...');
      for (const item of initialQuizzes) {
        await setDoc(doc(db, 'quizzes', item.id), item);
      }
    }
  } catch (error) {
    console.warn('Firestore seeding failed, using offline mock data: ', error);
  }
}

// --- RESOURCES API ---
export async function fetchResourcesFromDb(): Promise<Resource[]> {
  const path = 'resources';
  try {
    const snap = await getDocs(collection(db, path));
    const items: Resource[] = [];
    snap.forEach((doc) => {
      items.push({ ...doc.data() as Resource, id: doc.id });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveResourceToDb(resource: Resource): Promise<void> {
  const path = `resources/${resource.id}`;
  try {
    await setDoc(doc(db, 'resources', resource.id), resource);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteResourceFromDb(id: string): Promise<void> {
  const path = `resources/${id}`;
  try {
    await deleteDoc(doc(db, 'resources', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- VIDEOS API ---
export async function fetchVideosFromDb(): Promise<VideoLesson[]> {
  const path = 'videos';
  try {
    const snap = await getDocs(collection(db, path));
    const items: VideoLesson[] = [];
    snap.forEach((doc) => {
      items.push({ ...doc.data() as VideoLesson, id: doc.id });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveVideoToDb(video: VideoLesson): Promise<void> {
  const path = `videos/${video.id}`;
  try {
    await setDoc(doc(db, 'videos', video.id), video);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteVideoFromDb(id: string): Promise<void> {
  const path = `videos/${id}`;
  try {
    await deleteDoc(doc(db, 'videos', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- GAMES API ---
export async function fetchGamesFromDb(): Promise<GameItem[]> {
  const path = 'games';
  try {
    const snap = await getDocs(collection(db, path));
    const items: GameItem[] = [];
    snap.forEach((doc) => {
      items.push({ ...doc.data() as GameItem, id: doc.id });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveGameToDb(game: GameItem): Promise<void> {
  const path = `games/${game.id}`;
  try {
    await setDoc(doc(db, 'games', game.id), game);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteGameFromDb(id: string): Promise<void> {
  const path = `games/${id}`;
  try {
    await deleteDoc(doc(db, 'games', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- QUIZZES API ---
export async function fetchQuizzesFromDb(): Promise<Quiz[]> {
  const path = 'quizzes';
  try {
    const snap = await getDocs(collection(db, path));
    const items: Quiz[] = [];
    snap.forEach((doc) => {
      items.push({ ...doc.data() as Quiz, id: doc.id });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveQuizToDb(quiz: Quiz): Promise<void> {
  const path = `quizzes/${quiz.id}`;
  try {
    await setDoc(doc(db, 'quizzes', quiz.id), quiz);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteQuizFromDb(id: string): Promise<void> {
  const path = `quizzes/${id}`;
  try {
    await deleteDoc(doc(db, 'quizzes', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- ANALYTICS / STATS API ---
export async function fetchStatsFromDb(userId: string): Promise<StudentStats | null> {
  const path = `stats/${userId}`;
  try {
    const snap = await getDocs(query(collection(db, 'stats'), where('userId', '==', userId)));
    if (!snap.empty) {
      return snap.docs[0].data() as StudentStats;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveStatsToDb(userId: string, stats: StudentStats): Promise<void> {
  const path = `stats/${userId}`;
  try {
    await setDoc(doc(db, 'stats', userId), { ...stats, userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// --- QUIZ HISTORY API ---
export async function fetchQuizHistoryFromDb(): Promise<QuizHistory[]> {
  const path = 'quizHistory';
  try {
    const snap = await getDocs(collection(db, path));
    const items: QuizHistory[] = [];
    snap.forEach((doc) => {
      items.push({ ...doc.data() as QuizHistory, id: doc.id });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveQuizHistoryToDb(history: QuizHistory): Promise<void> {
  const path = `quizHistory/${history.id}`;
  try {
    await setDoc(doc(db, 'quizHistory', history.id), history);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
