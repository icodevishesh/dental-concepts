import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Restoration Gallery | Dental Concepts San Francisco",
  description:
    "View published examples of crowns, implant restorations, full arch prostheses, and digital dental laboratory services from Dental Concepts.",
  robots: "noindex,follow,max-image-preview:large",
};

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head"><div className="wrap"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Photo credits</li></ol></nav>
          <div className="page-head-grid"><h1>Photo credits</h1><div><p className="lead">Credits for the photographs used on this site.</p>
            <p className="note">These are representative photographs, not Dental Concepts cases. Our own case gallery is coming soon. Discuss case suitability and options with the lab.</p></div></div>
        </div></section>
        <section className="section" id="credits"><div className="wrap two-col">
          <div><h2>Photographers</h2><p>Photographs on this site are used under the <a href="https://unsplash.com/license">Unsplash License</a> or the <a href="https://www.pexels.com/license/">Pexels License</a>, except the gold crown and the RX form, which are Dental Concepts’ own.</p></div>
          <ul className="credits">
            <li>Wax teeth being shaped by hand: <a href="https://www.pexels.com/@leopoldo-leite-465938470/">Leopoldo Leite</a> on Pexels</li>
            <li>Bridge on a dental model: <a href="https://www.pexels.com/@arvind-philomin-187831830/">Arvind Philomin</a> on Pexels</li>
            <li>Milled ceramic crowns on a reflective surface: <a href="https://www.pexels.com/@tarik-bayram-1067891413/">TARIK BAYRAM</a> on Pexels</li>
            <li>Dental model with ceramic teeth on a black surface: <a href="https://www.pexels.com/@tarik-bayram-1067891413/">TARIK BAYRAM</a> on Pexels</li>
            <li>Full arch implant bridge on a titanium bar: <a href="https://www.pexels.com/@zeynep-kahraman/">Zeynep Kahraman</a> on Pexels</li>
            <li>Implant model with a crown beside it: <a href="https://www.pexels.com/@cottonbro/">cottonbro studio</a> on Pexels</li>
            <li>Crown on an implant abutment held in a gloved hand: <a href="https://www.pexels.com/@zeynep-kahraman/">Zeynep Kahraman</a> on Pexels</li>
            <li>Full arch provisional teeth on a dark background: <a href="https://www.pexels.com/@tarik-bayram-1067891413/">TARIK BAYRAM</a> on Pexels</li>
            <li>3D printed dental models on a reflective surface: <a href="https://www.pexels.com/@tarik-bayram-1067891413/">TARIK BAYRAM</a> on Pexels</li>
            <li>Ceramic shade guide tabs: <a href="https://www.pexels.com/@karolina-grabowska/">Kaboompics</a> on Pexels</li>
            <li>3D dental scan reviewed on a tablet: <a href="https://unsplash.com/@quangtri?utm_source=dental_concepts&utm_medium=referral">Quang Tri NGUYEN</a></li>
            <li>Ceramic crown on an implant abutment: <a href="https://unsplash.com/@katasha?utm_source=dental_concepts&utm_medium=referral">Katarzyna Zygnerska</a></li>
            <li>Reviewing a dental scan together on a tablet: <a href="https://unsplash.com/@quangtri?utm_source=dental_concepts&utm_medium=referral">Quang Tri NGUYEN</a></li>
            <li>Full contour crowns seated on a stone model: <a href="https://unsplash.com/@dentistozkanguner?utm_source=dental_concepts&utm_medium=referral">Ozkan Guner</a></li>
            <li>Ceramic anterior crowns on a stone model: <a href="https://unsplash.com/@dentistozkanguner?utm_source=dental_concepts&utm_medium=referral">Ozkan Guner</a></li>
            <li>Ceramic veneers and crowns laid out on a dark surface: <a href="https://unsplash.com/@dentistozkanguner?utm_source=dental_concepts&utm_medium=referral">Ozkan Guner</a></li>
            <li>Full arch prosthesis with pink gingival ceramics: <a href="https://unsplash.com/@dentistozkanguner?utm_source=dental_concepts&utm_medium=referral">Ozkan Guner</a></li>
            <li>Implant crown seated in a dark model: <a href="https://unsplash.com/@bogdan_condr?utm_source=dental_concepts&utm_medium=referral">Bogdan condr</a></li>
            <li>Stone model with implant abutments and restorations: <a href="https://unsplash.com/@quangtri?utm_source=dental_concepts&utm_medium=referral">Quang Tri NGUYEN</a></li>
            <li>Provisional restorations on a model: <a href="https://unsplash.com/@dentistozkanguner?utm_source=dental_concepts&utm_medium=referral">Ozkan Guner</a></li>
            <li>Handheld scanner capturing a dental model: <a href="https://unsplash.com/@quangtri?utm_source=dental_concepts&utm_medium=referral">Quang Tri NGUYEN</a></li>
            <li>Printed dental model with removable dies: <a href="https://unsplash.com/@quangtri?utm_source=dental_concepts&utm_medium=referral">Quang Tri NGUYEN</a></li>
            <li>Ceramist layering porcelain beside a shade guide: <a href="https://unsplash.com/@amr_taha?utm_source=dental_concepts&utm_medium=referral">Amr Taha</a></li>
            <li>Technician finishing a crown by hand: <a href="https://unsplash.com/@miracleday?utm_source=dental_concepts&utm_medium=referral">Elena Mozhvilo</a></li>
            <li>Milling unit working under blue light: <a href="https://unsplash.com/@beuwy_com?utm_source=dental_concepts&utm_medium=referral">Alexander Pütter</a></li>
            <li>Technician working on a prosthesis at the bench: <a href="https://unsplash.com/@sulyok_imaging?utm_source=dental_concepts&utm_medium=referral">Adrian Sulyok</a></li>
            <li>Layered ceramic crowns on a working model: <a href="https://unsplash.com/@dentistozkanguner?utm_source=dental_concepts&utm_medium=referral">Ozkan Guner</a></li>
            <li>Ceramic veneers on a black surface: <a href="https://unsplash.com/@dentistozkanguner?utm_source=dental_concepts&utm_medium=referral">Ozkan Guner</a></li>
            <li>Full arch restoration on an articulated model: <a href="https://unsplash.com/@dentistozkanguner?utm_source=dental_concepts&utm_medium=referral">Ozkan Guner</a></li>
            <li>Crown on an implant abutment: <a href="https://unsplash.com/@andreeaaaa?utm_source=dental_concepts&utm_medium=referral">Andreea Rus</a></li>
          </ul>
        </div></section>
        <section className="visit"><div className="wrap visit-grid">
          <div className="visit-lead"><h2>Have a case in mind?</h2><p>Talk it through with the lab before you send anything.</p><a className="button button-light" href="/send-case">Contact the lab about a case</a></div></div></section>
      </main>
      <Footer />
    </>
  );
}
