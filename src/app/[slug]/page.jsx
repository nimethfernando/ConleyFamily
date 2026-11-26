import React from 'react';
import { notFound } from 'next/navigation';
import pagesData from '../../data/pages.json';
import SquarespaceContent from '../../components/SquarespaceContent';

const ALIAS_MAP = {
  'conley-group': 'business-overview',
  about: 'foreword',
  biographies: 'benjamin-conley',
  'news-info': 'contact-form',
  main: 'business-overview',
  'horse-breeding': 'roxanne-davis-greene-feature',
  equestrian: 'michele-davis-macfarlane',
  'conley-map': '1800-1820',
};

function resolvePage(slug) {
  const targetSlug = ALIAS_MAP[slug] || slug;
  return pagesData[targetSlug] || null;
}

export function generateStaticParams() {
  const pageSlugs = Object.keys(pagesData).filter((slug) => slug !== 'home');
  const aliasSlugs = Object.keys(ALIAS_MAP);
  return [...pageSlugs, ...aliasSlugs].map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const page = resolvePage(params.slug);
  if (!page) {
    return { title: 'Page Not Found — CONLEY FAMILY' };
  }
  return {
    title: `${page.title} — CONLEY FAMILY`,
    description: page.description
      ? page.description.replace(/<[^>]+>/g, '').slice(0, 160)
      : 'The official website of the Conley Family.',
  };
}

export default function DynamicSitePage({ params }) {
  const page = resolvePage(params.slug);

  if (!page) {
    notFound();
  }

  return <SquarespaceContent page={page} />;
}
