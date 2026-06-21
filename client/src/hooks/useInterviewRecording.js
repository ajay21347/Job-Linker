import { useRef, useState } from "react";

const useInterviewRecording = () => {
  const videoRef = useRef(null);

  const mediaRecorderRef = useRef(null);

  const streamRef = useRef(null);

  const videoChunksRef = useRef([]);

  const audioChunksRef = useRef([]);

  const [videoUrl, setVideoUrl] = useState(null);

  const [audioUrl, setAudioUrl] = useState(null);

  const [isRecording, setIsRecording] = useState(false);

  const [cameraEnabled, setCameraEnabled] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      setCameraEnabled(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      videoChunksRef.current = [];
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, {
          type: "video/webm",
        });

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const generatedVideoUrl = URL.createObjectURL(videoBlob);

        const generatedAudioUrl = URL.createObjectURL(audioBlob);

        setVideoUrl(generatedVideoUrl);

        setAudioUrl(generatedAudioUrl);
      };

      recorder.start(1000);

      setIsRecording(true);
    } catch (error) {
      console.log(error);

      alert("Camera/Microphone permission denied. Please allow access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setCameraEnabled(false);

    setIsRecording(false);
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
    }
  };

  return {
    videoRef,

    videoUrl,
    audioUrl,

    isRecording,
    cameraEnabled,

    startRecording,
    stopRecording,

    pauseRecording,
    resumeRecording,
  };
};

export default useInterviewRecording;
