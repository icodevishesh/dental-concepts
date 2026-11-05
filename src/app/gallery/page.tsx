import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getGalleryImagesPaged } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Case Gallery | Dental Concepts San Francisco",
  description:
    "Browse photos of crowns, implant restorations, full arch prostheses, and digital dental laboratory work from Dental Concepts.",
};

const PER_PAGE = 24;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { images, totalPages } = await getGalleryImagesPaged(page, PER_PAGE);

  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Gallery</li></ol></nav>
          <div className="page-head-grid"><h1>Case gallery</h1><div><p className="lead">A look at crowns, implant restorations, and full arch work from our bench.</p>
            <p className="note">Representative Dental Concepts cases. See <Link href="/gallery/credits">photo credits</Link> for stock photography used elsewhere on the site.</p></div></div>
        </div></section>

        <section className="section" id="gallery">
          <div className="wrap">
            {images.length === 0 ? (
              <div className="gallery-empty">
                <p>Case photos are on their way. Check back soon.</p>
              </div>
            ) : (
              <>
                <ul className="gallery-grid">
                  {images.map((img) => (
                    <li key={img._id?.toString()} className="gallery-tile">
                      <Image src={img.url} alt={img.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" />
                    </li>
                  ))}
                </ul>
                {totalPages > 1 && (
                  <nav className="gallery-pagination" aria-label="Gallery pagination">
                    {page > 1 ? (
                      <Link className="text-link" href={page - 1 === 1 ? "/gallery" : `/gallery?page=${page - 1}`}>
                        ← Newer
                      </Link>
                    ) : (
                      <span />
                    )}
                    <span className="gallery-pagination-status">Page {page} of {totalPages}</span>
                    {page < totalPages ? (
                      <Link className="text-link" href={`/gallery?page=${page + 1}`}>
                        Older →
                      </Link>
                    ) : (
                      <span />
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </section>

        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Have a case in mind?</h2><p>Talk it through with the lab before you send anything.</p><a className="button button-light" href="/send-case">Contact the lab about a case</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
