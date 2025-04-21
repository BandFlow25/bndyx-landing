// Import Jest DOM extensions
import '@testing-library/jest-dom';

// Mock the next/router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock Firebase
jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(() => ({})),
    getApps: jest.fn(() => []),
  };
});

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => ({
      signInWithEmailAndPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChanged: jest.fn(),
    })),
  };
});

jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({})),
    doc: jest.fn(() => ({})),
    getDocs: jest.fn(() => ({ forEach: jest.fn() })),
    updateDoc: jest.fn(),
  };
});
