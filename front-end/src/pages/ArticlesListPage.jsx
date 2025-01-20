import { Link } from "react-router-dom";
import articles from "../article-content";
export default function ArticlesListPage() {
  return (
    <div className="articles-list">
      <h1>Articles</h1>
      <ol>
        {articles.map((a) => (
          <li key={a.name}>
            <Link key={a.name} to={`/articles/${a.name}`}>
              <h3>{a.title}</h3>
              <p>{a.content[0].substring(0, 150)}...</p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
