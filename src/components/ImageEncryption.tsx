import React, { useState } from "react";
import { createCipheriv, randomBytes } from "crypto";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ImageEncryptor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [encryptedData, setEncryptedData] = useState<Blob | null>(null);
    const [encryptionKey, setEncryptionKey] = useState<string>("");

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

    const encryptImage = (): void => {
        if (!originalImage || !encryptionKey) {
            alert("Please provide a key and upload an image to encrypt.");
            return;
        }

        const keyBuffer = Buffer.from(encryptionKey.padEnd(32, "0").slice(0, 32)); // Ensure 256-bit key
        const iv = randomBytes(16); // Initialization vector
        const cipher = createCipheriv("aes-256-cbc", keyBuffer, iv);

        const base64Data = originalImage.split(",")[1];
        const imageBuffer = Buffer.from(base64Data, "base64");

        const encrypted = Buffer.concat([cipher.update(imageBuffer), cipher.final()]);
        const encryptedBlob = new Blob([iv, encrypted], { type: "application/octet-stream" });
        setEncryptedData(encryptedBlob);
    };

    return (
        <div>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            <Input
                type="text"
                placeholder="Enter encryption key"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                style={{ display: "block", margin: "1rem 0", padding: "0.5rem" }}
            />
            {originalImage && (
                <div className="flex flex-col items-center justify-center">
                    <h3>Original Image</h3>
                    <img src={originalImage} alt="Original" style={{ width: "300px" }} />
                    <Button onClick={encryptImage}>Encrypt</Button>
                </div>
            )}
            {encryptedData && (
                <div className="mt-5 flex items-center justify-center">
                    <Button>
                        <a
                            href={URL.createObjectURL(encryptedData)}
                            download="encrypted-image.bin"
                        >
                            Download Encrypted Image
                        </a>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ImageEncryptor;
