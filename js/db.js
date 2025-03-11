// js/db.js
export let db;

export function initializeDB(callback) {
  const request = indexedDB.open("PayrollDB", 1);
  request.onerror = (event) => {
    console.error("Database error:", event.target.error);
  };
  request.onupgradeneeded = (event) => {
    db = event.target.result;
    const store = db.createObjectStore("employees", { keyPath: "id", autoIncrement: true });
    store.createIndex("nama", "nama", { unique: false });
  };
  request.onsuccess = (event) => {
    db = event.target.result;
    if (callback) callback();
  };
}
