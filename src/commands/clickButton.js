import client from "../utils/adbClient.js";
import { promisify } from "util";
import stream from "stream";

const readAll = promisify(stream.finished);

async function clickButton(deviceId, bounds, nameButton) {
  const [x1, y1, x2, y2] = bounds.match(/\d+/g); // Extrai as coordenadas dos limites
  const centerX = (parseInt(x1) + parseInt(x2)) / 2; // Calcula o centro x
  const centerY = (parseInt(y1) + parseInt(y2)) / 2; // Calcula o centro y

  const command = `input tap ${centerX} ${centerY}`;
  try {
    const conn = await client.shell(deviceId, command);
    await readAll(conn);
    console.log(`Clique realizado na posição (${centerX}, ${centerY})`);
  } catch (err) {
    console.error("Erro ao realizar o clique:", err);
  }
}

export default clickButton;
