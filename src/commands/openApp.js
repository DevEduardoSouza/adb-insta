import client from '../utils/adbClient.js';
import { promisify } from 'util';
import stream from 'stream';

const readAll = promisify(stream.finished);

async function openApp(deviceId, packageName, activityName) {
  const command = `am start -n ${packageName}/${activityName}`;

  try {
    const conn = await client.shell(deviceId, command);
    // await readAll(conn);
    console.log(`Aplicativo ${packageName} iniciado com sucesso`);
  } catch (err) {
    console.error("Erro ao iniciar o aplicativo:", err);
  }
}

export default openApp;
