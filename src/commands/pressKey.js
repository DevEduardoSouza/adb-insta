import client from '../utils/adbClient.js';
import { promisify } from 'util';
import stream from 'stream';

const readAll = promisify(stream.finished);

async function pressKey(deviceId, keyCode) {
  const command = `input keyevent ${keyCode}`;
  try {
    const conn = await client.shell(deviceId, command);
    await readAll(conn);
    console.log(`Tecla com keycode ${keyCode} pressionada`);
  } catch (err) {
    console.error("Erro ao pressionar tecla:", err);
  }
}

export default pressKey;
