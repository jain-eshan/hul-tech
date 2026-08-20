import { notFound } from "next/navigation";
import { creatorPosts } from "@/data/creatorPosts";

// Renderable fixture pages. These exist so the snapshot pipeline has something real to
// render, hash and store — the capture is genuine even though the post is simulated.
// Deliberately plain HTML with no app chrome, because the snapshot should look like a
// captured third-party page, not like a screen from this product.

// The captured DOM should look like the page it is standing in for, down to the
// title — a snapshot whose <title> reads "PRAMAAN" is evidence about this product
// rather than about the post.
export function generateMetadata({ params }: { params: { id: string } }) {
  const post = creatorPosts.find((p) => p.id === params.id);
  return { title: post ? `${post.handle} on ${post.platform}` : "Post" };
}

export function generateStaticParams() {
  return creatorPosts.map((p) => ({ id: p.id }));
}

export default function FixturePost({ params }: { params: { id: string } }) {
  const post = creatorPosts.find((p) => p.id === params.id);
  if (!post) notFound();

  const visible = post.caption.slice(0, post.foldIndex);
  const hidden = post.caption.slice(post.foldIndex);

  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <div data-post-card style={{ maxWidth: 470, margin: "0 auto", border: "1px solid #dbdbdb", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: "1px solid #efefef" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#dc2743" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{post.handle}</div>
            <div style={{ fontSize: 11, color: "#8e8e8e" }}>{post.followers} followers · {post.platform}</div>
          </div>
        </div>

        {/* Flat fill rather than a gradient: PNG compresses a gradient's dithering
            terribly, and the snapshot exists to preserve what the caption SAID. */}
        <div style={{ aspectRatio: "1/1", background: "#ded7cc", display: "flex", alignItems: "flex-end", padding: 18 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#5c5346", fontWeight: 600 }}>
            {post.brand}
          </div>
        </div>

        <div style={{ padding: "12px 14px", fontSize: 13, lineHeight: 1.5 }}>
          <span style={{ fontWeight: 600 }}>{post.handle}</span>{" "}
          <span>{visible}</span>
          {hidden && (
            <>
              <span style={{ color: "#8e8e8e" }}>… more</span>
              {/* Hidden behind the fold. affil.ai's point exactly: disclosures hide here,
                  so the capture must expand collapsed content before hashing. */}
              <span data-collapsed="true" style={{ display: "none" }}>{hidden}</span>
            </>
          )}
          <div style={{ fontSize: 11, color: "#8e8e8e", marginTop: 8 }}>
            {new Date(post.postedAt).toUTCString()}
          </div>
        </div>
      </div>
    </div>
  );
}
