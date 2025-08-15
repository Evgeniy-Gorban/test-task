import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseAxiosError } from "../utils/parseAxiosError";
import Navbar from "../components/navbar/Navbar";
import ErrorField from "../components/ui/ErrorField";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigator = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(
        `${SERVER_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      navigator("/");
    } catch (error) {
      console.log("Login error", error);
      setErrors(parseAxiosError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex  flex-col">
      <Navbar />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <h1>Loading...</h1>
        </div>
      )}
      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit} className=" p-6 max-w-sm space-y-4">
          <h2 className="text-2xl  text-center">Login</h2>

          <input
            type="text"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 "
          />

          <button type="submit" className="w-full bg-blue-500 text-white py-2 ">
            Sign in
          </button>

          <ErrorField errors={errors} height="h-10" />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
