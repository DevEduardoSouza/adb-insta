import client from "./utils/adbClient.js";
import openApp from "./commands/openApp.js";
import parseXML from "xml2js";
import fs from "fs";

import {
  tapElementByResourceId,
} from "./utils/utils.js";
import clickAtPosition from "./commands/click.js";
import dumpWindowLayout from "./commands/dumpWindowLayout.js";
import typeText from "./commands/typeText.js";

import { delay } from "./utils/delay.js";
import { isElementPresentByResourceId } from "./utils/isElementPresentByResourceId.js";

const packageName = "com.instagram.android";
const activityName = "com.instagram.mainactivity.LauncherActivity";
const xmlDumpPath = "./src/sdcard/window_dump.xml";

client
  .listDevices()
  .then(async (devices) => {
    if (devices.length === 0) {
      throw new Error("Nenhum dispositivo conectado");
    }
    const device = devices[0];
    console.log(`Dispositivo conectado: ${device.id}`);

    // Abrindo o aplicativo
    await openApp(device.id, packageName, activityName);
    await delay(1000);

    // Capturar o layout da janela
    await dumpWindowLayout(device.id, xmlDumpPath);
    await delay(1000);

    //Verificar se o login foi bem-sucedido
    const loginSuccessful = isElementPresentByResourceId(
      xmlDumpPath,
      "com.instagram.android:id/profile_tab"
    );
    await delay(1000);

    if (loginSuccessful) {
      await delay(1000);

      await tapElementByResourceId(
        device.id,
        "com.instagram.android:id/search_tab"
      );

      const bounds = tapElementByResourceId(
        device.id,
        "com.instagram.android:id/search_tab"
      );
      console.log(bounds);
    } else {
      console.log("Fazendo Login");
      await clickAtPosition(device.id, 24.66, 876.748);
      await delay(500);
      await typeText(device.id, "camilo_box_");

      await clickAtPosition(device.id, 24.766, 876.854);
      await delay(500);
      await typeText(device.id, "edu2023ardo");

      await delay(500);
      // const position = getPositionElement(xmlDumpPath, 4);
      await clickAtPosition(device.id, position.x, position.y);
    }
  })
  .catch((err) => {
    console.error("Erro:", err);
  });
