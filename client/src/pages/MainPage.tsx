import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { parseAxiosError } from "../utils/parseAxiosError";
import Navbar from "../components/navbar/Navbar";
import { Comment, CreateComment } from "../types/comment";
import CommentForm from "../components/comments/CommentForm";
import CommentsList from "../components/comments/CommentList";
import Pagination from "../components/pagination/Pagination";
import ErrorField from "../components/ui/ErrorField";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const MainPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState(null);

  const [answer, setAnswer] = useState<number | null>(null);

  const [sortBy, setSortBy] = useState<"name" | "email" | "date">("date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const commentsRes = await axios.get(`${SERVER_URL}/api/comments`, {
        params: { sortBy, order, page },
      });

      setComments(commentsRes.data.comments);
      setTotal(commentsRes.data.pagination.total);
      setPageSize(commentsRes.data.pagination.pageSize);
    } catch (error) {
      setErrors(parseAxiosError(error));
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, order, page]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const userRes = await axios.get(`${SERVER_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setUserId(userRes.data?.id);
    } catch (error) {
      setErrors(parseAxiosError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchUser();
  }, [fetchComments]);

  const handleCreateComment = async (
    data: CreateComment,
    file: File | null
  ): Promise<boolean> => {
    setIsLoading(true);
    let filePath, fileType, originalName;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const fileRes = await axios.post(`${SERVER_URL}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        filePath = fileRes.data.filePath;
        fileType = fileRes.data.fileType;
        originalName = fileRes.data.originalName;
      } catch (error) {
        setErrors(parseAxiosError(error));
        setIsLoading(false);
        return false;
      }
    }
    const payload = { ...data, filePath, fileType, originalName };

    try {
      await axios.post(`${SERVER_URL}/api/comments`, payload, {
        withCredentials: true,
      });
      fetchComments();
      setAnswer(null);
      setErrors([]);
      return true;
    } catch (error) {
      setErrors(parseAxiosError(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center  z-50">
          <h1>Loading...</h1>
        </div>
      )}

      <div className="flex gap-5 mb-4 justify-center">
        {["name", "email", "date"].map((key) => (
          <button
            key={key}
            onClick={() => setSortBy(key as any)}
            className={sortBy === key ? "font-bold" : ""}
          >
            {key}
          </button>
        ))}
        <p>-</p>
        <button onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
          {order}
        </button>
      </div>

      <CommentsList
        comments={comments}
        answerId={answer}
        onAnswer={setAnswer}
      />

      <CommentForm
        userId={userId}
        answer={answer}
        onSubmit={handleCreateComment}
      />

      <ErrorField errors={errors} height="h-10" />

      <Pagination
        page={page}
        total={total}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default MainPage;
