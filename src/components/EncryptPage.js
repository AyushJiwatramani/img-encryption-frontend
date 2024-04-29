import React, { useState } from "react";
import axios from "axios";

const EncryptPage = () => {
  let [image, setImage] = useState(null);
  let [encryptedImage, setEncryptedImage] = useState(null);
  let [encryptedImagePath, setEncryptedImagePath] = useState(null);
  let [timestamp, setTimestamp] = useState(null);
  let [uniqueId, setUniqueId] = useState(null);
  const [loading, setLoading] = useState(false);
  encryptedImagePath = "/uploads/encrypted_Taj_Mahal.jpg";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImage(file);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/encrypt",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { encrypted_image_path, timestamp, unique_id } = response.data;
      setEncryptedImagePath(encrypted_image_path);
      setEncryptedImage(encrypted_image_path);
      setTimestamp(timestamp);
      setUniqueId(unique_id);
    } catch (error) {
      console.error("Error encrypting image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (encryptedImagePath) {
      try {
        // Fetch the image data
        const response = await axios.get(
          `http://127.0.0.1:5000/${encryptedImagePath}`,
          {
            responseType: "blob",
          }
        );

        // Create a Blob object from the image data
        const blob = new Blob([response.data], { type: "image/png" });

        // Create a temporary URL for the Blob object
        const url = window.URL.createObjectURL(blob);

        // Create an anchor element to trigger the download
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = encryptedImagePath.substring(
          encryptedImagePath.lastIndexOf("/") + 1
        );
        anchor.click();

        // Revoke the temporary URL
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    }
  };

  const handleDownloadDetails = () => {
    if (timestamp && uniqueId) {
      const details = `Timestamp: ${timestamp}\nUnique ID: ${uniqueId}`;
      const blob = new Blob([details], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "encryption_details.txt";
      anchor.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-4xl mb-5">Image Encryption</h1>
      <div className="flex flex-col items-center">
        <label
          htmlFor="imageInput"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4 cursor-pointer"
        >
          Choose Image
        </label>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          onDrop={handleImageDrop}
        />
        {image && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              className="max-w-md"
            />
          </div>
        )}
        {loading ? (
          <div className="mb-4">Loading...</div>
        ) : (
          <div>
            {encryptedImagePath && (
              <div className="mb-4">
                <img
                  src={`http://127.0.0.1:5000/${encryptedImagePath}`}
                  alt="Encrypted"
                  className="max-w-md"
                />
              </div>
            )}
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mr-4"
            >
              Encrypt Image
            </button>
            {encryptedImagePath && (
              <button
                onClick={handleDownload}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Download Encrypted Image
              </button>
            )}
            {timestamp && uniqueId && (
              <button
                onClick={handleDownloadDetails}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md ml-4"
              >
                Download Encryption Details
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EncryptPage;
