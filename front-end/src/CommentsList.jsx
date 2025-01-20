export default function CommentsList({ comments }) {
  return (
    <div className="comments-list">
      <h3>Comments:</h3>
      {comments.map((comment) => (
        <div key={comment.commentId} className="individual-comment">
            <p className="comment-user">{comment.postedBy}</p>
          <p className="comment">{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
