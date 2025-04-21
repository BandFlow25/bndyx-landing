// Import the module under test
import * as firebaseModule from '../firebase';

// Mock the Firebase dependencies
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn().mockReturnValue({}),
  getApps: jest.fn().mockReturnValue([]),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({}),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn().mockReturnValue({}),
}));

describe('Firebase Client Module', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // Test that the module exports the expected functions
  test('exports the expected functions', () => {
    expect(firebaseModule.initializeFirebase).toBeDefined();
    expect(firebaseModule.getFirebaseAuth).toBeDefined();
    expect(firebaseModule.getFirebaseFirestore).toBeDefined();
  });

  // Basic test for the Firebase initialization
  test('initializes Firebase when no apps exist', () => {
    // Call the function
    const result = firebaseModule.initializeFirebase();
    
    // Verify the function returns an object with expected properties
    expect(result).toHaveProperty('firebaseApp');
    expect(result).toHaveProperty('auth');
    expect(result).toHaveProperty('firestore');
  });
  
  // Test for getFirebaseAuth
  test('getFirebaseAuth returns an auth instance', () => {
    const auth = firebaseModule.getFirebaseAuth();
    expect(auth).toBeDefined();
  });
  
  // Test for getFirebaseFirestore
  test('getFirebaseFirestore returns a firestore instance', () => {
    const firestore = firebaseModule.getFirebaseFirestore();
    expect(firestore).toBeDefined();
  });
});
