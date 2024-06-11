import client from '../utils/adbClient.js';
import { promisify } from 'util';
import stream from 'stream';

const readAll = promisify(stream.finished);

async function listPackages(deviceId) {
  const command = 'pm list packages';
  try {
    const conn = await client.shell(deviceId, command);
    const outputBuffer = await new Promise((resolve, reject) => {
      let output = '';
      conn.on('data', (data) => output += data.toString());
      conn.on('end', () => resolve(output));
      conn.on('error', (err) => reject(err));
    });
    console.log(`Pacotes instalados:\n${outputBuffer}`);
  } catch (err) {
    console.error("Erro ao listar pacotes:", err);
  }
}

export default listPackages;
