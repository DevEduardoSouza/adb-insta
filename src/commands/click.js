import client from '../utils/adbClient.js';
import { promisify } from 'util';
import stream from 'stream';

const readAll = promisify(stream.finished);

async function clickAtPosition(deviceId, x, y) {
  const command = `input tap ${x} ${y}`;
  try {
    const conn = await client.shell(deviceId, command);
    await readAll(conn);
    console.log(`Clique realizado na posição (${x}, ${y})`);
  } catch (err) {
    console.error("Erro ao realizar o clique:", err);
  }
}

export default clickAtPosition;
