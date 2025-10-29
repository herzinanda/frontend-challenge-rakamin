"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Button from '@/components/ui/Button';
interface SimpleWebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

export const SimpleWebcamCapture: React.FC<SimpleWebcamCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      console.log("Camera stream stopped.");
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    
    setCapturedImage(null);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      streamRef.current = stream;
      

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      console.log("Camera started.");
    } catch (err: any) {
      console.error("Error starting camera:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage("Akses kamera ditolak. Izinkan akses kamera di pengaturan browser Anda.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError'){
        setErrorMessage("Tidak ada kamera yang ditemukan.");
      } else {
        setErrorMessage(`Gagal memulai kamera: ${err.name}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  const handleCaptureClick = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setErrorMessage("Gagal mendapatkan konteks canvas.");
      return;
    }

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageDataUrl);

    stopCamera();
  };

  const handleRetake = () => {
    startCamera();
  };

  const handleSubmit = () => {
    if (capturedImage) {
      onCapture(capturedImage)
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="p-4 sm:p-6 relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto my-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-90">
          {capturedImage ? 'Konfirmasi Foto Anda' : 'Ambil Foto'}
        </h3>
        <button onClick={handleClose} className="text-neutral-500 hover:text-neutral-700 text-2xl" aria-label="Close">&times;</button>
      </div>
      <p className="text-sm text-neutral-60 mb-4">
        {capturedImage ? 'Apakah Anda ingin menggunakan foto ini?' : 'Posisikan wajah Anda di tengah bingkai.'}
      </p>

      <div className="relative w-full aspect-video bg-neutral-200 rounded overflow-hidden mb-4 border border-neutral-300">
        
        {isLoading && !errorMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white z-20 text-center p-4">
            Memulai kamera...
          </div>
        )}

        {errorMessage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-100 text-red-700 p-4 z-20 text-center">
            <p className="font-semibold mb-2">Error</p>
            <p className="text-sm">{errorMessage}</p>
            {errorMessage.includes('ditolak') && (
                 <Button variant="secondary" size="small" onClick={startCamera} className="mt-4">
                    Coba Lagi
                 </Button>
            )}
          </div>
        )}

        <video
          ref={videoRef}
          className={`absolute top-0 left-0 w-full h-full object-cover ${capturedImage || errorMessage ? 'invisible' : 'visible'}`}
          autoPlay
          playsInline
          muted
          style={{ transform: 'scaleX(-1)' }} // Efek cermin
          onLoadedData={handleVideoLoaded}
        />

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured Profile"
            className="absolute top-0 left-0 w-full h-full object-cover z-10"
          />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="mt-4">
        {!capturedImage ? (
          <Button
            variant="primary"
            width="full"
            onClick={handleCaptureClick}
            disabled={isLoading || !!errorMessage}
          >
            Capture Photo
          </Button>
        ) : (
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={handleRetake}>
              Retake Photo
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Use this photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

