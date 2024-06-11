import fs from "fs";
import parseXML from "xml2js";
import { exec } from "child_process";

// Função para buscar o elemento pelo resource-id
const findElementByResourceId = (node, resourceId) => {
  if (node.$ && node.$["resource-id"] === resourceId) {
    return node;
  }
  if (node.node) {
    for (let child of node.node) {
      const result = findElementByResourceId(child, resourceId);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

// Função para analisar os limites (bounds) e retornar as coordenadas
const parseBounds = (bounds) => {
  const [left, top, right, bottom] = bounds.match(/\d+/g).map(Number);
  const x = Math.floor((left + right) / 2);
  const y = Math.floor((top + bottom) / 2);
  return { x, y };
};

export function getCoordinatesByResourceId(xmlPath, resourceId) {
  const xmlContent = fs.readFileSync(xmlPath, "utf-8");
  let coordinates = null;

  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error("Erro ao analisar o arquivo XML:", err);
      return;
    }


    const rootNode = result.hierarchy.node[0];
    const element = findElementByResourceId(rootNode, resourceId);

    if (element) {
      if (element.$ && element.$.bounds) {
        const bounds = element.$.bounds;
        coordinates = parseBounds(bounds);
      } else {
        console.error(
          `O elemento com o resource ID "${resourceId}" não possui a propriedade "bounds"`
        );
      }
    } else {
      console.error(
        `O elemento com o resource ID "${resourceId}" não foi encontrado no arquivo XML`
      );
    }
  });

  return coordinates;
}

// Função para simular um toque nas coordenadas
async function tapElementByResourceId(deviceId, resourceId) {
  const xmlPath = "./src/sdcard/window_dump.xml"; // Certifique-se de que o caminho esteja correto
  const coordinates = getCoordinatesByResourceId(xmlPath, resourceId);
  if (!coordinates) {
    console.error(`Elemento com o resource ID ${resourceId} não encontrado.`);
    return;
  }
  const { x, y } = coordinates;
  console.log("Coordenadas encontradas:", x, y);
  await tapCoordinates(deviceId, x, y);
}

async function tapCoordinates(deviceId, x, y) {
  return new Promise((resolve, reject) => {
    exec(`adb -s ${deviceId} shell input tap ${x} ${y}`, (error) => {
      if (error) {
        reject(`Erro ao clicar nas coordenadas (${x},${y}): ${error.message}`);
      } else {
        resolve();
      }
    });
  });
}

export { tapElementByResourceId };