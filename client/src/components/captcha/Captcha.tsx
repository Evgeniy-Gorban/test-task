import { useEffect, useState } from "react";
import axios from "axios";
import { parseAxiosError } from "../../utils/parseAxiosError";
import ErrorField from "../ui/ErrorField";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

interface CaptchaProps {
  onChange: (value: string, captchaId: string) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onChange }) => {
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const fetchCaptcha = async () => {
    try {
      const captchaRes = await axios.get(`${SERVER_URL}/api/captcha`);
      setCaptchaSvg(captchaRes.data.svg);
      setCaptchaId(captchaRes.data.captchaId);
      setCaptcha("");
    } catch (error) {
      setErrors(parseAxiosError(error));
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  return (
    <div>
      <ErrorField errors={errors} height="h-10" />

      <div className="flex">
        <div
          key={captchaId}
          dangerouslySetInnerHTML={{ __html: captchaSvg }}
        ></div>
        <button
          type="button"
          onClick={fetchCaptcha}
          className="mt-2 text-blue-500 text-sm"
        >
          Refresh captcha
        </button>
      </div>
      <input
        type="text"
        value={captcha}
        onChange={(e) => {
          setCaptcha(e.target.value);
          onChange(e.target.value, captchaId);
        }}
        placeholder="Captcha"
        className="w-full border p-3"
      />
    </div>
  );
};

export default Captcha;
