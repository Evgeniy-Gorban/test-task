import axios from "axios";
import { FormEvent, useState } from "react";
import { parseAxiosError } from "../utils/parseAxiosError";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import ErrorField from "../components/ui/ErrorField";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [homePage, setHomePage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigator = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${SERVER_URL}/api/auth/register`, {
        email,
        password,
        name,
        homePage,
      });
      navigator("/login");
    } catch (error) {
      console.log("Error register", error);
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
          <h2 className="text-2xl  text-center">Register</h2>

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

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 "
          />

          <input
            type="url"
            placeholder="Home page"
            value={homePage}
            onChange={(e) => setHomePage(e.target.value)}
            className="w-full border px-3 py-2 "
          />

          <button type="submit" className="w-full bg-blue-500 text-white py-2 ">
            Sign up
          </button>

          <ErrorField errors={errors} height="h-10" />
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
