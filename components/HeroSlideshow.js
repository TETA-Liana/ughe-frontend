"use client";
// Slideshow. Each slide (from Django Admin) can hold ONE or SEVERAL images/videos;
// several are shown side by side, like the three photos in the screenshot.
// Supported media: uploaded image, uploaded video (.mp4/.webm), image URL, video URL, YouTube link.
import { useCallback, useEffect, useState } from "react";

function Media({ item }) {
  if (item.media_type === "video") {
    if (item.youtube_id) {
      const id = item.youtube_id;
      const src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&modestbranding=1&playsinline=1`;
      return (
        <div className="yt">
          <iframe src={src} title={item.alt_text || "UGHE video"} allow="autoplay; encrypted-media" />
        </div>
      );
    }
    return <video src={item.src} autoPlay muted loop playsInline aria-label={item.alt_text} />;
  }
  return <img src={item.src} alt={item.alt_text || ""} />;
}

export default function HeroSlideshow({ slides }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback((n) => setIndex(((n % count) + count) % count), [count]);

  // Auto-advance using the per-slide duration set in Django Admin
  useEffect(() => {
    if (count < 2) return;
    const seconds = slides[index]?.duration_seconds || 7;
    const timer = setTimeout(() => go(index + 1), seconds * 1000);
    return () => clearTimeout(timer);
  }, [index, count, slides, go]);

  if (count === 0) return null;

  return (
    <section className="container" aria-roledescription="carousel" aria-label="Highlights">
      <div className="hero">
        {slides.map((slide, i) => (
          <div key={slide.id} className={`slide ${i === index ? "active" : ""}`} aria-hidden={i !== index}>
            <div
              className="slide-media"
              style={{ gridTemplateColumns: `repeat(${Math.max(slide.media.length, 1)}, 1fr)` }}
            >
              {/* Only mount videos of the visible slide so hidden ones don't play */}
              {slide.media.map((m) =>
                m.media_type === "video" && i !== index ? <div key={m.id} /> : <Media key={m.id} item={m} />
              )}
            </div>
            <div className="slide-overlay" style={{ opacity: slide.overlay_opacity }} />
            <div className="slide-caption">
              <h2>{slide.heading}</h2>
              {slide.button_text && (
                <a className="explore-btn" href={slide.button_url || "#"} target="_blank" rel="noopener noreferrer">
                  {slide.button_text}
                </a>
              )}
            </div>
          </div>
        ))}

        {count > 1 && (
          <>
            <button className="hero-arrow prev" aria-label="Previous slide" onClick={() => go(index - 1)}>‹</button>
            <button className="hero-arrow next" aria-label="Next slide" onClick={() => go(index + 1)}>›</button>
            <div className="hero-dots">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  className={i === index ? "active" : ""}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
