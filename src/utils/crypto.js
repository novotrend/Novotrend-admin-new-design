import CryptoJS from "crypto-js";

export async function encryptPayload(text) {
  const stringifiedData = JSON.stringify(text);
  const key = CryptoJS.enc.Base64.parse(process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(stringifiedData, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const cipherText = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  const ivBase64 = CryptoJS.enc.Base64.stringify(iv);

  return btoa(`${cipherText}::${ivBase64}`);
}

export async function decryptResponse(encryptedText) {
  const key = CryptoJS.enc.Base64.parse(process.env.NEXT_PUBLIC_ENCRYPTION_KEY);

  const decoded = atob(encryptedText);
  const [cipherText, iv] = decoded.split("::");
  const newData = { ciphertext: CryptoJS.enc.Base64.parse(cipherText) };
  const decrypted = CryptoJS.AES.decrypt(newData, key, {
    iv: CryptoJS.enc.Base64.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
