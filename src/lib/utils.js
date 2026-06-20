import { clsx } from "clsx";
import CryptoJS from "crypto-js";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

const getEncryptedText = payload => {
  if (typeof payload === "string") return payload;
  if (typeof payload?.data === "string") return payload.data;
  return null;
};

export const encryptData = data => {
  if (!SECRET_KEY) throw new Error("NEXT_PUBLIC_ENCRYPTION_KEY missing");

  const key = CryptoJS.enc.Base64.parse(SECRET_KEY);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const cipherTextBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  const ivBase64 = iv.toString(CryptoJS.enc.Base64);

  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(`${cipherTextBase64}::${ivBase64}`));
};

export const decryptData = encryptedText => {
  if (!SECRET_KEY) throw new Error("NEXT_PUBLIC_ENCRYPTION_KEY missing");
  if (!encryptedText) throw new Error("Encrypted response missing");
  const encryptedPayload = getEncryptedText(encryptedText);
  if (!encryptedPayload) {
    throw new Error("Invalid encrypted response. Expected encrypted string");
  }
  const key = CryptoJS.enc.Base64.parse(SECRET_KEY);
  let decodedData = "";
  try {
    decodedData = CryptoJS.enc.Base64.parse(encryptedPayload).toString(CryptoJS.enc.Utf8);
  } catch {
    throw new Error("Invalid encrypted response. Unable to decode response envelope");
  }

  const parts = decodedData.split("::");
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted format. Expected cipherText::iv");
  }
  const [cipherTextBase64, ivBase64] = parts;
  const decrypted = CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(cipherTextBase64),
    },
    key,
    {
      iv: CryptoJS.enc.Base64.parse(ivBase64),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  let plainText = "";

  try {
    plainText = decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    throw new Error("Invalid encrypted response. Unable to decrypt response body");
  }

  if (!plainText) {
    throw new Error("Empty decrypted response");
  }
  try {
    return JSON.parse(plainText);
  } catch {
    return plainText;
  }
};
