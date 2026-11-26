import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '../data/siteConfig';

export const metadata = {
  title: 'Conley Forever & Forever Conley',
  description: 'Conley Group Holdings — The official website of the Conley Family.',
};

export default function HomePage() {
  return (
    <main className="CoverPage">
      {/* Full-bleed 3D Wood Crest Background Image */}
      <div
        className="CoverPage-bg"
        style={{
          backgroundImage: `url("${SITE_CONFIG.coverBgUrl}")`,
        }}
      />
      <div className="CoverPage-scrim" />

      {/* Center Content */}
      <div className="CoverPage-content">
        <h1 className="CoverPage-heading">CONLEY GROUP HOLDINGS</h1>
        <div>
          <Link href="/business-overview" className="CoverPage-button">
            LEARN MORE
          </Link>
        </div>
      </div>

      {/* Bottom Social Knockout Icons */}
      <nav className="CoverPage-socials" aria-label="Social Media Links">
        {/* Facebook */}
        <a
          href="https://www.facebook.com/ConleyFamilyAssociation/"
          target="_blank"
          rel="noopener noreferrer"
          className="CoverPage-social-icon"
          aria-label="Conley Family Association on Facebook"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
          </svg>
        </a>

        {/* Pinterest */}
        <a
          href="https://www.pinterest.com/ConleyFamilyTrust/"
          target="_blank"
          rel="noopener noreferrer"
          className="CoverPage-social-icon"
          aria-label="Green Conley on Pinterest"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.017 2C6.486 2 2 6.486 2 12.017c0 4.245 2.636 7.87 6.358 9.327-.088-.791-.167-2.006.035-2.87.182-.781 1.174-4.976 1.174-4.976s-.3-.599-.3-1.484c0-1.391.806-2.429 1.809-2.429.853 0 1.265.641 1.265 1.409 0 .858-.546 2.142-.828 3.332-.236.996.499 1.808 1.481 1.808 1.778 0 3.144-1.875 3.144-4.581 0-2.395-1.721-4.07-4.178-4.07-2.846 0-4.517 2.135-4.517 4.341 0 .86.331 1.781.745 2.282.082.099.094.186.069.287-.076.314-.245.996-.278 1.135-.044.183-.146.222-.337.134-1.249-.582-2.03-2.408-2.03-3.876 0-3.156 2.293-6.055 6.612-6.055 3.471 0 6.169 2.473 6.169 5.78 0 3.449-2.174 6.225-5.192 6.225-1.014 0-1.967-.527-2.293-1.148l-.624 2.378c-.226.869-.835 1.958-1.244 2.621.938.29 1.933.446 2.966.446 5.531 0 10.017-4.486 10.017-10.017S17.548 2 12.017 2z" />
          </svg>
        </a>

        {/* Twitter */}
        <a
          href="https://twitter.com/ConleyFamily"
          target="_blank"
          rel="noopener noreferrer"
          className="CoverPage-social-icon"
          aria-label="Conley Family on Twitter"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
          </svg>
        </a>
      </nav>
    </main>
  );
}
