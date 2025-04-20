rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Keep all your existing helper functions
    function isBandMember(bandId) {
      return exists(/databases/$(database)/documents/bf_bands/$(bandId)/members/$(request.auth.uid));
    }
    
    function isBandAdmin(bandId) {
      return exists(/databases/$(database)/documents/bf_bands/$(bandId)/members/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/bf_bands/$(bandId)/members/$(request.auth.uid)).data.role == 'admin';
    }

    // Keep existing collection group queries for invites
    match /{path=**}/invites/{inviteId} {
      allow read: if true;
    }
    
  // Add the new bf_venues collection rules
match /bf_venues/{venueId} {
  allow read: if true;
  allow write: if true;  // This makes create, update, and delete all open
}

// Update bf_nonbands rules 
match /bf_nonbands/{bandId} {
  allow read: if true;
  allow write: if true;  // This makes create, update, and delete all open
}
match /bf_artists/{artistId} {
  allow read: if true;
  allow write: if true;  // This makes create, update, and delete all open
}

match /bf_events/{eventId} {
  allow read: if true;
 allow write: if true;
 allow create: if true;
}

    
    // Keep all your existing rules for bf_bands
    match /bf_bands/{bandId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && isBandAdmin(bandId);

      match /members/{memberId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && (
          (!exists(/databases/$(database)/documents/bf_bands/$(bandId)/members/**) && 
           memberId == request.auth.uid && 
           request.resource.data.role == 'admin') ||
          isBandAdmin(bandId) ||
          memberId == request.auth.uid
        );
        
        allow update: if request.auth != null && 
          ((request.auth.uid == memberId && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['displayName', 'instruments'])) || 
          isBandAdmin(bandId));
        allow delete: if request.auth != null && isBandAdmin(bandId);
      }

      match /invites/{inviteId} {
        allow read: if true;
        allow create, delete: if request.auth != null && isBandAdmin(bandId);
        allow update: if request.auth != null && (
          isBandAdmin(bandId) ||
          request.auth != null
        );
      }

      match /songs/{songId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && isBandMember(bandId);
        allow update: if request.auth != null && isBandMember(bandId);
        allow delete: if request.auth != null && isBandAdmin(bandId);
      }

      match /setlists/{setlistId} {
        allow read: if request.auth != null && isBandMember(bandId);
        allow write: if request.auth != null && isBandMember(bandId);
      }
    }

    // User profiles rules
    match /bf_users/{userId} {
      // Allow read access to authenticated users
      allow read: if request.auth != null;
      
      // Allow users to write to their own profile
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // Allow admin users to update roles
      allow update: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/bf_users/$(request.auth.uid)).data.roles.hasAny(['admin']) || 
         get(/databases/$(database)/documents/bf_users/$(request.auth.uid)).data.godMode == true) && 
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['roles']);
    }

    // Keep existing base songs collection rules
    match /bf_base_songs/{songId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}