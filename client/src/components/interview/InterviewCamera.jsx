import { Camera } from "lucide-react";
import { useEffect } from "react";

const InterviewCamera = ({ videoRef }) => {
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          await videoRef.current.play();
        }
      } catch (error) {
        console.error("Camera error:", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();

        tracks.forEach((track) => track.stop());
      }
    };
  }, [videoRef]);

  return (
    <div className="w-80">
      <div className="bg-white rounded-3xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Camera size={18} />

          <span className="font-semibold">Camera Preview</span>
        </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="rounded-2xl w-full aspect-video object-cover bg-black"
        />
      </div>
    </div>
  );
};

export default InterviewCamera;
