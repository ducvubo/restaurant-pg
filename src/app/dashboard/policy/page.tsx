'use client';
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const WebcamFaceCapture = () => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load mô hình face-api.js
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // bạn cần tải các model về public/models
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  // Phát hiện khuôn mặt và chụp ảnh
  useEffect(() => {
    if (!modelsLoaded) return;

    const interval = setInterval(async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video.readyState === 4 &&
        !isUploading
      ) {
        const video = webcamRef.current.video;

        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions()
        );

        if (detections.length > 0) {
          // Có ít nhất 1 khuôn mặt -> chụp ảnh
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) {
            // setIsUploading(true);
            console.log('có khuôn mặt, chụp ảnh:', imageSrc);

          }
        }
      }
    }, 2000); // kiểm tra mỗi 2 giây

    return () => clearInterval(interval);
  }, [modelsLoaded, isUploading]);

  return (
    <div>
      <h2>Webcam Face Detection & Auto Capture</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
        videoConstraints={{
          facingMode: 'user',
        }}
      />
      {isUploading && <p>Uploading image...</p>}
    </div>
  );
};

export default WebcamFaceCapture;
