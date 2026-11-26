import React from 'react';
import { notFound } from 'next/navigation';
import pagesData from '../../data/pages.json';
import SquarespaceContent from '../../components/SquarespaceContent';

export function generateStaticParams() {
  return Object.keys(pagesData)
    .filter((slug) => slug !== 'home')
    .map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const page = pagesData[params.slug];
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
  const page = pagesData[params.slug];

  if (!page) {
    notFound();
  }

  return <SquarespaceContent page={page} />;
}
