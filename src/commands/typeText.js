import client from '../utils/adbClient.js';
import { promisify } from 'util';
import stream from 'stream';

const readAll = promisify(stream.finished);

async function typeText(deviceId, text) {
  const command = `input text "${text}"`;
  try {
    const conn = await client.shell(deviceId, command);
    await readAll(conn);
    console.log(`Texto "${text}" digitado`);
  } catch (err) {
    console.error("Erro ao digitar texto:", err);
  }
}

export default typeText;
