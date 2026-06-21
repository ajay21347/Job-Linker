const RecordingPreview = ({ videoUrl, audioUrl }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6">Interview Recordings</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-3">Video Recording</h3>

          {videoUrl ? (
            <video controls src={videoUrl} className="rounded-2xl w-full" />
          ) : (
            <div>No Video Available</div>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-3">Audio Recording</h3>

          {audioUrl ? (
            <audio controls src={audioUrl} className="w-full" />
          ) : (
            <div>No Audio Available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordingPreview;
