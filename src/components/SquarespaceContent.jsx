'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

function normalizeSquarespaceHtml(rawHtml) {
  if (!rawHtml) return '';

  let html = rawHtml;

  // 1. Remove <noscript>...</noscript> blocks so lazy-loaded gallery images don't duplicate
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/gi, '');

  // 2. Remove <template class="js-cdk-image-lightbox-template">...</template>
  html = html.replace(/<template[^>]*>[\s\S]*?<\/template>/gi, '');

  // 3. Upgrade protocol-relative and http squarespace image URLs to https
  html = html.replace(/(src|data-src|data-image)="\/\/images\.squarespace-cdn\.com/gi, '$1="https://images.squarespace-cdn.com');
  html = html.replace(/(src|data-src|data-image)="http:\/\/images\.squarespace-cdn\.com/gi, '$1="https://images.squarespace-cdn.com');

  // 4. Ensure every <img ... data-src="..."> that lacks a src="..." attribute gets src="..."
  html = html.replace(/<img\b([^>]*?)>/gi, (fullTag, attrs) => {
    if (/\bsrc\s*=\s*["'][^"']+["']/i.test(attrs)) {
      return fullTag;
    }
    const dataSrcMatch =
      attrs.match(/\bdata-src\s*=\s*["']([^"']+)["']/i) ||
      attrs.match(/\bdata-image\s*=\s*["']([^"']+)["']/i);
    if (dataSrcMatch) {
      return `<img src="${dataSrcMatch[1]}" ${attrs}>`;
    }
    return fullTag;
  });

  // 5. Rewrite internal conleytrust.com links to relative paths
  html = html.replace(/href="https?:\/\/(?:www\.)?conleytrust\.com(\/[^"]*)"/gi, 'href="$1"');
  html = html.replace(/href="\/main"/gi, 'href="/business-overview"');

  return html;
}

function ContactFormBlock() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="cft-form"
        style={{
          padding: '24px 0',
          fontSize: '20px',
          fontWeight: 500,
        }}
      >
        <p>Thank you!</p>
      </div>
    );
  }

  return (
    <form className="cft-form" onSubmit={handleSubmit}>
      <div className="cft-form-group">
        <label className="cft-form-label">
          Name <span>(required)</span>
        </label>
        <div className="cft-form-row">
          <div>
            <input
              type="text"
              required
              className="cft-form-input"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <span className="cft-form-sublabel">First Name</span>
          </div>
          <div>
            <input
              type="text"
              required
              className="cft-form-input"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <span className="cft-form-sublabel">Last Name</span>
          </div>
        </div>
      </div>

      <div className="cft-form-group">
        <label className="cft-form-label">
          Email Address <span>(required)</span>
        </label>
        <input
          type="email"
          required
          className="cft-form-input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="cft-form-group">
        <label className="cft-form-label">
          Subject <span>(required)</span>
        </label>
        <input
          type="text"
          required
          className="cft-form-input"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
      </div>

      <div className="cft-form-group">
        <label className="cft-form-label">
          Message <span>(required)</span>
        </label>
        <textarea
          required
          className="cft-form-textarea"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <div>
        <button
          type="submit"
          className="sqs-block-button-element sqs-block-button-element--medium"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

function GalleryCollectionView({ page, onOpenLightbox }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const items = page.items || [];

  return (
    <div className="sqs-layout sqs-grid-12 columns-12">
      <div className="row sqs-row">
        <div className="col sqs-col-12 span-12">
          <div className="sqs-block html-block sqs-block-html">
            <div className="sqs-block-content">
              <div className="sqs-html-content">
                <h3 style={{ textAlign: 'center' }}>{page.title}</h3>
                {page.description && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: normalizeSquarespaceHtml(page.description),
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <hr />

          {/* Featured Slideshow Player */}
          {items.length > 0 && (
            <div style={{ marginBottom: '44px' }}>
              <div
                style={{
                  position: 'relative',
                  backgroundColor: 'rgba(0,0,0,0.28)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  maxWidth: '1000px',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '16 / 10',
                    maxHeight: '560px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.35)',
                  }}
                >
                  <img
                    src={items[activeSlide]?.assetUrl}
                    alt={items[activeSlide]?.title || page.title}
                    onClick={() =>
                      onOpenLightbox({
                        src: items[activeSlide]?.assetUrl,
                        caption:
                          items[activeSlide]?.title ||
                          items[activeSlide]?.body?.replace(/<[^>]+>/g, '') ||
                          '',
                      })
                    }
                    style={{
                      maxWidth: '100%',
                      maxHeight: '560px',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      cursor: 'zoom-in',
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() =>
                      setActiveSlide((prev) => (prev - 1 + items.length) % items.length)
                    }
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.55)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.35)',
                      width: '44px',
                      height: '44px',
                      cursor: 'pointer',
                      fontSize: '20px',
                    }}
                  >
                    &#10094;
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => setActiveSlide((prev) => (prev + 1) % items.length)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.55)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.35)',
                      width: '44px',
                      height: '44px',
                      cursor: 'pointer',
                      fontSize: '20px',
                    }}
                  >
                    &#10095;
                  </button>
                </div>

                {(items[activeSlide]?.title || items[activeSlide]?.body) && (
                  <div
                    style={{
                      padding: '18px 24px',
                      background: 'rgba(0,0,0,0.45)',
                      borderTop: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    {items[activeSlide]?.title && (
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                        {items[activeSlide].title}
                      </h4>
                    )}
                    {items[activeSlide]?.body && (
                      <div
                        style={{ fontSize: '15px', lineHeight: '1.5' }}
                        dangerouslySetInnerHTML={{
                          __html: normalizeSquarespaceHtml(items[activeSlide].body),
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Packed Thumbnail Grid of all Gallery Items */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => {
                  setActiveSlide(idx);
                  onOpenLightbox({
                    src: item.assetUrl,
                    caption:
                      item.title ||
                      (item.body ? item.body.replace(/<[^>]+>/g, '') : ''),
                  });
                }}
                style={{
                  background: 'rgba(0,0,0,0.18)',
                  border:
                    idx === activeSlide
                      ? '2px solid #e74f26'
                      : '1px solid rgba(255,255,255,0.14)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div style={{ aspectRatio: '4 / 3', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={item.assetUrl}
                    alt={item.title || item.filename || `Gallery item ${idx + 1}`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
                {(item.title || item.body) && (
                  <div style={{ padding: '12px 14px' }}>
                    {item.title && (
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '14px',
                          marginBottom: item.body ? '6px' : 0,
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.title}
                      </div>
                    )}
                    {item.body && (
                      <div
                        style={{
                          fontSize: '13px',
                          lineHeight: '1.45',
                          opacity: 0.9,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: normalizeSquarespaceHtml(item.body),
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SquarespaceContent({ page }) {
  const router = useRouter();
  const containerRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);

  const normalizedHtml = useMemo(
    () => normalizeSquarespaceHtml(page?.mainContent || ''),
    [page?.mainContent]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const timers = [];

    // 1. Hydrate Squarespace Gallery Blocks (.sqs-block-gallery)
    const galleryBlocks = container.querySelectorAll('.sqs-block-gallery');
    galleryBlocks.forEach((block) => {
      if (block.dataset.cftHydrated === 'true') return;
      block.dataset.cftHydrated = 'true';

      let config = {};
      try {
        if (block.dataset.blockJson) {
          config = JSON.parse(block.dataset.blockJson);
        }
      } catch (e) {
        // ignore JSON parse issues
      }

      const imgs = Array.from(block.querySelectorAll('.sqs-gallery img')).map((img) => ({
        src:
          img.getAttribute('src') ||
          img.getAttribute('data-src') ||
          img.getAttribute('data-image') ||
          '',
        alt: img.getAttribute('alt') || '',
      })).filter((i) => Boolean(i.src));

      if (imgs.length === 0) return;

      const isGrid =
        config.design === 'grid' ||
        block.querySelector('.sqs-gallery-block-grid') !== null;

      if (isGrid) {
        const gridEl = document.createElement('div');
        gridEl.className = 'cft-grid-gallery';
        imgs.forEach((imgObj) => {
          const item = document.createElement('div');
          item.className = 'cft-grid-gallery-item';
          const image = document.createElement('img');
          image.src = imgObj.src;
          image.alt = imgObj.alt;
          image.loading = 'lazy';
          item.appendChild(image);
          item.addEventListener('click', () => {
            setLightbox({ src: imgObj.src, caption: imgObj.alt });
          });
          gridEl.appendChild(item);
        });
        const contentEl = block.querySelector('.sqs-block-content') || block;
        contentEl.innerHTML = '';
        contentEl.appendChild(gridEl);
      } else {
        // Slider / Slideshow
        const wrapper = document.createElement('div');
        wrapper.className = 'cft-slider-wrapper';
        if (block.dataset.aspectRatio) {
          wrapper.dataset.ratio = block.dataset.aspectRatio;
        }

        const slides = imgs.map((imgObj, idx) => {
          const slide = document.createElement('div');
          slide.className = `cft-slider-slide${idx === 0 ? ' active' : ''}`;
          const image = document.createElement('img');
          image.src = imgObj.src;
          image.alt = imgObj.alt;
          slide.appendChild(image);
          wrapper.appendChild(slide);
          return slide;
        });

        let currentIndex = 0;
        const dots = [];

        const showSlide = (nextIdx) => {
          slides[currentIndex].classList.remove('active');
          if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
          currentIndex = (nextIdx + slides.length) % slides.length;
          slides[currentIndex].classList.add('active');
          if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        };

        if (slides.length > 1) {
          const prevBtn = document.createElement('button');
          prevBtn.type = 'button';
          prevBtn.className = 'cft-slider-btn prev';
          prevBtn.innerHTML = '&#10094;';
          prevBtn.setAttribute('aria-label', 'Previous slide');
          prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));

          const nextBtn = document.createElement('button');
          nextBtn.type = 'button';
          nextBtn.className = 'cft-slider-btn next';
          nextBtn.innerHTML = '&#10095;';
          nextBtn.setAttribute('aria-label', 'Next slide');
          nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

          wrapper.appendChild(prevBtn);
          wrapper.appendChild(nextBtn);

          const dotsContainer = document.createElement('div');
          dotsContainer.className = 'cft-slider-dots';
          slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `cft-slider-dot${idx === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            dot.addEventListener('click', () => showSlide(idx));
            dotsContainer.appendChild(dot);
            dots.push(dot);
          });
          wrapper.appendChild(dotsContainer);

          const durationSec = Number(config['autoplay-duration']) || 4;
          const timer = setInterval(() => {
            showSlide(currentIndex + 1);
          }, durationSec * 1000);
          timers.push(timer);
        }

        const contentEl = block.querySelector('.sqs-block-content') || block;
        contentEl.innerHTML = '';
        contentEl.appendChild(wrapper);
      }
    });

    // 2. Hydrate Squarespace Video Blocks (.sqs-video-wrapper[data-html])
    const videoWrappers = container.querySelectorAll('.sqs-video-wrapper[data-html]');
    videoWrappers.forEach((vw) => {
      if (vw.dataset.cftHydrated === 'true') return;
      vw.dataset.cftHydrated = 'true';
      const rawEmbed = vw.getAttribute('data-html');
      if (rawEmbed) {
        vw.innerHTML = rawEmbed.replace(
          /<iframe/i,
          '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"'
        );
      }
    });

    // 2b. Hydrate Squarespace Social Links SVG sprite references (.sqs-svg-icon--wrapper)
    const socialWrappers = container.querySelectorAll('.sqs-svg-icon--wrapper');
    socialWrappers.forEach((sw) => {
      if (sw.dataset.cftHydrated === 'true') return;
      sw.dataset.cftHydrated = 'true';
      if (sw.classList.contains('facebook')) {
        sw.innerHTML =
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>';
      } else if (sw.classList.contains('pinterest')) {
        sw.innerHTML =
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 2C6.486 2 2 6.486 2 12.017c0 4.245 2.636 7.87 6.358 9.327-.088-.791-.167-2.006.035-2.87.182-.781 1.174-4.976 1.174-4.976s-.3-.599-.3-1.484c0-1.391.806-2.429 1.809-2.429.853 0 1.265.641 1.265 1.409 0 .858-.546 2.142-.828 3.332-.236.996.499 1.808 1.481 1.808 1.778 0 3.144-1.875 3.144-4.581 0-2.395-1.721-4.07-4.178-4.07-2.846 0-4.517 2.135-4.517 4.341 0 .86.331 1.781.745 2.282.082.099.094.186.069.287-.076.314-.245.996-.278 1.135-.044.183-.146.222-.337.134-1.249-.582-2.03-2.408-2.03-3.876 0-3.156 2.293-6.055 6.612-6.055 3.471 0 6.169 2.473 6.169 5.78 0 3.449-2.174 6.225-5.192 6.225-1.014 0-1.967-.527-2.293-1.148l-.624 2.378c-.226.869-.835 1.958-1.244 2.621.938.29 1.933.446 2.966.446 5.531 0 10.017-4.486 10.017-10.017S17.548 2 12.017 2z"/></svg>';
      } else if (sw.classList.contains('twitter-unauth') || sw.classList.contains('twitter')) {
        sw.innerHTML =
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>';
      }
    });

    // 3. Hydrate Lightbox buttons (.js-lightbox-trigger)
    const lightboxBtns = container.querySelectorAll('.js-lightbox-trigger');
    lightboxBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const img = btn.querySelector('img');
        const src =
          img?.getAttribute('src') ||
          img?.getAttribute('data-src') ||
          img?.getAttribute('data-image');
        const descHtml = btn.getAttribute('data-description') || '';
        const caption = descHtml.replace(/<[^>]+>/g, '').trim();
        if (src) {
          setLightbox({ src, caption });
        }
      });
    });

    // 4. Intercept internal links for smooth Next.js client navigation
    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      const target = anchor.getAttribute('target');
      if (!href || target === '_blank') return;
      if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        router.push(href);
      }
    };

    container.addEventListener('click', handleLinkClick);

    return () => {
      timers.forEach((t) => clearInterval(t));
      container.removeEventListener('click', handleLinkClick);
    };
  }, [normalizedHtml, router]);

  if (!page) return null;

  const isContactPage = page.slug === 'contact-form';
  const isGalleryCollection = page.typeName === 'gallery' && page.items?.length > 0;

  return (
    <section className="Main-content">
      {/* Banner Image on Contact Page */}
      {isContactPage && page.mainImage && (
        <div className="Page-banner">
          <img src={page.mainImage} alt={page.title} />
        </div>
      )}

      {isGalleryCollection ? (
        <GalleryCollectionView
          page={page}
          onOpenLightbox={(item) => setLightbox(item)}
        />
      ) : isContactPage ? (
        <div className="sqs-layout sqs-grid-12 columns-12">
          <div className="row sqs-row">
            <div className="col sqs-col-12 span-12">
              <div className="sqs-block html-block sqs-block-html">
                <div className="sqs-block-content">
                  <div className="sqs-html-content">
                    <h3>Get in touch</h3>
                  </div>
                </div>
              </div>

              <ContactFormBlock />

              <div className="sqs-block html-block sqs-block-html">
                <div className="sqs-block-content">
                  <div className="sqs-html-content">
                    <p>
                      In the past 75 years, every effort has been made to locate the best and
                      most complete documentation supporting these descendants, but no genealogy
                      is ever complete. Additions, corrections, and donations to further work on
                      the Conley / Connally lineage are all gratefully welcomed.
                    </p>
                    <p>
                      While the family members who are public figures are very much visible, most
                      are intensely private individuals who prize discretion and restraint. Over
                      the course of two centuries, Conleys developed an abiding belief system
                      that abhors ethnic and geographic segregation. We encourage connection with
                      branches of the Conley diaspora carrying the spellings Connally, O&apos;
                      Connally, O&apos; Connolly, Ó Conghaile. Connelley, Condly, Candly
                      regardless of race, creed, or color.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: normalizedHtml }}
        />
      )}

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            cursor: 'zoom-out',
          }}
        >
          <button
            type="button"
            aria-label="Close lightbox"
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '28px',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '36px',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.caption || ''}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '92vw',
              maxHeight: '82vh',
              objectFit: 'contain',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              cursor: 'default',
            }}
          />
          {lightbox.caption && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                marginTop: '16px',
                color: '#ffffff',
                fontSize: '15px',
                maxWidth: '720px',
                textAlign: 'center',
              }}
            >
              {lightbox.caption}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
