"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface Upload {
  id: number;
  username: string;
  url: string;
}

const OldUploads = ({ username }: { username: string }) => {
  const [data, setData] = useState<Upload[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchedOnce, setFetchedOnce] = useState<boolean>(false);

  const oldUploadHandler = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/download?username=${encodeURIComponent(username)}`,
        { method: "GET" }
      );
      const dataArr = await response.json();
      if (Array.isArray(dataArr)) {
        setData(dataArr);
        setLoading(false);
      } else {
        console.error("Expected an array but got:", dataArr);
      }
    } catch (error) {
      console.log("----------------------------Error fetching data:", error);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardContent>
          <br />
          <div className="grid grid-rows-1 ">
            <Button onClick={oldUploadHandler} className="mb-4 rounded-full">
              {loading ? "Loading..." : "Get past uploads"}
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {data.map((item) => (
              <div
                key={item.id}
                className=" flex flex-row items-center p-4 border rounded shadow"
              >
                <div className="flex items-center space-x-3">
                  <p className="text-sm font-medium">iD: {item.id} </p>
                  {/* <p className="text-sm font-medium">Username: {item.username}</p> */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View File
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OldUploads;
