import { promises as fs } from "fs";
import path from "path";

// Basit bir kuyruk sistemi
let queue = [];
let isProcessing = false;

async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;
  
  const { filePath, data, resolve, reject } = queue.shift();
  
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    resolve();
  } catch (error) {
    reject(error);
  } finally {
    isProcessing = false;
    processQueue();
  }
}

export async function writeFileSafe(filePath, data) {
  return new Promise((resolve, reject) => {
    queue.push({ filePath, data, resolve, reject });
    processQueue();
  });
}

export async function readFileSafe(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}