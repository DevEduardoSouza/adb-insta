import fs from "fs";
import { exec } from "child_process";
import sharp from "sharp";
import parseXML from "xml2js";

// Função principal para capturar elementos clicáveis
async function captureClickableElements(
  xmlDumpPath,
  screenshotPath,
  outputDir
) {
  const xmlContent = fs.readFileSync(xmlDumpPath, "utf-8");
  let clickableElements = [];

  // Parse the XML to find all clickable elements
  parseXML.parseString(xmlContent, (err, result) => {
    if (err) {
      console.error("Erro ao analisar o arquivo XML:", err);
      return;
    }

    const rootNode = result.hierarchy.node[0];
    clickableElements = findClickableElements(rootNode);
  });

  // Capture the screenshot
  await captureScreenshot(screenshotPath);

  // Process each clickable element
  for (let i = 0; i < clickableElements.length; i++) {
    const element = clickableElements[i];
    const bounds = element.$.bounds;
    const resourceId = clickableElements[i].$["resource-id"];
    const { x, y, width, height } = parseBounds(bounds);

    // Crop the screenshot to get the clickable element
    await cropImage(
      screenshotPath,
      outputDir,
      resourceId,
      i,
      x,
      y,
      width,
      height
    );
  }

  console.log("Capturas de elementos clicáveis concluídas.");
}

// Função para encontrar todos os elementos clicáveis
function findClickableElements(node) {
  let clickableElements = [];

  if (node.$ && node.$.clickable === "true") {
    clickableElements.push(node);
  }

  if (node.node) {
    for (let child of node.node) {
      clickableElements = clickableElements.concat(
        findClickableElements(child)
      );
    }
  }

  return clickableElements;
}

// Função para analisar os limites
function parseBounds(bounds) {
  const coordPairs = bounds.match(/\[(\d+),(\d+)\]/g);

  const firstPair = coordPairs[0].match(/\d+/g).map(Number);
  const secondPair = coordPairs[1].match(/\d+/g).map(Number);

  const x = firstPair[0];
  const y = firstPair[1];
  const width = secondPair[0] - firstPair[0];
  const height = secondPair[1] - firstPair[1];

  return { x, y, width, height };
}

// Função para capturar uma captura de tela usando adb
function captureScreenshot(screenshotPath) {
  return new Promise((resolve, reject) => {
    exec(`adb exec-out screencap -p > ${screenshotPath}`, (error) => {
      if (error) {
        reject(`Erro ao capturar a tela: ${error.message}`);
      } else {
        resolve();
      }
    });
  });
}

// Função para recortar uma imagem usando sharp
async function cropImage(
  inputPath,
  outputDir,
  resourceId,
  index,
  x,
  y,
  width,
  height
) {
  // Crie o diretório de saída para esta imagem
  const imageDir = `${outputDir}/${index}`;

  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  const textFilePath = `${imageDir}/resourceId_${index}.txt`;

  // Conteúdo do arquivo de texto
  const textContent = `Resource ID: ${resourceId}\nBounds: [${x},${y}] - [${x + width},${y + height}]`;

  // Escrever o conteúdo no arquivo de texto
  fs.writeFileSync(textFilePath, textContent);

  const outputPath = `${imageDir}/imagem_${index}.png`;
  return sharp(inputPath)
    .extract({ left: x, top: y, width, height })
    .toFile(outputPath)
    .then(() => {
      console.log(`Imagem recortada salva em: ${outputPath}`);
    })
    .catch((err) => {
      console.error(`Erro ao recortar a imagem: ${err.message}`);
    });
}

// Exporta a função principal
export { captureClickableElements };
