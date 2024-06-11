import client from '../utils/adbClient.js';
import { exec } from 'child_process';
import fs from 'fs';

// Função para extrair a hierarquia da interface do usuário e salvar o arquivo XML no sistema local
async function dumpWindowLayout(deviceId, localPath) {
    // Comando para extrair a hierarquia da interface do usuário e salvar o arquivo XML no dispositivo
    const dumpCommand = `adb -s ${deviceId} shell uiautomator dump /sdcard/window_dump.xml`;

    try {
        // Executar o comando para extrair a hierarquia da interface do usuário
        exec(dumpCommand, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar o comando: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Erro do comando: ${stderr}`);
                return;
            }
            console.log('Layout da janela capturado.');

            // Comando para baixar o arquivo XML gerado para o sistema local
            const pullCommand = `adb -s ${deviceId} pull /sdcard/window_dump.xml ${localPath}`;

            // Executar o comando para baixar o arquivo XML
            exec(pullCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erro ao baixar o arquivo XML: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Erro do comando: ${stderr}`);
                    return;
                }
                console.log(`Arquivo XML salvo em: ${localPath}`);
            });
        });
    } catch (err) {
        console.error("Erro ao capturar o layout da janela:", err);
    }
}

export default dumpWindowLayout;
