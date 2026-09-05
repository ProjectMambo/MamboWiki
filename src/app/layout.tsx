import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  prefixBasePath,
  siteMetadata,
  themeBootstrapScript,
} from "@mambosite/next";
import { MamboSiteFrame } from "@mambosite/react";
import "./globals.css";
import { runtime, theme, themeStylesheetHref } from "../mambo/runtime";

const title = runtime.store.manifest.site.title;
const description = runtime.store.entryPage.description ?? "";
const siteUrl = new URL(runtime.store.manifest.site.url!);
const socialImage = new URL(
  `${runtime.store.manifest.site.basePath}/og.png`,
  siteUrl,
).toString();
const icon = `${runtime.store.manifest.site.basePath}/icon.png`;

export const metadata: Metadata = {
  ...siteMetadata(runtime),
  icons: { icon, apple: icon },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    images: [{ url: socialImage, width: 1200, height: 630, alt: title }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImage],
  },
};

const themeHref = prefixBasePath(
  themeStylesheetHref,
  runtime.store.manifest.site.basePath,
);

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      data-theme={theme.defaultScheme}
      lang={runtime.store.manifest.site.language}
      suppressHydrationWarning
    >
      <head>
        <link href={themeHref} rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: themeBootstrapScript(theme.defaultScheme),
          }}
        />
      </head>
      <body>
        <MamboSiteFrame runtime={runtime}>{children}</MamboSiteFrame>
      </body>
    </html>
  );
}
