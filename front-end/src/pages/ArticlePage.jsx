import { useLoaderData, useParams, Link } from "react-router-dom";
import articles from "../article-content";
import axios from "axios";
import { useState } from "react";
import CommentsList from "../CommentsList";
import AddCommentForm from "./AddCommentForm";
import useUser from "../useUser";

export default function ArticlePage() {
  const { name } = useParams();
  const { isLoading, user } = useUser();
  const {
    upvotes: initialUpvotes,
    downvotes: initialDownvotes,
    comments: initialComments,
    downvoteIds: initialDownvoteIds = [],
    upvoteIds: initialUpvoteIds = [],
  } = useLoaderData();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [comments, setComments] = useState(initialComments);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [hasUpvoted, setHasUpvoted] = useState(
    initialUpvoteIds.includes(user?.uid)
  );
  const [hasDownvoted, setHasDownvoted] = useState(
    initialDownvoteIds.includes(user?.uid)
  );

  const article = articles.find((a) => a.name === name);

  async function handleUpvotes() {
    try {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.post(
        "/api/articles/" + name + "/upvote",
        null,
        { headers }
      );
      const updatedArticleData = response.data;
      setUpvotes(updatedArticleData.upvotes);
      setHasUpvoted(true);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        handleUpvotesCancel();
      }
    }
  }

  async function handleUpvotesCancel() {
    try {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.post(
        "/api/articles/" + name + "/cancel-upvote",
        null,
        { headers }
      );
      const updatedArticleData = response.data;
      setUpvotes(updatedArticleData.upvotes);
      setHasUpvoted(false);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        handleUpvotes();
      }
    }
  }

  async function handleDownvotes() {
    try {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.post(
        "/api/articles/" + name + "/downvote",
        null,
        { headers }
      );
      const updatedArticleData = response.data;
      setDownvotes(updatedArticleData.downvotes);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        handleDownvotesCancel();
      }
    }
  }

  async function handleDownvotesCancel() {
    try {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.post(
        "/api/articles/" + name + "/cancel-downvote",
        null,
        { headers }
      );
      const updatedArticleData = response.data;
      setDownvotes(updatedArticleData.downvotes);
      setHasDownvoted(false);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        handleDownvotes();
      }
    }
  }

  async function onAddComment({ comment }) {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const response = await axios.post(
      "/api/articles/" + name + "/comments",
      {
        postedBy: user.displayName,
        text: comment,
      },
      {
        headers,
      }
    );
    const updatedArticleData = response.data;
    setComments(updatedArticleData.comments);
  }
  return (
    <div className="articlePage">
      <h1>{article.title}</h1>
      {article.content.map((p) => {
        return <p key={p}>{p}</p>;
      })}
      <div className="vote">
        <button onClick={hasUpvoted ? handleUpvotesCancel : handleUpvotes}>
          {upvotes}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z" />
          </svg>
        </button>
        <button
          onClick={hasDownvoted ? handleDownvotesCancel : handleDownvotes}
        >
          {downvotes}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M480-240 240-480l56-56 144 144v-368h80v368l144-144 56 56-240 240Z" />
          </svg>
        </button>
      </div>
      <hr></hr>
      {user ? (
        <AddCommentForm onAddComment={onAddComment} />
      ) : (
        <p style={{ color: "red" }}>Log in to add a comment.</p>
      )}
      <CommentsList comments={comments} />
      <Link to="/articles" className="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
        Back
      </Link>
    </div>
  );
}

export async function loader({ params }) {
  const response = await axios.get("/api/articles/" + params.name);
  const { upvotes, comments, downvotes, upvoteIds, downvoteIds } =
    response.data;

  return {
    upvotes,
    comments,
    downvotes,
    upvoteIds: upvoteIds || [],
    downvoteIds: downvoteIds || [],
  };
}
