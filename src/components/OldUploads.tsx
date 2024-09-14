"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";

interface Upload {
  id: number;
  username: string;
  url: string;
}

const OldUploads = ({ username }: { username: string }) => {
  const [data, setData] = useState<Upload[]>([]);

  const oldUploadHandler = async () => {
    try {
      const response = await fetch(
        `/download?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
        }
      );
      const dataArr = await response.json();
      if (Array.isArray(dataArr)) {
        setData(dataArr);
      } else {
        console.error("Expected an array but got:", dataArr);
      }
    } catch (error) {
      console.log("----------------------------Error fetching data:", error);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={oldUploadHandler} className="mb-4">
        Download
      </Button>
      <div className="grid grid-cols-1 gap-4">
        {data.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow">
            <p className="text-sm font-medium">ID: {item.id}</p>
            <p className="text-sm font-medium">Username: {item.username}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Image
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OldUploads;
