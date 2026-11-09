import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import banner1 from '../../assets/banners/banner-1.jpg';
import banner2 from '../../assets/banners/banner-2.jpg';

const BANNERS = [
  {
    id: 1,
    image: banner1,
    title: 'Your Recovery Is Our Mission',
    buttonBox: {
      left: '4.1%',
      top: '74.5%',
      width: '26%',
      height: '8.8%',
      borderRadius: '12px',
    },
  },
  {
    id: 2,
    image: banner2,
    title: 'Your Health, Our Priority',
    buttonBox: {
      left: '4.6%',
      top: '80%',
      width: '28%',
      height: '9.2%',
      borderRadius: '14px',
    },
  },
];

export default function MaxBannerCarousel({ onBookAppointment }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-switch banner every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const handleBookAppointmentClick = (e) => {
    e?.stopPropagation();
    if (onBookAppointment) {
      onBookAppointment();
    } else {
      const el = document.getElementById('book-appointment');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Rishi Hospital Featured Highlights"
      className="w-full relative select-none overflow-hidden m-0 p-0 bg-slate-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full-width edge-to-edge banner wrapper (no side margins, no side padding) */}
      <div className="relative w-full overflow-hidden">
        {/* Base Sizing Image in natural document flow: guarantees 100% full width and exact aspect ratio */}
        <img
          src={banner1}
          alt="Sizing placeholder"
          className="w-full h-auto block select-none pointer-events-none"
          style={{ opacity: 0, visibility: 'hidden' }}
          aria-hidden="true"
        />

        {/* Slide 1 */}
        <div
          className="absolute inset-0"
          style={{
            opacity: currentIndex === 0 ? 1 : 0,
            zIndex: currentIndex === 0 ? 10 : 0,
            transition: 'opacity 700ms ease-in-out',
            pointerEvents: currentIndex === 0 ? 'auto' : 'none',
          }}
        >
          <img
            src={banner1}
            alt="Your Recovery Is Our Mission"
            className="w-full h-full object-cover"
            loading="eager"
          />

          {/* Clickable Hotspot ONLY on the 'Book an Appointment' button */}
          <button
            type="button"
            onClick={handleBookAppointmentClick}
            aria-label="Book an Appointment"
            style={{
              position: 'absolute',
              left: BANNERS[0].buttonBox.left,
              top: BANNERS[0].buttonBox.top,
              width: BANNERS[0].buttonBox.width,
              height: BANNERS[0].buttonBox.height,
              borderRadius: BANNERS[0].buttonBox.borderRadius,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: 'none',
              zIndex: 25,
            }}
            className="hover:ring-2 hover:ring-white/70 active:scale-95 transition-all shadow-sm"
            title="Book an Appointment"
          />
        </div>

        {/* Slide 2 */}
        <div
          className="absolute inset-0"
          style={{
            opacity: currentIndex === 1 ? 1 : 0,
            zIndex: currentIndex === 1 ? 10 : 0,
            transition: 'opacity 700ms ease-in-out',
            pointerEvents: currentIndex === 1 ? 'auto' : 'none',
          }}
        >
          <img
            src={banner2}
            alt="Your Health, Our Priority"
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Clickable Hotspot ONLY on the 'Book an Appointment' button */}
          <button
            type="button"
            onClick={handleBookAppointmentClick}
            aria-label="Book an Appointment"
            style={{
              position: 'absolute',
              left: BANNERS[1].buttonBox.left,
              top: BANNERS[1].buttonBox.top,
              width: BANNERS[1].buttonBox.width,
              height: BANNERS[1].buttonBox.height,
              borderRadius: BANNERS[1].buttonBox.borderRadius,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: 'none',
              zIndex: 25,
            }}
            className="hover:ring-2 hover:ring-white/70 active:scale-95 transition-all shadow-sm"
            title="Book an Appointment"
          />
        </div>

        {/* Left Arrow Navigation */}
        <button
          onClick={handlePrev}
          aria-label="Previous Banner"
          style={{ zIndex: 30 }}
          className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl"
        >
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          />
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
        </button>

        {/* Right Arrow Navigation */}
        <button
          onClick={handleNext}
          aria-label="Next Banner"
          style={{ zIndex: 30 }}
          className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl"
        >
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          />
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
        </button>

        {/* Bottom Indicators & Slide Switcher */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            zIndex: 30,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full shadow-2xl"
        >
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              style={{
                width: index === currentIndex ? '32px' : '9px',
                height: '8px',
                borderRadius: '9999px',
                backgroundColor: index === currentIndex ? '#ea580c' : 'rgba(255, 255, 255, 0.5)',
                transition: 'all 300ms ease',
                border: 'none',
                cursor: 'pointer',
              }}
            />
          ))}

          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#ffffff',
              paddingLeft: '4px',
              letterSpacing: '0.05em',
            }}
          >
            {currentIndex + 1} / {BANNERS.length}
          </span>
        </div>

        {/* Auto-switching badge */}
        <div
          style={{
            zIndex: 30,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          className="absolute top-3 sm:top-6 right-3 sm:right-8 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-semibold backdrop-blur-md shadow-lg"
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '9999px',
              backgroundColor: '#34d399',
              display: 'inline-block',
            }}
          />
          <span>Auto-switching every 5s</span>
        </div>
      </div>
    </section>
  );
}
