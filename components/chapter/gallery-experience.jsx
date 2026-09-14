"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { gallery } from "@/data/gallery";
import { useMotionReady } from "./motion";

const years = ["2026–27", "2025–26", "2024–25"];
const railOffsets = [-2, -1, 0, 1, 2];

const scatterMap = [
  { x: 1, y: 38, w: 21, h: 220, r: -2.4 },
  { x: 29, y: 172, w: 23, h: 260, r: 1.6 },
  { x: 64, y: 20, w: 19, h: 205, r: 2.2 },
  { x: 78, y: 312, w: 20, h: 232, r: -1.5 },
  { x: 7, y: 390, w: 17, h: 195, r: 1.8 },
  { x: 42, y: 485, w: 22, h: 220, r: -2 },
  { x: 82, y: 66, w: 15, h: 174, r: 1.3 },
  { x: 22, y: 520, w: 15, h: 176, r: 2.5 }
];

const imageVariants = {
  enter: (flight) => flight.valid
    ? { x: flight.enterX, y: flight.enterY, scale: 0.14, opacity: 0.18 }
    : { x: 0, y: 18, scale: 0.965, opacity: 0 },
  center: { x: 0, y: 0, scale: 1, opacity: 1 },
  exit: (flight) => flight.valid
    ? { x: flight.exitX, y: flight.exitY, scale: 0.14, opacity: 0.18 }
    : { x: 0, y: -12, scale: 0.98, opacity: 0 }
};

function wrapIndex(value, total) {
  return ((value % total) + total) % total;
}

function shortestDistance(from, to, total) {
  let distance = to - from;
  if (distance > total / 2) distance -= total;
  if (distance < -total / 2) distance += total;
  return distance;
}

function centerOf(rect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function CarouselArrow({ direction }) {
  const previous = direction === "previous";
  return (
    <svg viewBox="0 0 44 32" aria-hidden="true">
      <path
        d={previous
          ? "M20 5.5c0 6.3-3.2 10.5-10.5 10.5C16.8 16 20 20.2 20 26.5M9.5 16H37"
          : "M24 5.5c0 6.3 3.2 10.5 10.5 10.5C27.2 16 24 20.2 24 26.5M34.5 16H7"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function scatterStyle(index) {
  const item = scatterMap[index % scatterMap.length];
  const band = Math.floor(index / scatterMap.length);
  const mirror = band % 2 === 1;

  return {
    "--archive-x": `${mirror ? Math.max(1, 100 - item.x - item.w) : item.x}%`,
    "--archive-y": `${band * 720 + item.y}px`,
    "--archive-w": `${item.w}%`,
    "--archive-h": `${item.h}px`,
    "--archive-r": `${mirror ? -item.r : item.r}deg`,
    "--archive-delay": `${Math.min(index * 14, 320)}ms`
  };
}

export default function GalleryExperience() {
  const [year, setYear] = useState("2025–26");
  const [category, setCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(null);
  const [organizingId, setOrganizingId] = useState(null);
  const [flight, setFlight] = useState({ valid: false, enterX: 0, enterY: 0, exitX: 0, exitY: 0 });
  const motionReady = useMotionReady();
  const mediaRef = useRef(null);
  const mainFigureRef = useRef(null);
  const activeSlotRef = useRef(null);
  const thumbRefs = useRef(new Map());
  const activeIndexRef = useRef(null);
  const queuedIndexRef = useRef(null);
  const switchTimerRef = useRef(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(gallery.filter((photo) => photo.schoolYear === year).map((photo) => photo.category)))],
    [year]
  );

  const photos = useMemo(
    () => gallery.filter((photo) => photo.schoolYear === year && (category === "All" || photo.category === category)),
    [year, category]
  );

  const collagePhotos = useMemo(() => {
    const score = (value) => Array.from(`${value}-${year}-${category}`).reduce(
      (total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0,
      7
    );
    return [...photos].sort((a, b) => score(a.id) - score(b.id));
  }, [photos, year, category]);

  const railEntries = useMemo(() => {
    if (activeIndex === null || !photos.length) return [];
    const seen = new Set();
    return railOffsets.flatMap((offset) => {
      const index = wrapIndex(activeIndex + offset, photos.length);
      if (seen.has(index)) return [];
      seen.add(index);
      return [{ offset, index, photo: photos[index] }];
    });
  }, [activeIndex, photos]);

  const scatterHeight = Math.max(720, Math.ceil(collagePhotos.length / scatterMap.length) * 720 + 30);
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => () => {
    if (switchTimerRef.current) window.clearTimeout(switchTimerRef.current);
  }, []);

  function resetView(nextYear = year, nextCategory = category) {
    setYear(nextYear);
    setCategory(nextCategory);
    setActiveIndex(null);
    setOrganizingId(null);
    activeIndexRef.current = null;
    queuedIndexRef.current = null;
    if (switchTimerRef.current) window.clearTimeout(switchTimerRef.current);
    switchTimerRef.current = null;
    setFlight({ valid: false, enterX: 0, enterY: 0, exitX: 0, exitY: 0 });
  }

  function openPhoto(photo) {
    if (organizingId) return;
    const index = photos.findIndex((item) => item.id === photo.id);
    setOrganizingId(photo.id);

    window.setTimeout(() => {
      setFlight({ valid: false, enterX: 0, enterY: 0, exitX: 0, exitY: 0 });
      activeIndexRef.current = index;
      setActiveIndex(index);
      setOrganizingId(null);
      requestAnimationFrame(() => {
        document.getElementById("archive-focus")?.scrollIntoView({
          block: "center",
          behavior: motionReady ? "smooth" : "auto"
        });
      });
    }, motionReady ? 360 : 0);
  }

  function selectFocusedPhoto(nextIndex) {
    const currentIndex = activeIndexRef.current;
    if (currentIndex === null || nextIndex === currentIndex || !photos.length) return;

    if (switchTimerRef.current) {
      queuedIndexRef.current = nextIndex;
      return;
    }

    const destinationRect = mainFigureRef.current?.getBoundingClientRect() || mediaRef.current?.getBoundingClientRect();
    const sourceRect = thumbRefs.current.get(nextIndex)?.getBoundingClientRect();
    const slotRect = activeSlotRef.current?.getBoundingClientRect();
    const distance = shortestDistance(currentIndex, nextIndex, photos.length);

    if (motionReady && destinationRect && sourceRect && slotRect) {
      const destination = centerOf(destinationRect);
      const source = centerOf(sourceRect);
      const slot = centerOf(slotRect);
      const mirroredTarget = { x: source.x, y: slot.y - (source.y - slot.y) };

      setFlight({
        valid: true,
        enterX: source.x - destination.x,
        enterY: source.y - destination.y,
        exitX: mirroredTarget.x - destination.x,
        exitY: mirroredTarget.y - destination.y
      });
    } else {
      const direction = Math.sign(distance) || 1;
      setFlight({
        valid: motionReady,
        enterX: -Math.min(window.innerWidth * 0.58, 760),
        enterY: direction * 88,
        exitX: -Math.min(window.innerWidth * 0.58, 760),
        exitY: -direction * 88
      });
    }

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
    switchTimerRef.current = window.setTimeout(() => {
      switchTimerRef.current = null;
      const queuedIndex = queuedIndexRef.current;
      queuedIndexRef.current = null;
      if (queuedIndex !== null && queuedIndex !== activeIndexRef.current) {
        selectFocusedPhoto(queuedIndex);
      }
    }, 620);
  }

  function changePhoto(step) {
    const currentIndex = activeIndexRef.current;
    if (!photos.length || currentIndex === null) return;
    selectFocusedPhoto(wrapIndex(currentIndex + step, photos.length));
  }

  function closeFocus() {
    if (switchTimerRef.current) window.clearTimeout(switchTimerRef.current);
    switchTimerRef.current = null;
    queuedIndexRef.current = null;
    activeIndexRef.current = null;
    setActiveIndex(null);
  }

  return (
    <div className="archive-shell">
      <div className="archive-year-tabs" aria-label="Choose a school year">
        {years.map((option) => (
          <button key={option} aria-pressed={year === option} onClick={() => resetView(option, "All")}>
            {option}
          </button>
        ))}
      </div>

      <div className="archive-collection">
        <div className="archive-toolbar">
          <div className="archive-filters" aria-label="Photo category">
            {categories.map((option) => (
              <button
                key={option}
                aria-pressed={category === option}
                onClick={() => resetView(year, option)}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="eyebrow" aria-live="polite">{year} / {photos.length} PHOTOS</p>
        </div>

        {photos.length ? (
          <>
            {activePhoto === null ? (
              <div
                className={`archive-scatter${organizingId ? " is-organizing" : ""}`}
                aria-label="Scattered chapter photo gallery"
                style={{ "--archive-scatter-height": `${scatterHeight}px` }}
              >
                {collagePhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    className={`archive-scatter-photo frame-tone-${index % 5}${organizingId === photo.id ? " is-chosen" : ""}`}
                    style={scatterStyle(index)}
                    aria-label={`Open ${photo.alt}`}
                    onClick={() => openPhoto(photo)}
                  >
                    <img src={photo.src} alt={photo.alt} loading={index < 8 ? "eager" : "lazy"} />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="archive-focus" id="archive-focus">
                <aside className="archive-rail" aria-label="Choose a chapter photo">
                  {railEntries.map(({ offset, index, photo }) => offset === 0 ? (
                    <div
                      ref={activeSlotRef}
                      className="archive-rail-slot"
                      key={`slot-${photo.id}`}
                      style={{ "--archive-rail-offset": offset }}
                      aria-label={`Current image position ${index + 1}`}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                  ) : (
                    <button
                      ref={(node) => {
                        if (node) thumbRefs.current.set(index, node);
                        else thumbRefs.current.delete(index);
                      }}
                      key={photo.id}
                      className={`archive-rail-thumb frame-tone-${index % 5}`}
                      style={{ "--archive-rail-offset": offset }}
                      aria-label={`View ${photo.alt}`}
                      onClick={() => selectFocusedPhoto(index)}
                    >
                      <img src={photo.src} alt="" loading="eager" />
                    </button>
                  ))}
                </aside>

                <div className={`archive-stage frame-tone-${activeIndex % 5}`}>
                  <div className="archive-stage-topline">
                    <button className="archive-scatter-return" onClick={closeFocus}>
                      ← Scatter the collection
                    </button>
                    <p>{String(activeIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</p>
                  </div>

                  <div ref={mediaRef} className="archive-main-media">
                    <AnimatePresence
                      initial={false}
                      custom={flight}
                      mode="sync"
                    >
                      <motion.figure
                        ref={mainFigureRef}
                        key={activePhoto.id}
                        custom={flight}
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                        className={`archive-main-figure frame-tone-${activeIndex % 5}`}
                      >
                        <img src={activePhoto.src} alt={activePhoto.alt} draggable="false" />
                      </motion.figure>
                    </AnimatePresence>
                  </div>

                  <div className="archive-carousel-controls">
                    <button aria-label="Previous photo" onClick={() => changePhoto(-1)}>
                      <CarouselArrow direction="previous" />
                    </button>
                    <div>
                      <p>{activePhoto.alt}</p>
                      <span>{activePhoto.schoolYear} archive · {activePhoto.category}</span>
                    </div>
                    <button aria-label="Next photo" onClick={() => changePhoto(1)}>
                      <CarouselArrow direction="next" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <p className="archive-year-note">
              {year === "2024–25"
                ? "The Embrace the Challenge season, RLC medal moments, February social, and SLC 2025 are preserved in the 2024–25 archive."
                : "Select any frame to gather the collection into the focused viewer."}
            </p>
          </>
        ) : (
          <div className="archive-empty-state">
            <p className="eyebrow">2026–2027 / COMING SOON</p>
            <h2>A new year.<br />A new story.</h2>
            <p>Current-year chapter photos will appear here once their dates and public-use permissions are verified. Explore the archive in the meantime.</p>
            <button className="action" onClick={() => resetView("2025–26", "All")}>Explore 2025–26 ↗</button>
          </div>
        )}
      </div>
    </div>
  );
}
