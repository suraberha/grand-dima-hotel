// db.js
// -----------------------------------------------------------------
// This is our "database". Instead of a real SQL database, we store
// data in plain .json files inside backend/data/. Each function
// below reads or writes one of those files safely.
//
// Why this is OK for a beginner project:
//  - No database software to install
//  - You can open the .json files yourself and literally see the data
//  - Easy to swap for a real database (like SQLite or MongoDB) later,
//    because all the file-reading logic lives in ONE place (this file).
// -----------------------------------------------------------------

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

// Make sure a given .json file exists; if not, create it with an empty array.
function ensureFile(fileName, defaultValue = []) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
  return filePath;
}

// Read all records from a JSON file. Returns an array.
function readData(fileName) {
  const filePath = ensureFile(fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Could not parse ${fileName}, returning empty array.`, err);
    return [];
  }
}

// Overwrite a JSON file with a new array of records.
function writeData(fileName, data) {
  const filePath = ensureFile(fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Add one new record to a JSON file and return the record (with its new id).
function addRecord(fileName, record) {
  const data = readData(fileName);
  const newRecord = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...record,
  };
  data.push(newRecord);
  writeData(fileName, data);
  return newRecord;
}

// Update one record (by id) inside a JSON file, e.g. to change its status.
function updateRecord(fileName, id, changes) {
  const data = readData(fileName);
  const index = data.findIndex((item) => item.id === id);
  if (index === -1) return null;
  data[index] = { ...data[index], ...changes };
  writeData(fileName, data);
  return data[index];
}

// Delete one record (by id) from a JSON file.
function deleteRecord(fileName, id) {
  const data = readData(fileName);
  const filtered = data.filter((item) => item.id !== id);
  writeData(fileName, filtered);
  return filtered.length !== data.length; // true if something was deleted
}

// Generates a short, human-friendly ID guests can use as a reference number,
// e.g. "GD-7F3K9A". Easy to read over the phone, easy to type in an email.
function generateId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789"; // no O/0/I to avoid confusion
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `GD-${code}`;
}

module.exports = {
  readData,
  writeData,
  addRecord,
  updateRecord,
  deleteRecord,
};
