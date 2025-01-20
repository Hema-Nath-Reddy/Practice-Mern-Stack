import { useState } from "react";
export default function AddCommentForm({ onAddComment }) {
  const [commentText, setCommentText] = useState("");
  return (
    <div className="add-comment">
      <h3>Add a comment</h3>
      <div className="input">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />

        <button
          onClick={() => {
            onAddComment({ comment: commentText });
            setCommentText("");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            
            viewBox="0 -960 960 960"
          
          >
            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
