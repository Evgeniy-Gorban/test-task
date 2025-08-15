import { FormEvent, useState } from "react";
import Captcha from "../captcha/Captcha";
import { CreateComment } from "../../types/comment";

interface CommentFormProps {
  userId: string | null;
  answer: number | null;
  onSubmit: (data: CreateComment, file: File | null) => Promise<boolean>;
}

const CommentForm: React.FC<CommentFormProps> = ({
  userId,
  answer,
  onSubmit,
}) => {
  const [text, setText] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [homePage, setHomePage] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload: CreateComment = userId
      ? { text, parentId: answer }
      : {
          text,
          userName,
          email,
          homePage,
          parentId: answer,
          captcha,
          captchaId,
        };

    const success = await onSubmit(payload, file);

    if (success) {
      setText("");
      setUserName("");
      setEmail("");
      setHomePage("");
      setCaptcha("");
      setCaptchaId("");
      setFile(null);
      setCaptchaKey((prev) => prev + 1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-1/3 mx-auto">
      <h2 className="text-2xl  text-center">Form create comment</h2>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Text comment"
        className="w-full border p-3"
      />

      <div className="flex items-center gap-3">
        <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer min-w-[100px]">
          Select file
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
        <span>{file ? file.name : "File not selected"}</span>
      </div>

      {!userId && (
        <>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Name"
            className="w-full border p-3"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border p-3"
          />
          <input
            type="url"
            value={homePage}
            onChange={(e) => setHomePage(e.target.value)}
            placeholder="Home page"
            className="w-full border p-3"
          />
          <Captcha
            key={captchaKey}
            onChange={(value, id) => {
              setCaptcha(value);
              setCaptchaId(id);
            }}
          />
        </>
      )}

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Create comment
      </button>
    </form>
  );
};

export default CommentForm;
