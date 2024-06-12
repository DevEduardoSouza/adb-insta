import fs from "fs";
import parseXML from "xml2js";
import { exec } from "child_process";

// Função para buscar o elemento pelo content-desc
const findElementByContentDesc = (node, contentDesc) => {
  if (node.$ && node.$["content-desc"] === contentDesc) {
    return node;
  }
  if (node.node) {
    for (let child of node.node) {
      const result = findElementByContentDesc(child, contentDesc);
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

// Função para encontrar o primeiro elemento pai clicável
const findClickableParent = (node, rootNode) => {
  let currentNode = node;
  while (currentNode !== rootNode) {
    if (currentNode.$ && currentNode.$.clickable === "true") {
      return currentNode;
    }
    currentNode = findParentNode(rootNode, currentNode);
  }
  return null;
};

// Função para encontrar o nó pai de um elemento
const findParentNode = (rootNode, targetNode) => {
  if (rootNode.node) {
    for (let child of rootNode.node) {
      if (child === targetNode) {
        return rootNode;
      }
      const parentNode = findParentNode(child, targetNode);
      if (parentNode) {
        return parentNode;
      }
    }
  }
  return null;
};

export function getCoordinatesByContentDesc(xmlPath, contentDesc) {
  const xmlContent = fs.readFileSync(xmlPath, "utf-8");
  let coordinates = null;

  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error("Erro ao analisar o arquivo XML:", err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    const element = findElementByContentDesc(rootNode, contentDesc);

    if (element) {
      // console.log("Elemento encontrado:", element);
      const clickableParent = findClickableParent(element, rootNode);
      if (clickableParent && clickableParent.$ && clickableParent.$.bounds) {
        // console.log("Elemento pai clicável encontrado:", clickableParent);
        coordinates = parseBounds(clickableParent.$.bounds);
      } else {
        console.error(`Nenhum elemento pai clicável encontrado para o content-desc "${contentDesc}"`);
      }
    } else {
      console.error(`O elemento com o content-desc "${contentDesc}" não foi encontrado no arquivo XML`);
    }
  });

  return coordinates;
}

// Função para simular um toque nas coordenadas
async function tapElementByContentDesc(deviceId, contentDesc) {
  const xmlPath = "./src/sdcard/window_dump.xml"; // Certifique-se de que o caminho esteja correto
  const coordinates = getCoordinatesByContentDesc(xmlPath, contentDesc);
  if (!coordinates) {
    console.error(`Elemento com o content-desc ${contentDesc} não encontrado.`);
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

export { tapElementByContentDesc };
