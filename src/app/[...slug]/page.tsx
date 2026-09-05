import {
  metadataForPage,
  pageFromSegments,
  staticPageParams,
} from "@mambosite/next";
import { MamboPage } from "@mambosite/react";
import { notFound } from "next/navigation";
import { runtime } from "../../mambo/runtime";

interface PageProps {
  readonly params: Promise<{ readonly slug: string[] }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [...staticPageParams(runtime)];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = pageFromSegments(runtime, slug);
  if (!page) return {};

  const description = page.description ?? "";
  return {
    ...metadataForPage(page),
    openGraph: {
      title: page.title,
      description,
      url: new URL(page.route, runtime.store.manifest.site.url!),
      siteName: runtime.store.manifest.site.title,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: page.title,
      description,
    },
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = pageFromSegments(runtime, slug);
  if (!page) notFound();

  return <MamboPage page={page} runtime={runtime} />;
}
