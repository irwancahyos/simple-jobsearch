'use client';

import { useRef, useEffect, useState } from 'react';
import { X, Camera, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import type { Landmark, HandLandmarkerResult } from '@mediapipe/tasks-vision';
import type { HandLandmarker } from '@mediapipe/tasks-vision';

import imageFirstPose from '@/asset/image/pose-1.png';
import imageSecondPose from '@/asset/image/pose-2.png';
import imageThirdPose from '@/asset/image/pose-3.png';

// ********** Local Interface **********
type PoseStatus = 'INIT' | 'LOADING' | 'CAMERA_READY' | 'POSE_1' | 'POSE_2' | 'POSE_3' | 'CAPTURED' | 'ERROR';

// ********** Main Component **********
const HandCaptureModal = ({ onClose, onCaptureSuccess }: { onClose: () => void; onCaptureSuccess: (imageDataUrl: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId = useRef<number | null>(null);

  const [landmarker, setLandmarker] = useState<HandLandmarker | null>(null);
  const [status, setStatus] = useState<PoseStatus>('INIT');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const requiredPoses = [1, 2, 3];

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const isFingerExtended = (tip: Landmark, pip: Landmark): boolean => {
    return tip.y < pip.y;
  };

  const analyzeHandPose = (landmarks: Landmark[]) => {
    if (!landmarks || landmarks.length < 21) return;
    if (countdown !== null) return;

    const isIndexUp = isFingerExtended(landmarks[8], landmarks[6]);
    const isMiddleUp = isFingerExtended(landmarks[12], landmarks[10]);
    const isRingUp = isFingerExtended(landmarks[16], landmarks[14]);
    const isPinkyUp = isFingerExtended(landmarks[20], landmarks[18]);

    let detectedPose: number | null = null;

    if (isIndexUp && isMiddleUp && isRingUp && !isPinkyUp) {
      detectedPose = 3;
    } else if (isIndexUp && isMiddleUp && !isRingUp && !isPinkyUp) {
      detectedPose = 2;
    } else if (isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
      detectedPose = 1;
    }

    const expectedPose = requiredPoses[currentPoseIndex];

    if (detectedPose === expectedPose) {
      if (currentPoseIndex < requiredPoses.length - 1) {
        const nextIndex = currentPoseIndex + 1;
        setCurrentPoseIndex(nextIndex);
        setStatus(`POSE_${requiredPoses[nextIndex]}` as PoseStatus);
        toast.success(`Pose ${expectedPose} OK! Next: Pose ${requiredPoses[nextIndex]}`);
      } else {
        toast.success('Last pose OK! Starting capture in 3 seconds...', { icon: '📸' });
        startCaptureCountdown();
      }
    }
  };

  const createHandLandmarker = async () => {
    try {
      const mediapipe = await import('@mediapipe/tasks-vision');
      const { HandLandmarker, FilesetResolver } = mediapipe;

      const filesetResolver = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm');

      const newLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO' as any,
        numHands: 1,
      });

      setLandmarker(newLandmarker as HandLandmarker);
      return newLandmarker;
    } catch (error) {
      console.error('Failed to load Landmarker:', error);
      setStatus('ERROR');
      toast.error('Failed to load AI model. Check network.');
      throw error;
    }
  };

  // Looping deteksi of real-time
  const detectHands = () => {
    if (!videoRef.current || !landmarker || status === 'CAPTURED' || status === 'ERROR' || countdown !== null) {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      return;
    }

    const video = videoRef.current;

    const results: HandLandmarkerResult = landmarker.detectForVideo(video, performance.now());

    if (results.landmarks && results.landmarks.length > 0) {
      analyzeHandPose(results.landmarks[0]);
    }

    rafId.current = requestAnimationFrame(detectHands);
  };

  // Caprure function
  const startCaptureCountdown = () => {
    // stop looping of detection
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    // show countdown
    let currentCount = 3;
    setCountdown(currentCount);

    const timer = setInterval(() => {
      currentCount -= 1;
      setCountdown(currentCount);

      if (currentCount <= 0) {
        clearInterval(timer);

        // Call capture when countdown end
        captureImage();
      }
    }, 1000);
  };

  // Captuyre pthoto
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);

        setCapturedImage(imageDataUrl);
        setCountdown(0);
        setStatus('CAPTURED');
        stopCamera();
      }
    }
  };

  // Init Camera
  const initCamera = async () => {
    try {
      const video = videoRef.current;
      if (!video) throw new Error('Video element reference is not available.');

      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = mediaStream;
      setStream(mediaStream);

      await new Promise<void>((resolve, reject) => {
        const handlePlay = () => {
          video.removeEventListener('loadedmetadata', handlePlay);
          video
            .play()
            .then(() => resolve())
            .catch((err) => reject(err));
        };
        video.addEventListener('loadedmetadata', handlePlay);

        if (video.readyState >= 2) {
          handlePlay();
        }
      });

      setStatus('CAMERA_READY');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        toast.error('Camera access denied. Please allow camera in browser settings.');
      } else {
        toast.error('Camera failed to start.');
      }
      setStatus('ERROR');
      return false;
    }
  };

  // Retake function
  const handleRetake = () => {
    setCapturedImage(null);
    setCurrentPoseIndex(0);
    setCountdown(null);
    setStatus('INIT');

    const initialize = async () => {
      try {
        if (!landmarker) await createHandLandmarker();
        await initCamera();
      } catch (e) {
        console.error(`Error during retake initialization:`, e);
      }
    };
    initialize();
  };

  // Init landmark and camera
  useEffect(() => {
    const initialize = async () => {
      if (!videoRef.current) return;

      setStatus('LOADING');
      try {
        await createHandLandmarker();
        await initCamera();
      } catch (e) {
        console.error(e);
      }
    };
    initialize();

    // Cleanup when unmount
    return stopCamera;
  }, []);

  // Status pose controller
  useEffect(() => {
    if (landmarker && stream && status !== 'CAPTURED' && status !== 'ERROR' && countdown === null) {
      if (status === 'CAMERA_READY') {
        const firstPose = requiredPoses[0];
        setStatus(`POSE_${firstPose}` as PoseStatus);
        toast.success(`Ready! Show Pose ${firstPose} to continue.`, { icon: '👋' });
        return;
      }

      if (status.startsWith('POSE_') && rafId.current === null) {
        rafId.current = requestAnimationFrame(detectHands);
      }
    }

    if (status === 'CAPTURED' || status === 'ERROR' || countdown !== null) {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    }

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [stream, landmarker, status, countdown]);

  const currentPose = requiredPoses[currentPoseIndex];
  const isWaitingForPose: boolean = status.startsWith('POSE_');
  const isReadyToStart: boolean = status === 'CAMERA_READY' || isWaitingForPose;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[10px] shadow-2xl w-full max-h-[80vh] flex flex-col overflow-hidden max-w-[637px]">
        {/* Container Header */}
        <div className="flex p-[24px] justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-[1.125rem] text-[#1D1F20] font-semibold">Raise Your Hand to Capture</h2>
            <span className="text-[0.75rem] text-[#1D1F20]">We'll take the photo once your hand pose is detected.</span>
          </div>
          <button onClick={onClose} className="bg-transparent p-0 cursor-pointer">
            <X className="w-5 h-5 text-[#404040] hover:text-[#343333]" />
          </button>
        </div>

        {/* Camera and preview */}
        <div className="relative w-full px-[24px] overflow-hidden flex justify-center">
          {/* Bungkus kamera biar aspect dan overlay sinkron */}
          <div className="relative w-full aspect-square max-h-[400px] overflow-hidden">
            {/* Camera */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300
              ${status === 'CAPTURED' && countdown === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            />

            {/* Overlay countdown */}
            {countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <p className="text-9xl font-extrabold text-white animate-pulse">{countdown}</p>
              </div>
            )}

            {/* Overlay Loading */}
            {(status === 'LOADING' || status === 'INIT') && (
              <p className="absolute text-gray-500 flex items-center gap-2 bg-white/70 px-3 py-2">
                <Camera className="w-4 h-4" /> Loading camera and AI model...
              </p>
            )}

            {/* Overlay Pose */}
            {(isReadyToStart || status === 'CAMERA_READY') && countdown === null && (
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="bg-[#01959F] text-white font-semibold shadow-xl absolute top-4 left-4 py-[6px] px-[16px] rounded-[8px]">
                  Waiting for: Pose {currentPose}
                </div>
                <div
                  className={`border-4 ${
                    isWaitingForPose ? 'border-yellow-400' : 'border-red-500'
                  } w-2/3 h-2/3 rounded-lg pointer-events-none opacity-50`}
                />
              </div>
            )}

            {/* Preview */}
            {status === 'CAPTURED' && capturedImage && countdown === 0 && (
              <div className="absolute inset-0">
                <Image src={capturedImage} alt="Captured Preview" fill className="object-cover transform scale-x-[-1]" />
                <div className="px-2 py-1 bg-[#FBC037] text-[#404040] rounded-lg font-semibold shadow-lg absolute top-4 left-4">
                  Preview
                </div>
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>

        {/* Action button */}
        <div className="flex gap-2 p-[24px] w-full justify-center">
          {status === 'CAPTURED' && countdown === 0 ? (
            <>
              <button
                onClick={handleRetake}
                className="border border-[#E0E0E0] w-fit font-semibold hover:bg-gray-50 py-[6px] px-[16px] rounded-[8px] text-[#1D1F20] text-[0.875rem] cursor-pointer"
              >
                Retake photo
              </button>
              <button
                onClick={() => onCaptureSuccess(capturedImage!)}
                className="bg-[#01959F] w-fit font-semibold hover:bg-[#038690] py-[6px] px-[16px] rounded-[8px] text-white text-[0.875rem] cursor-pointer"
              >
                Submit
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <span className="text-[0.75rem] text-[#1D1F20]">
                To take a picture, follow the hand poses in the order shown below. The system will automatically capture the image once the
                final pose is detected.
              </span>
              <div className="flex items-center gap-1 m-auto">
                <Image alt="Image pose 1" width={57} height={57} className="w-[57px] h-[57px]" src={imageFirstPose?.src} />
                <ChevronRight />
                <Image alt="Image pose 2" width={57} height={57} className="w-[57px] h-[57px]" src={imageSecondPose?.src} />
                <ChevronRight />
                <Image alt="Image pose 3" width={57} height={57} className="w-[57px] h-[57px]" src={imageThirdPose?.src} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandCaptureModal;
