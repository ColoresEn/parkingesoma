"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ArtistSummary {
  id: string;
  name: string;
  image: string | null;
}

interface MuralComment {
  id: string;
  content: string;
  createdAt: string;
  user: ArtistSummary;
}

interface MuralDetailProps {
  mural: {
    id: string;
    name: string;
    description: string;
    imageSrc: string;
    visitUrl: string | null;
    likedIds: string[];
    author: ArtistSummary | null;
    comments: MuralComment[];
  };
  currentUserId: string | null;
}

export default function MuralDetail({ mural, currentUserId }: MuralDetailProps) {
  const router = useRouter();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const commentsSectionRef = useRef<HTMLElement>(null);
  const [liked, setLiked] = useState(
    currentUserId ? mural.likedIds.includes(currentUserId) : false,
  );
  const [likeCount, setLikeCount] = useState(mural.likedIds.length);
  const [comments, setComments] = useState(mural.comments);
  const [comment, setComment] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function toggleLike() {
    if (!currentUserId) {
      router.push("/login");
      return;
    }

    setIsLiking(true);
    try {
      const response = await fetch(`/api/murals/${mural.id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: !liked }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not update your like.");

      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your like.");
    } finally {
      setIsLiking(false);
    }
  }

  async function shareMural() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: mural.name, text: mural.description, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      toast.success("Link copied.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast.error("Could not share the mural. Check your browser permissions.");
    }
  }

  async function copyMuralLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied.");
      setIsMenuOpen(false);
    } catch {
      toast.error("Could not copy the link. Check your browser permissions.");
    }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUserId) {
      router.push("/login");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`/api/murals/${mural.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not post your comment.");

      setComments((previous) => [result, ...previous]);
      setComment("");
      toast.success("Comment posted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not post your comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  }

  function focusComments() {
    const commentInput = commentInputRef.current;
    if (commentInput) {
      commentInput.scrollIntoView({ behavior: "smooth", block: "center" });
      commentInput.focus({ preventScroll: true });
      return;
    }

    commentsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <Link className="mural-back-link" href="/murals">
        <ArrowLeft aria-hidden="true" /> Back to murals
      </Link>
      <article className="mural-detail">
        <div className="mural-detail-image">
          <Image
            src={mural.imageSrc}
            alt={`Mural: ${mural.name}`}
            width={1200}
            height={1500}
            priority
          />
        </div>
        <div className="mural-detail-content">
          <div className="mural-action-bar" aria-label="Mural actions">
            <button
              type="button"
              className={`mural-action-button${liked ? " is-liked" : ""}`}
              onClick={toggleLike}
              disabled={isLiking}
              aria-label={liked ? "Unlike mural" : "Like mural"}
              aria-pressed={liked}
            >
              <Heart aria-hidden="true" fill={liked ? "currentColor" : "none"} />
              <span>{likeCount}</span>
            </button>
            <button
              type="button"
              className="mural-action-icon"
              onClick={focusComments}
              aria-label={`View ${comments.length} comments`}
            >
              <MessageCircle aria-hidden="true" />
              <span className="sr-only">Comments</span>
            </button>
            <button
              type="button"
              className="mural-action-icon"
              onClick={shareMural}
              aria-label="Share mural"
            >
              <Share2 aria-hidden="true" />
            </button>
            <div className="mural-more-wrap">
              <button
                type="button"
                className="mural-action-icon"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label="More options"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
              >
                <MoreHorizontal aria-hidden="true" />
              </button>
              {isMenuOpen && (
                <div className="mural-more-menu" role="menu">
                  <button type="button" role="menuitem" onClick={copyMuralLink}>
                    Copy link
                  </button>
                  {mural.author && (
                    <Link
                      href={`/artists/${mural.author.id}`}
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View artist
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          <h1>{mural.name}</h1>
          <p className="mural-description">{mural.description}</p>

          {mural.author && (
            <Link className="mural-author" href={`/artists/${mural.author.id}`}>
              {mural.author.image ? (
                <Image
                  src={mural.author.image}
                  alt=""
                  width={48}
                  height={48}
                  className="mural-author-avatar"
                />
              ) : (
                <span className="mural-author-avatar mural-author-avatar--fallback" aria-hidden="true">
                  {mural.author.name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span>
                <span className="mural-author-label">Shared by</span>
                <strong>{mural.author.name}</strong>
              </span>
              <ArrowUpRight className="mural-author-arrow" aria-hidden="true" />
            </Link>
          )}
          {mural.visitUrl && (
            <a
              className="mural-visit-link"
              href={mural.visitUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="mural-author-label">Visit</span>
              <strong>{mural.visitUrl}</strong>
              <ArrowUpRight className="mural-author-arrow" aria-hidden="true" />
            </a>
          )}

          <section
            ref={commentsSectionRef}
            className="mural-comments"
            aria-labelledby="mural-comments-heading"
          >
            <div className="mural-comments-heading">
              <h2 id="mural-comments-heading">Comments</h2>
              <span>{comments.length}</span>
            </div>
            {currentUserId ? (
              <form className="mural-comment-form" onSubmit={submitComment}>
                <label className="sr-only" htmlFor="mural-comment">
                  Write a comment
                </label>
                <textarea
                  id="mural-comment"
                  ref={commentInputRef}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="What stands out to you about this mural?"
                  maxLength={1000}
                  required
                />
                <div className="mural-comment-submit">
                  <span>{comment.length}/1000</span>
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !comment.trim()}
                  >
                    {isSubmittingComment ? "Posting..." : "Comment"}
                  </button>
                </div>
              </form>
            ) : (
              <p className="mural-sign-in-prompt">
                <Link href="/login">Sign in</Link> to leave a comment.
              </p>
            )}

            {comments.length ? (
              <ul className="mural-comment-list">
                {comments.map((item) => (
                  <li className="mural-comment" key={item.id}>
                    {item.user.image ? (
                      <Image
                        src={item.user.image}
                        alt=""
                        width={36}
                        height={36}
                        className="mural-comment-avatar"
                      />
                    ) : (
                      <span className="mural-comment-avatar mural-comment-avatar--fallback" aria-hidden="true">
                        {item.user.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <div className="mural-comment-meta">
                        <Link href={`/artists/${item.user.id}`}>{item.user.name}</Link>
                        <time dateTime={item.createdAt}>
                          {new Intl.DateTimeFormat("en", {
                            day: "numeric",
                            month: "short",
                          }).format(new Date(item.createdAt))}
                        </time>
                      </div>
                      <p>{item.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mural-comments-empty">No comments yet. Start the conversation.</p>
            )}
          </section>
        </div>
      </article>
    </>
  );
}
