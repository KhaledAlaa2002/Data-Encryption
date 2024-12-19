"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import mainImage from "@/images/mainImage2.png";
import logo from "@/images/logo.png";
import logoDark from "@/images/logoDark.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import CryptoJS from "crypto-js"; // edited
import ImageEncryptor from "@/components/ImageEncryption";
import ImageDecryptor from "@/components/ImageDecryption";

export default function Home() {
  const [encryptionMethod, setEncryptionMethod] = useState<string>("AES");
  const [encryptionKey, setEncryptionKey] = useState<string>(""); // Encryption key
  const [decryptionKey, setDecryptionKey] = useState<string>(""); // Decryption key
  const [shift, setShift] = useState<number>(3); // For Caesar Cipher
  const [inputText, setInputText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [showDecriptionResult, setshowDecriptionResult] = useState(false);

  // Encrypt and Decrypt Functions
  const encryptText = () => {
    if (!encryptionKey && encryptionMethod !== "CAESER CIPHER") {
      alert("Please provide an encryption key");
      return;
    }
    let encrypted = "";

    switch (encryptionMethod) {
      case "AES":
        encrypted = CryptoJS.AES.encrypt(inputText, encryptionKey).toString();
        break;
      case "DES":
        encrypted = CryptoJS.DES.encrypt(inputText, encryptionKey).toString();
        break;
      case "TRIPLE DES":
        encrypted = CryptoJS.TripleDES.encrypt(inputText, encryptionKey).toString();
        break;
      case "CAESER CIPHER":
        encrypted = caesarCipherEncrypt(inputText, shift);
        break;
      default:
        break;
    }

    setResult(encrypted);
  };

  const decryptText = () => {
    setshowDecriptionResult(true);
    if (!decryptionKey && encryptionMethod !== "CAESER CIPHER") {
      alert("Please provide a decryption key");
      return;
    }
    let decrypted = "";

    switch (encryptionMethod) {
      case "AES":
        decrypted = CryptoJS.AES.decrypt(result, decryptionKey).toString(CryptoJS.enc.Utf8);
        break;
      case "DES":
        decrypted = CryptoJS.DES.decrypt(result, decryptionKey).toString(CryptoJS.enc.Utf8);
        break;
      case "TRIPLE DES":
        decrypted = CryptoJS.TripleDES.decrypt(result, decryptionKey).toString(CryptoJS.enc.Utf8);
        break;
      case "CAESER CIPHER":
        decrypted = caesarCipherDecrypt(result, shift);
        break;
      default:
        break;
    }

    setResult(decrypted);
  };


  const caesarCipherEncrypt = (text: string, shift: number): string => {
    return text
      .split("")
      .map((char) => {
        if (!char.match(/[a-zA-Z]/)) return char;
        const charCode = char.charCodeAt(0);
        const base = charCode >= 65 && charCode <= 90 ? 65 : 97;
        return String.fromCharCode(((charCode - base + shift) % 26) + base);
      })
      .join("");
  };

  const caesarCipherDecrypt = (text: string, shift: number): string => {
    return caesarCipherEncrypt(text, 26 - (shift % 26));
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
    }
  };

  return (
    <div>

      {/* click Here */}
      <Navbar />
      <Image src={mainImage} alt="mainImage" />
      <div className="mx-auto pt-10 scale-150 w-fit">
        <Image src={logo} alt="logo" className="dark:hidden" />
        <Image src={logoDark} alt="logoDark" className="hidden dark:flex" />
      </div>
      <div className="px-5 pt-16 w-4/5 mx-auto">
        <p className="text-center font-medium">
          Encrypt and decrypt data and analyze files, domains, IP addresses,
          and URLs to detect malware and other violations and automatically
          share them with the security community.
        </p>
      </div>
      <div className="flex items-center justify-center">
        <Tabs onValueChange={() => { setResult(""); setshowDecriptionResult(false) }} defaultValue="Encryption" className="mt-14 flex items-center flex-col">
          <TabsList>
            <TabsTrigger value="Encryption">Encryption</TabsTrigger>
            <TabsTrigger value="Decryption">Decryption</TabsTrigger>
          </TabsList>
          {/* Encryption Tab */}
          <TabsContent value="Encryption" className="flex items-center flex-col gap-10 justify-center w-[500px] pb-20">
            <Tabs onValueChange={() => { setResult(""); setshowDecriptionResult(false) }} defaultValue="Text" className="mt-14">
              <TabsList className="flex items-center">
                <TabsTrigger value="Text">Text</TabsTrigger>
                <TabsTrigger value="Image">Image</TabsTrigger>
              </TabsList>
              <TabsContent value="Text" className="w-[600px] flex items-center flex-col gap-10 pt-6 justify-center">
                <Textarea
                  placeholder="Enter Here ..."
                  className="bg-[#E6F1FE] dark:text-black"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <Select onValueChange={(value) => setEncryptionMethod(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose Encryption Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Choose Encryption Method</SelectLabel>
                      <SelectItem value="AES">AES</SelectItem>
                      <SelectItem value="DES">DES</SelectItem>
                      <SelectItem value="TRIPLE DES">TRIPLE DES</SelectItem>
                      <SelectItem value="CAESER CIPHER">CAESER CIPHER</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter Encryption Key"
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                  disabled={encryptionMethod === "CAESER CIPHER"}
                />
                {encryptionMethod === "CAESER CIPHER" && (
                  <Input
                    placeholder="Enter Shift Value"
                    type="number"
                    value={shift || 0} // Ensure shift is always a valid number
                    onChange={(e) => {
                      const newShift = parseInt(e.target.value);
                      if (!isNaN(newShift)) {
                        setShift(newShift);
                      } else {
                        setShift(0); // Default to 0 if invalid number
                      }
                    }}
                  />
                )}
                <Button className="bg-[#033F86] hover:bg-[#033F86] w-1/2" onClick={encryptText}>
                  Encrypt
                </Button>
                {result && (
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-xl text-[#033F86] dark:text-[#529af3] whitespace-nowrap">RESULT :</p>
                    <p>{result}</p>
                    <button onClick={handleCopy} className="ml-4 text-[#033F86] dark:text-[#529af3]">
                      <Copy size={20} />
                    </button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="Image" className="flex items-center justify-center mt-5">
                {/* click Here */}

                <ImageEncryptor />
              </TabsContent>
            </Tabs>

          </TabsContent>

          {/* Decryption Tab */}
          <TabsContent value="Decryption" className="flex items-center flex-col gap-10 justify-center w-[500px] pb-20">

            <Tabs onValueChange={() => { setResult(""); setshowDecriptionResult(false) }} defaultValue="Text" className="-mt-8">
              <TabsList className="flex items-center">
                <TabsTrigger value="Text">Text</TabsTrigger>
                <TabsTrigger value="Image">Image</TabsTrigger>
              </TabsList>
              <TabsContent value="Text" className="w-[600px] flex items-center flex-col gap-10 pt-6 justify-center ">
                <Textarea
                  placeholder="Enter Here ..."
                  className="bg-[#E6F1FE] dark:text-black"
                  onChange={(e) => setResult(e.target.value)}
                />
                <Input
                  placeholder="Enter Decryption Key"
                  value={decryptionKey}
                  onChange={(e) => setDecryptionKey(e.target.value)}
                  disabled={encryptionMethod === "CAESER CIPHER"}
                />
                <Select onValueChange={(value) => setEncryptionMethod(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose Encryption Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Choose Encryption Method</SelectLabel>
                      <SelectItem value="AES">AES</SelectItem>
                      <SelectItem value="DES">DES</SelectItem>
                      <SelectItem value="TRIPLE DES">TRIPLE DES</SelectItem>
                      <SelectItem value="CAESER CIPHER">CAESER CIPHER</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {encryptionMethod === "CAESER CIPHER" && (
                  <Input
                    placeholder="Enter Shift Value"
                    type="number"
                    value={shift || 0} // Ensure shift is always a valid number
                    onChange={(e) => {
                      const newShift = parseInt(e.target.value);
                      if (!isNaN(newShift)) {
                        setShift(newShift);
                      } else {
                        setShift(0); // Default to 0 if invalid number
                      }
                    }}
                  />
                )}
                <Button className="bg-[#033F86] hover:bg-[#033F86] w-1/2" onClick={decryptText}>
                  Decrypt
                </Button>
                {result && showDecriptionResult && (
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-xl text-[#033F86] dark:text-[#529af3] whitespace-nowrap">RESULT :</p>
                    <p>{result}</p>
                    <button onClick={handleCopy} className="ml-4 text-[#033F86] dark:text-[#529af3]">
                      <Copy size={20} />
                    </button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="Image" className="flex items-center justify-center mt-5">
                {/* click Here */}
                <ImageDecryptor />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
