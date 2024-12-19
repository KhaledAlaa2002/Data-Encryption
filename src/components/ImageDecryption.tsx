import React, { useState } from "react";
import { createDecipheriv } from "crypto";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ImageDecryptor: React.FC = () => {
  const [decryptionKey, setDecryptionKey] = useState<string>("");
  const [encryptedFileBuffer, setEncryptedFileBuffer] = useState<Buffer | null>(null);
  const [decryptedImage, setDecryptedImage] = useState<string | null>(null);

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

      const base64Image = `data:image/png;base64,${decrypted.toString("base64")}`;
      setDecryptedImage(base64Image);
    } catch (error) {
      console.log(error)
      alert("Decryption failed! Please ensure the key is correct and matches the encryption key.");
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <Input type="file" accept=".bin" onChange={handleEncryptedFileUpload} />
      <Input
        type="text"
        placeholder="Enter decryption key"
        value={decryptionKey}
        onChange={(e) => setDecryptionKey(e.target.value)}
        style={{ display: "block", margin: "1rem 0", padding: "0.5rem" }}
      />
      <Button className="mx-auto" onClick={decryptImage} style={{ marginBottom: "1rem" }}>
        Decrypt
      </Button>
      {decryptedImage && (
        <div>
          <h3>Decrypted Image</h3>
          <img src={decryptedImage} alt="Decrypted" style={{ width: "300px" }} />
        </div>
      )}
    </div>
  );
};

export default ImageDecryptor;
