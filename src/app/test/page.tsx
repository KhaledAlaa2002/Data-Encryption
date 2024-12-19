"use client"
import React, { useState } from "react";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ImageEncryptorDecryptor: React.FC = () => {
  const [tab, setTab] = useState<"encrypt" | "decrypt">("encrypt");

  // Encryption states
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [encryptedData, setEncryptedData] = useState<Blob | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string>("");

  // Decryption states
  const [decryptionKey, setDecryptionKey] = useState<string>("");
  const [encryptedFileBuffer, setEncryptedFileBuffer] = useState<Buffer | null>(null);
  const [decryptedImage, setDecryptedImage] = useState<string | null>(null);

  // Handle image upload for encryption
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setOriginalImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Encrypt the image
  const encryptImage = (): void => {
    if (!originalImage || !encryptionKey) {
      alert("Please provide a key and upload an image to encrypt.");
      return;
    }

    const keyBuffer = Buffer.from(encryptionKey.padEnd(32, "0").slice(0, 32)); // Ensure 256-bit key
    const iv = randomBytes(16); // Initialization vector
    const cipher = createCipheriv("aes-256-cbc", keyBuffer, iv);

    // Convert Base64 image to Buffer
    const base64Data = originalImage.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Encrypt the image data
    const encrypted = Buffer.concat([cipher.update(imageBuffer), cipher.final()]);

    // Combine IV and encrypted content into a single Blob
    const encryptedBlob = new Blob([iv, encrypted], { type: "application/octet-stream" });
    setEncryptedData(encryptedBlob);
  };

  // Handle encrypted file upload for decryption
  const handleEncryptedFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setEncryptedFileBuffer(Buffer.from(e.target.result as ArrayBuffer));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Decrypt the uploaded file
  const decryptImage = (): void => {
    if (!encryptedFileBuffer) {
      alert("Please upload an encrypted file.");
      return;
    }
    if (!decryptionKey) {
      alert("Please provide the decryption key.");
      return;
    }

    try {
      const keyBuffer = Buffer.from(decryptionKey.padEnd(32, "0").slice(0, 32)); // Ensure 256-bit key
      const iv = encryptedFileBuffer.slice(0, 16); // Extract IV
      const encryptedContent = encryptedFileBuffer.slice(16); // Extract encrypted content

      const decipher = createDecipheriv("aes-256-cbc", keyBuffer, iv);
      const decrypted = Buffer.concat([
        decipher.update(encryptedContent),
        decipher.final(),
      ]);

      // Convert decrypted content back to Base64 and set as image source
      const base64Image = `data:image/png;base64,${decrypted.toString("base64")}`;
      setDecryptedImage(base64Image);
    } catch (error) {
      alert("Decryption failed! Please ensure the key is correct and matches the encryption key.");
    }
  };

  return (
    <div>
      <h1>Image Encryptor and Decryptor</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setTab("encrypt")}
          style={{
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: tab === "encrypt" ? "#0070f3" : "#ccc",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Encrypt
        </button>
        <button
          onClick={() => setTab("decrypt")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: tab === "decrypt" ? "#0070f3" : "#ccc",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Decrypt
        </button>
      </div>

      {tab === "encrypt" && (
        <div>
          <h2>Encrypt an Image</h2>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <input
            type="text"
            placeholder="Enter encryption key"
            value={encryptionKey}
            onChange={(e) => setEncryptionKey(e.target.value)}
            style={{ display: "block", margin: "1rem 0", padding: "0.5rem" }}
          />
          {originalImage && (
            <div>
              <h3>Original Image</h3>
              <img src={originalImage} alt="Original" style={{ width: "300px" }} />
              <button onClick={encryptImage}>Encrypt</button>
            </div>
          )}
          {encryptedData && (
            <div>
              <h3>Encrypted Image</h3>
              <a
                href={URL.createObjectURL(encryptedData)}
                download="encrypted-image.bin"
              >
                Download Encrypted Image
              </a>
            </div>
          )}
        </div>
      )}

      {tab === "decrypt" && (
        <div>
          <h2>Decrypt an Encrypted Image</h2>
          <input type="file" accept=".bin" onChange={handleEncryptedFileUpload} />
          <input
            type="text"
            placeholder="Enter decryption key"
            value={decryptionKey}
            onChange={(e) => setDecryptionKey(e.target.value)}
            style={{ display: "block", margin: "1rem 0", padding: "0.5rem" }}
          />
          <button onClick={decryptImage} style={{ marginBottom: "1rem" }}>
            Decrypt
          </button>
          {decryptedImage && (
            <div>
              <h3>Decrypted Image</h3>
              <img src={decryptedImage} alt="Decrypted" style={{ width: "300px" }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageEncryptorDecryptor;
