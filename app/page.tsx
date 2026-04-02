import { HomePageClient } from '@/components/home-page-client';
import { loadCollectionsFromMarkdown } from '@/lib/markdown-loader';

export default async function Home() {
  const collections = await loadCollectionsFromMarkdown();

  return <HomePageClient collections={collections} />;
}
