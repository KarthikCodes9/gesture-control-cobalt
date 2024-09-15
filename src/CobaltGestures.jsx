import React, { useRef } from 'react';

const CobaltGestures = ({ status }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

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

export default CobaltGestures;
