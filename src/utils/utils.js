import fs from "fs";
import parseXML from "xml2js";

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const findElementByIndex = (node, index) => {
  if (node.$ && node.$.index === String(index)) {
    return node;
  }
  if (node.node) {
    for (let child of node.node) {
      const result = findElementByIndex(child, index);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export function getPositionElement(xmlPath, index) {
  const xmlContent = fs.readFileSync(xmlPath, "utf-8");
  let positionElement = null;

  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error("Erro ao analisar o arquivo XML:", err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    const elementIndex4 = findElementByIndex(rootNode, index);

    if (elementIndex4) {
      if (elementIndex4.$ && elementIndex4.$.bounds) {
        const bounds = elementIndex4.$.bounds;
        console.log("Limites do elemento com índice 4:", bounds);
        positionElement = bounds;
      } else {
        console.error(
          "O elemento com índice 4 não possui a propriedade 'bounds'"
        );
      }
    } else {
      console.error(
        "O elemento com índice 4 não foi encontrado no arquivo XML"
      );
    }
  });

  if (positionElement) {
    console.log(positionElement);
    // Divida a string em pares de coordenadas
    const coordPairs = positionElement.match(/\[(\d+),(\d+)\]/g);

    if (coordPairs.length !== 2) {
      throw new Error(
        "A string deve conter exatamente dois pares de coordenadas."
      );
    }

    // Extrair e combinar as partes para formar x e y corretamente
    const firstPair = coordPairs[0].match(/\d+/g).map(Number);
    const secondPair = coordPairs[1].match(/\d+/g).map(Number);

    const x = parseFloat(`${firstPair[0]}.${firstPair[1]}`);
    const y = parseFloat(`${secondPair[0]}.${secondPair[1]}`);

    return { x, y };
  }
}

// Função para verificar a presença de um elemento pelo texto
const findElementByText = (node, text) => {
  if (node.$ && node.$.text === text) {
    return node;
  }
  if (node.node) {
    for (let child of node.node) {
      const result = findElementByText(child, text);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export function getPositionElementByText(xmlPath, searchText) {
  const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
  let positionElement = null;

  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error('Erro ao analisar o arquivo XML:', err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    const element = findElementByText(rootNode, searchText);

    if (element) {
      if (element.$ && element.$.bounds) {
        const bounds = element.$.bounds;
        console.log('Limites do elemento com texto:', bounds);
        positionElement = bounds;
      } else {
        console.error('O elemento com o texto não possui a propriedade "bounds"');
      }
    } else {
      console.error('O elemento com o texto não foi encontrado no arquivo XML');
    }
  });

  if (positionElement) {
    console.log(positionElement);
    // Divida a string em pares de coordenadas
    const coordPairs = positionElement.match(/\[(\d+),(\d+)\]/g);

    if (coordPairs.length !== 2) {
      throw new Error('A string deve conter exatamente dois pares de coordenadas.');
    }

    // Extrair e combinar as partes para formar x e y corretamente
    const firstPair = coordPairs[0].match(/\d+/g).map(Number);
    const secondPair = coordPairs[1].match(/\d+/g).map(Number);

    const x = parseFloat(`${firstPair[0]}.${firstPair[1]}`);
    const y = parseFloat(`${secondPair[0]}.${secondPair[1]}`);

    return { x, y };
  }
  return null;
}

// Função para verificar a presença de um elemento pelo resource-id
const findElementByResourceId = (node, resourceId) => {
  if (node.$ && node.$['resource-id'] === resourceId) {
    return true;
  }
  if (node.node) {
    for (let child of node.node) {
      if (findElementByResourceId(child, resourceId)) {
        return true;
      }
    }
  }
  return false;
};

export function isElementPresentByResourceId(xmlPath, resourceId) {
  const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
  let isPresent = false;

  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error('Erro ao analisar o arquivo XML:', err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    isPresent = findElementByResourceId(rootNode, resourceId);
  });

  return isPresent;
}
