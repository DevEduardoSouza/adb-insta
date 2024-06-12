import { tapElementByContentDesc } from "../commands/tapElementByContentDesc.js";
import typeText from "../commands/typeText.js";
import { delay } from "../utils/delay.js";

const login = async (deviceId, userLogin) => {
  const { user, password } = userLogin;

  if (!user || !password) {
    throw new Error("Usuário e senha não informados");
  }

  await delay(1500);
  await tapElementByContentDesc(
    deviceId,
    "Nome de usuário, email ou número de celular"
  );
  await typeText(deviceId, user);

  await delay(1500);
  await tapElementByContentDesc(deviceId, "Senha");
  await typeText(deviceId, password);

  await delay(1500);
  await tapElementByContentDesc(deviceId, "Entrar");
};

export default login;
