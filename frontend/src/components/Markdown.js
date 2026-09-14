import ReactMarkdown from "react-markdown";

export default function Markdown({ children }) {
  return (
    <div className="md-content" data-testid="markdown-content">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
