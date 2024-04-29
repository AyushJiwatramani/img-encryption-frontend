import React, { useState } from 'react';
import axios from 'axios';

const DecryptPage = () => {
  const [image, setImage] = useState(null);
  const [decryptedImage, setDecryptedImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uniqueId, setUniqueId] = useState('');
  const [timestamp, setTimestamp] = useState('');

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
    setError(null);

    const formData = new FormData();
    formData.append('encrypted_image', image);
    formData.append('timestamp', timestamp);
    formData.append('unique_id', uniqueId);

    try {
      const response = await axios.post('http://127.0.0.1:5000/decrypt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setDecryptedImage(response.data.decrypted_image_path);
    } catch (error) {
      console.error('Error decrypting image:', error);
      setError('Error decrypting image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (decryptedImage) {
      try {
        // Fetch the image data
        const response = await axios.get(
          `http://127.0.0.1:5000/${decryptedImage}`,
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
        anchor.download = decryptedImage.substring(
          decryptedImage.lastIndexOf("/") + 1
        );
        anchor.click();

        // Revoke the temporary URL
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-4xl mb-5">Image Decryption</h1>
      <div className="flex flex-col items-center">
        <label htmlFor="imageInput" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md mb-4 cursor-pointer">
          Choose Image
        </label>
        <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} onDrop={handleImageDrop} />
        <label htmlFor="uniqueIdInput" className="text-lg font-semibold mb-2">Unique ID:</label>
        <input id="uniqueIdInput" type="text" value={uniqueId} onChange={(e) => setUniqueId(e.target.value)} className="bg-white border border-gray-300 rounded-md py-2 px-4 mb-4" />
        <label htmlFor="timestampInput" className="text-lg font-semibold mb-2">Timestamp:</label>
        <input id="timestampInput" type="text" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} className="bg-white border border-gray-300 rounded-md py-2 px-4 mb-4" />
        {image && (
          <div className="mb-4">
            <img src={URL.createObjectURL(image)} alt="Selected" className="max-w-md" />
          </div>
        )}
        {loading ? (
          <div className="mb-4">Loading...</div>
        ) : (
          <>
            {decryptedImage && (
              <div className="mb-4">
                <img
                  src={`http://127.0.0.1:5000/${decryptedImage}`}
                  alt="Encrypted"
                  className="max-w-md"
                />
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            <button onClick={handleSubmit} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md mr-4">
              Decrypt Image
            </button>
            {decryptedImage && (
              <button onClick={handleDownload} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">
                Download Decrypted Image
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DecryptPage;
