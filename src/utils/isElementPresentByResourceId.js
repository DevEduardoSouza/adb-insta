import fs from "fs";
import parseXML from "xml2js";

const findElementByResourceId = (node, resourceId) => {
  if (node.$ && node.$["resource-id"] === resourceId) {
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
  const xmlContent = fs.readFileSync(xmlPath, "utf-8");
  let isPresent = false;

  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error("Erro ao analisar o arquivo XML:", err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    isPresent = findElementByResourceId(rootNode, resourceId);
  });

  return isPresent;
}
