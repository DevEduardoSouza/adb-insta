import client from "./utils/adbClient.js";
import openApp from "./commands/openApp.js";
import parseXML from "xml2js";
import fs from "fs";

import { tapElementByResourceId } from "./utils/utils.js";
import clickAtPosition from "./commands/click.js";
import dumpWindowLayout from "./commands/dumpWindowLayout.js";
import typeText from "./commands/typeText.js";

import { delay } from "./utils/delay.js";
import { isElementPresentByResourceId } from "./utils/isElementPresentByResourceId.js";
import { captureClickableElements } from "./utils/captureClickableElements.js";
import { searchInExplore } from "./instaTools/searchInExplore.js";
import  { tapElementByContentDesc } from "./commands/tapElementByContentDesc.js";
import login from "./instaTools/login.js";
import { accounts } from "../data/accounts.js";

const packageName = "com.instagram.android";
const activityName = "com.instagram.mainactivity.LauncherActivity";
const xmlDumpPath = "./src/sdcard/window_dump.xml";
const user = accounts[0]

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

    if (false) {
      await searchInExplore(device.id, "#casa");
    } else {
      await login(device.id, user)
      // await captureClickableElements(
      //   xmlDumpPath,
      //   "screenshot.png",
      //   "output/clickable_element"
      // );
    }
  })
  .catch((err) => {
    console.error("Erro:", err);
  });
