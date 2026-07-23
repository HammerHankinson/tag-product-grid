import { useEffect, useRef, useState } from 'react';
import { products } from '../data/products';

export default function ProductGrid() {
  const railRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScrollPrevious: false,
    canScrollNext: false,
  });

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) return undefined;

    const updateScrollState = () => {
      const maximumScroll = rail.scrollWidth - rail.clientWidth;

      setScrollState({
        canScrollPrevious: rail.scrollLeft > 1,
        canScrollNext: rail.scrollLeft < maximumScroll - 1,
      });
    };

    updateScrollState();
    rail.addEventListener('scroll', updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(rail);

    return () => {
      rail.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollRail = (direction) => {
    const rail = railRef.current;

    if (!rail) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    rail.scrollBy({
      left: direction * rail.clientWidth,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section className="product-section" aria-labelledby="best-sellers-title">
      <div className="section-heading">
        <h1 id="best-sellers-title">Best Sellers</h1>
        <a href="/collections/best-sellers" className="shop-all-link">
          Shop All
        </a>
      </div>

      <div className="rail-controls" aria-label="Product carousel controls">
        <button
          className="rail-control"
          type="button"
          aria-label="Show previous products"
          aria-controls="best-sellers-rail"
          disabled={!scrollState.canScrollPrevious}
          onClick={() => scrollRail(-1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          className="rail-control"
          type="button"
          aria-label="Show next products"
          aria-controls="best-sellers-rail"
          disabled={!scrollState.canScrollNext}
          onClick={() => scrollRail(1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
      <div
        id="best-sellers-rail"
        ref={railRef}
        className="product-rail"
        role="region"
        aria-label="Best-selling products"
        tabIndex="0"
      >
        {products.map((product, index) => {
          const primaryImage = product.variants[0].images[0];
          const alternateImage = product.variants[0].images[1];

          return (
            <article
              key={product.id}
              className="product-card"
              style={{ '--stagger-index': index }}
            >
              <div
                className="product-media"
                aria-label={`View ${product.name}`}
              >
                <img
                  className="product-image product-image-primary"
                  src={primaryImage.src}
                  alt={primaryImage.alt}
                />
                {alternateImage && (
                  <img
                    className="product-image product-image-alternate"
                    src={alternateImage.src}
                    alt=""
                    aria-hidden="true"
                  />
                )}

                {!!product.badges && (
                  <div className="product-badges" aria-label="Product labels">
                    {product.badges.map((badge) => (
                      <span
                        className={`badge badge-${badge.toLowerCase()}`}
                        key={badge}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="product-details">
                <h2>
                  <a href={`/products/${product.id}`}>{product.name}</a>
                </h2>
                <p>{product.subtitle}</p>
                <p className="product-price">${product.price}</p>

                <div className="product-swatches" aria-label="Available colors">
                  <span className="swatch" data-swatch="tan" title="Tan" />
                  <span className="swatch" data-swatch="beige" title="Beige" />
                  <span className="swatch" data-swatch="grey" title="Grey" />
                  <span className="swatch" data-swatch="brown" title="Brown" />
                  <span className="swatch" data-swatch="blue" title="Blue" />
                  <span className="additional-variations">+12</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
