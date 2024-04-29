// Home.js

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    console.log("ddsds");
  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-4xl mb-5">Image Encryption/Decryption</h1>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <Link to="/encrypt" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4 md:mr-4 md:mb-0">Encrypt</Link>
        <Link to="/decrypt" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">Decrypt</Link>
      </div>
    </div>
  );
}

export default Home;
