const ExitInterviewDialog = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold mb-3">Exit Interview?</h2>

        <p className="text-gray-500 mb-6">
          Your interview will end immediately.
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-5 py-2 rounded-xl border">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-red-500 text-white"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitInterviewDialog;
