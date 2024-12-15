import Navbar from "@/components/Navbar";
import Image from "next/image";
import mainImage from "@/images/mainImage2.png"
import logo from "@/images/logo.png"
import logoDark from "@/images/logoDark.png"
import security from "@/images/security-safe.png"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
export default function Home() {
  return (
    <div >
      <Navbar />
      <Image src={mainImage} alt="mainImage" />
      <div className="mx-auto pt-10 scale-150 w-fit">
        <Image src={logo} alt='logo' className='dark:hidden' />
        <Image src={logoDark} alt='logoDark' className='hidden dark:flex' />
      </div>
      <div className="px-5 pt-16 w-4/5 mx-auto">
        <p className=" text-center font-medium">Encrypt and decrypt data and analyze files, domains, IP addresses, and URLs to detect malware and other violations and automatically share them with the security community.
        </p>
      </div>
      <div className=" flex items-center justify-center">
        <Tabs defaultValue="Encryption" className="mt-14 flex items-center flex-col">
          <TabsList>
            <TabsTrigger value="Encryption">Encryption</TabsTrigger>
            <TabsTrigger value="Decryption">Decryption</TabsTrigger>
            <TabsTrigger value="URL Checker">URL Checker</TabsTrigger>
          </TabsList>
          <TabsContent value="Encryption" className="flex items-center flex-col gap-10 justify-center w-[500px] pb-20">
            <Tabs defaultValue="Text" className="mt-14 ">
              <TabsList className="flex items-center">
                <TabsTrigger value="Text">Text</TabsTrigger>
                <TabsTrigger value="File">File</TabsTrigger>
              </TabsList>
              <TabsContent value="Text" className=" w-[600px] flex items-center justify-center">
                <Textarea placeholder="Enter Here ..." className="bg-[#E6F1FE]" />
              </TabsContent>
              <TabsContent value="File" className="flex items-center justify-center mt-5">
                <Input type="file" className="w-[110px] " />
              </TabsContent>
            </Tabs>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choose Encryption key" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Choose Encryption key</SelectLabel>
                  <SelectItem value="AES">AES</SelectItem>
                  <SelectItem value="DES">DES</SelectItem>
                  <SelectItem value="TRIPLE DES">TRIPLE DES</SelectItem>
                  <SelectItem value="CAESER CIPHER">CAESER CIPHER</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input placeholder="Enter Key" />
            <Button className="bg-[#033F86] hover:bg-[#033F86] w-1/2">
              Encrypt
            </Button>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-xl text-[#033F86] whitespace-nowrap">RESULT :</p>
              <p>JOkjskcikmYTkmndhgfnTMFjdkkdufgcdffdgdvgdhchbdggsgsbhghjdmnncj</p>
              <Copy size={20} className="ml-4 text-[#033F86]" />
            </div>
          </TabsContent>
          <TabsContent value="Decryption" className="flex items-center flex-col gap-10 justify-center w-[500px] pb-20">
            <Textarea placeholder="Enter Here ..." className="bg-[#E6F1FE]" />
            <Input placeholder="Enter Key" />
            <Button className="bg-[#033F86] hover:bg-[#033F86] w-1/2">
              Decrypt
            </Button>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-xl text-[#033F86] whitespace-nowrap">RESULT :</p>
              <p>JOkjskcikmYTkmndhgfnTMFjdkkdufgcdffdgdvgdhchbdggsgsbhghjdmnncj</p>
              <Copy size={20} className="ml-4 text-[#033F86]" />
            </div>
          </TabsContent>
          <TabsContent value="URL Checker" className="-mt-24 flex items-center flex-col gap-10 justify-center w-[500px] pb-20">
            <Image src={security} alt="security" className="w-32" />
            <Input placeholder="Search or Scan a URL ....." />
            <Button className="bg-[#033F86] hover:bg-[#033F86] w-1/2">
              Search
            </Button>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
