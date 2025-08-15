import { Comment } from "../../types/comment";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

interface CommentsListProps {
  comments: Comment[];
  answerId: number | null;
  onAnswer: (id: number) => void;
}

const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  answerId,
  onAnswer,
}) => {
  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="pl-5 pb-3">
          <div
            className={`border p-3 ${
              answerId === comment.id ? "border-blue-500" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex space-x-10 items-center">
                <strong>
                  <a
                    href={
                      comment.user?.homePage ?? comment.homePage ?? undefined
                    }
                    className="text-blue-600"
                  >
                    {comment.user?.name || comment.userName}
                  </a>
                </strong>
                <p className="text-sm text-gray-600">
                  {comment.user?.email || comment.email}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <button
                  onClick={() => onAnswer(comment.id)}
                  className="text-blue-600"
                >
                  Answer
                </button>
              </div>
            </div>
          </div>

          <div
            className="p-3"
            dangerouslySetInnerHTML={{ __html: comment.text }}
          />

          {comment.file && (
            <div>
              {comment.file.fileType === "image" ? (
                <a
                  href={`${SERVER_URL}/uploads/${comment.file.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`${SERVER_URL}/uploads/${comment.file.filePath}`}
                    alt={comment.file.originalName || "attachment"}
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      cursor: "pointer",
                    }}
                  />
                </a>
              ) : (
                <a
                  href={`${SERVER_URL}/uploads/${comment.file.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {comment.file.originalName}
                </a>
              )}
            </div>
          )}

          {comment.children && comment.children.length > 0 && (
            <div className="pl-10 mt-2">
              <CommentsList
                comments={comment.children}
                answerId={answerId}
                onAnswer={onAnswer}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default CommentsList;
