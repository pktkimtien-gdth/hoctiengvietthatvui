export const FIRESTORE_RULES_TEXT = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Default deny catch-all
    match /{document=**} {
      allow read, write: if false;
    }

    // Helper: is a valid ID pattern
    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\\\-]+$');
    }

    // --- RESOURCES RULES ---
    // Read: anyone can read resources
    // Write/Delete: restricted (for demo/development purposes, allowed if valid schema to support live teacher edits)
    match /resources/{resourceId} {
      allow read: if true;
      allow create, update: if isValidId(resourceId) 
        && request.resource.data.title is string 
        && request.resource.data.title.size() <= 200;
      allow delete: if true;
    }

    // --- VIDEOS RULES ---
    match /videos/{videoId} {
      allow read: if true;
      allow create, update: if isValidId(videoId)
        && request.resource.data.title is string
        && request.resource.data.title.size() <= 200;
      allow delete: if true;
    }

    // --- GAMES RULES ---
    match /games/{gameId} {
      allow read: if true;
      allow create, update: if isValidId(gameId)
        && request.resource.data.title is string
        && request.resource.data.title.size() <= 200;
      allow delete: if true;
    }

    // --- QUIZZES RULES ---
    match /quizzes/{quizId} {
      allow read: if true;
      allow create, update: if isValidId(quizId)
        && request.resource.data.title is string
        && request.resource.data.title.size() <= 200;
      allow delete: if true;
    }

    // --- STATS RULES ---
    // Student stats are read/writeable by users to update their learning progress
    match /stats/{userId} {
      allow read, write: if true;
    }

    // --- QUIZ HISTORY RULES ---
    // Students nộp bài (submit quiz scores) which writes to history
    match /quizHistory/{historyId} {
      allow read, create, update: if true;
      allow delete: if false; // Students cannot delete history!
    }
  }
}`;
