"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { UploadFunction } from "@/utils/upload";
import { Form } from "./ui/form";

export default function Contact() {
  const [name, setName] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) UploadFunction();
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ fileName: file.name }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const { presignedGETURL, presignedPUTURL } = data;

      await fetch(presignedPUTURL, {
        method: "PUT",
        body: file,
      });
      console.log("File uploaded successfully");
      console.log("Presigned GET URL: ", presignedGETURL);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }

    if (typeof file === "undefined") return;
  };

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    setFile(target.files[0]);
    console.log(target.files[0]);
    // setFile(e.target.value);
    // console.log(e);
  };

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setName(target.value);
    console.log(name);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex justify-center pt-10 ">
      <Card>
        <CardHeader> File upload karleyo mitro</CardHeader>
        <CardContent>
          <Label>
            Name: <Input type="text" value={name} onChange={handleNameChange} />
          </Label>
          <br />
          <Label>
            File: <Input type="file" onChange={handleFileChange} />
          </Label>
          <br />
          <Button
            type="submit"
            disabled={!file || uploading}
            onClick={handleSubmit}
          >
            {uploading ? "Uploading" : "Upload"}
          </Button>
        </CardContent>
      </Card>
      <Button className="ml-[20rem]" onClick={toggleDarkMode}>
        Toggle Dark Mode
      </Button>
    </div>
  );
}
