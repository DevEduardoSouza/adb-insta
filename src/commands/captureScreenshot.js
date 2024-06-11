import client from '../utils/adbClient.js';
import fs from 'fs';
import { promisify } from 'util';
import stream from 'stream';

const readAll = promisify(stream.finished);

async function captureScreenshot(deviceId, filePath) {
  try {
    const conn = await client.screencap(deviceId);
    const fileStream = fs.createWriteStream(filePath);
    conn.pipe(fileStream);
    await readAll(conn);
    console.log(`Captura de tela salva em ${filePath}`);
  } catch (err) {
    console.error("Erro ao capturar tela:", err);
  }
}

export default captureScreenshot;
