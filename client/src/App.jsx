import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  // Convert file to Base64 (for sending to backend)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const askGemini = async () => {
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, image }),
      });

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("❌ Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-3xl font-bold mb-6">💡 Gemini Chat</h1>

      <div className="w-full max-w-lg space-y-4">
        {/* Input with attach */}
        <div className="flex items-center space-x-2">
          <textarea
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Ask something..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></textarea>

          {/* Attach button */}
          <label className="cursor-pointer">
            📎
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Preview selected image */}
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="preview"
              className="max-h-40 rounded-lg border border-gray-700"
            />
          </div>
        )}

        <button
          onClick={askGemini}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask Gemini"}
        </button>

        {/* Answer Box */}
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg whitespace-pre-wrap">
          {answer ? answer : "⚡ Gemini response will appear here..."}
        </div>
      </div>
    </div>
  );
}

export default App;
