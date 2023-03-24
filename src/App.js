import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import { Camera } from "react-camera-pro";
import { Storage } from 'aws-amplify'

function App() {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [nutri, setNutri] = useState("a");

  async function uploadImageToS3(image) {
    const fileName = `testing_${new Date().getTime()}.jpeg`;
  
    try {
      const result = await Storage.put(fileName, image, {
        contentType: 'image/jpeg'
      });
  
      console.log('Uploaded file: ', result);
  
      return result.key;
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  }



  return (
    <div className="App">
      <header className="App-header">
        <p class="font-bold underline">
          SeeFood Demo
        </p>

        <button
          class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => {
            const photo = camera.current.takePhoto();
            setImage(photo);
          }}
        >Take Picture</button>
        <div class="m-4 w-3/4">
          <Camera ref={camera} numberOfCamerasCallback={setNumberOfCameras} aspectRatio={9 / 16} />
          <button
            class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            hidden={numberOfCameras <= 1}
            onClick={() => {
              camera.current.switchCamera();
            }}
          >Change Camera</button>
        </div>
        <div class="m-4 w-3/4">
          <img src={image} alt='Image preview' />
        </div>
        <button
          class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => {
            uploadImageToS3(image);
            console.log(
              JSON.stringify({ b64: image })
            )
            fetch("http://13.215.207.98:8000/ocrb64", {
              method: "POST",
              body: JSON.stringify({ b64: image }),
              headers: {
                "Content-Type": "application/json",
              },
            }).then((response) => 
              response.json()
            ).then(
              (data) => {
                console.log(data)
                setNutri(JSON.stringify(data))
              }
            )
          }}
        >Send to Backend</button>
        <div>
          <p class="font-bold underline">{nutri}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
