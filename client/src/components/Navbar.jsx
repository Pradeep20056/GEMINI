import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-400">💡 Gemini App</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-400">Login</Link>
        <Link to="/signup" className="hover:text-blue-400">Signup</Link>
        <Link to="/chat" className="hover:text-blue-400">Chat</Link>
      </div>
    </nav>
  );
}
