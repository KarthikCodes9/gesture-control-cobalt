import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as handTrack from 'handtrackjs';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('Waiting for camera...');
  const animationFrameIdRef = useRef(null);

  const initializeHandTracking = useCallback(() => {
    const modelParams = {
      flipHorizontal: true,
      maxNumBoxes: 1,
      iouThreshold: 0.5,
      scoreThreshold: 0.75,
      modelType: 'ssd320fpnlite',
      modelPath: 'https://cdn.jsdelivr.net/npm/handtrackjs/models/webmodel/ssd_mobilenetv1/model.json',
    };

    handTrack.load(modelParams).then((loadedModel) => {
      setStatus('Hand tracking is ready. Make gestures!');
      handTrack.startVideo(videoRef.current).then(function (status) {
        if (status) {

          videoRef.current.addEventListener('loadeddata', () => {
            runDetection(loadedModel);
          });
        } else {
          setStatus('Please enable video');
        }
      });
    }).catch((err) => {
      console.error('Error loading hand tracking model:', err);
      setStatus('Error loading hand tracking model: ' + err.message);
    });
  }, []);

  const runDetection = useCallback((model) => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      model.detect(videoRef.current).then((predictions) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        model.renderPredictions(predictions, canvas, context, videoRef.current);
        animationFrameIdRef.current = requestAnimationFrame(() => runDetection(model));
      }).catch((err) => {
        console.error('Error during detection:', err);
      });
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStatus('Camera is ready. Initializing hand tracking...');
          initializeHandTracking();
        }
      })
      .catch((err) => {
        setStatus('Error accessing the camera: ' + err.message);
      });

    return () => {

      const stream = videoRef.current?.srcObject;
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => track.stop());

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [initializeHandTracking]);

  return (
    <div className="bg-[#7C93C3] text-gray-800 min-h-screen">
      <nav className="bg-[#55679C] p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-white text-2xl font" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Gesture Control
          </span>
          <ul className="flex space-x-4">
            <li><button className="text-white hover:text-gray-200">Home</button></li>
            <li><button className="text-white hover:text-gray-200">About</button></li>
            <li><button className="text-white hover:text-gray-200">Contact</button></li>
          </ul>
        </div>
      </nav>

      <div className="container mx-auto mt-10">
        <h1 className="text-4xl font-bold text-center mb-6" style={{ fontFamily: "'Beau', sans-serif" }}>Gesture Control Cobot</h1>
        <div id="videoContainer" className="mx-auto bg-[#EBF4F6] p-4 rounded-lg shadow-lg relative">
          <video ref={videoRef} autoPlay className="rounded-lg w-full h-full object-cover"></video>
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
        </div>
        <div className="text-center mt-4 text-xl font-semibold">{status}</div>
      </div>
    </div>
  );
}

export default App;
