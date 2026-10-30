// Seeds the three original Dental Concepts articles into MongoDB.
// Run with: npm run seed:blogs
import { MongoClient } from "mongodb";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    try {
      process.loadEnvFile(".env");
    } catch {
      /* no env file found; rely on already-exported vars */
    }
  }
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "dental-concepts";

if (!uri) {
  console.error("MONGODB_URI is not set. Add it to .env.local before seeding.");
  process.exit(1);
}

const now = new Date();

const posts = [
  {
    slug: "crown-materials-overview",
    title: "Zirconia, layered porcelain, E.max, or gold: an overview of our crown options",
    description:
      "An overview of the four crown and veneer options Dental Concepts makes: full contour zirconia, layered porcelain, lithium disilicate (E.max), and gold.",
    category: "Crowns & veneers",
    coverImage: "/assets/products/lithium-disilicate.webp",
    coverImageAlt: "Lithium disilicate veneers",
    readTime: "4 min read",
    publishedAt: "2026-10-05",
    body: `<p class="lead">Our crown and veneer menu has four options. This is a plain-language overview of what each one is, to make the conversation with the lab easier. Material choice for a specific patient is a clinical decision, and we are glad to talk it through.</p>
<h2 id="full-contour-zirconia">Full contour zirconia</h2>
<p>A crown milled entirely from zirconia, with no layered ceramic on top. It is generally chosen where strength is the priority. Dental Concepts grew out of early zirconia milling work, so this is familiar ground for the team.</p>
<p><a class="text-link" href="/full-contour-zirconia-crowns">Full contour zirconia crowns</a></p>
<h2 id="layered-porcelain">Layered porcelain</h2>
<p>Ceramic built up in layers by hand over a core, which gives the ceramist more control over translucency and character. It is generally chosen where appearance is the priority.</p>
<p><a class="text-link" href="/layered-porcelain-crowns">Layered porcelain crowns</a></p>
<h2 id="lithium-disilicate-e-max">Lithium disilicate (E.max)</h2>
<p>A glass ceramic used for veneers, inlays, onlays, and crowns. On our RX form it is listed for veneers, onlays, and inlays as well as crowns.</p>
<p><a class="text-link" href="/lithium-disilicate">Lithium disilicate (E.max)</a></p>
<h2 id="gold">Gold</h2>
<p>A cast gold crown. If you prescribe one, the RX form asks which alloy you would like.</p>
<p><a class="text-link" href="/gold-crowns">Gold crowns</a></p>
<h2 id="not-sure-which-to-prescribe">Not sure which to prescribe?</h2>
<p><a href="/contact">Contact the lab</a> with the case details. For shade-critical cases, a <a href="/blog/custom-shade-appointments">custom shade appointment</a> may help.</p>`,
  },
  {
    slug: "custom-shade-appointments",
    title: "Custom shade appointments: what to expect",
    description:
      "How custom shade appointments work at Dental Concepts in San Francisco: how to book, how long the visit takes, and where to send shade photographs.",
    category: "Custom shades",
    coverImage:
      "https://images.pexels.com/photos/6627599/pexels-photo-6627599.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400&h=760",
    coverImageAlt: "Ceramic shade guide tabs",
    readTime: "3 min read",
    publishedAt: "2026-10-05",
    body: `<p class="lead">Some shades are hard to capture in a tab number. For those cases, your patient can visit the lab so the person building the restoration sees the tooth in person.</p>
<h2 id="how-to-book">How to book</h2>
<p>Call <a href="tel:+14155589717">(415) 558-9717</a> to arrange a custom shade appointment. The lab is at 244 9th Street in San Francisco and is open Monday to Friday, 9 AM to 5 PM.</p>
<h2 id="how-long-it-takes">How long it takes</h2>
<p>Plan for approximately 15 to 20 minutes.</p>
<h2 id="mark-it-on-the-prescription">Mark it on the prescription</h2>
<p>Tick &ldquo;Custom shade&rdquo; on the <a href="/rx">RX form</a> so the case is flagged when it arrives, and note anything you have already discussed with the patient about the result they want.</p>
<h2 id="when-a-visit-is-not-possible">When a visit is not possible</h2>
<p>Shade photographs help. Email them to <a href="mailto:photos@dentalconceptssf.com">photos@dentalconceptssf.com</a> and tick the photos box on the RX form so we know to look for them.</p>
<p><a class="button" href="/custom-shades">More about custom shades</a></p>`,
  },
  {
    slug: "how-to-complete-the-rx-form",
    title: "How to complete the Dental Concepts RX form",
    description:
      "A walk through the two-page Dental Concepts prescription form: doctor information, restoration and implant choices, shade, and what to send with the case.",
    category: "Working with the lab",
    coverImage: "/assets/rx-form-preview.webp",
    coverImageAlt: "First page of the Dental Concepts RX form",
    readTime: "4 min read",
    publishedAt: "2026-10-05",
    body: `<p class="lead">A clear prescription is the fastest way to get the restoration you have in mind. Here is what each part of our RX form is for, in the order it appears on the page.</p>
<h2 id="doctor-information">Doctor information</h2>
<p>The top band asks for today&rsquo;s date, the appointment date, the doctor&rsquo;s name and phone, the patient&rsquo;s name and phone, the doctor&rsquo;s signature, and license number. The appointment date matters most to us: it tells the lab when the case needs to be back in your hands.</p>
<h2 id="choose-the-restoration">Choose the restoration</h2>
<p>The left column lists what we make. Under restorations you can tick layered zirconia, full contour zirconia, lithium disilicate (veneer, onlay, or inlay), gold crown, provisional, or a digital diagnostic wax-up. If you choose a gold crown, the form also asks which alloy you want.</p>
<p>The implant section covers how the restoration is retained and built: lab cemented, uncemented two-piece, with or without a screw access hole, and the abutment material. There is a line for the implant system and size, and a box to tick if you would like the lab to provide parts.</p>
<h2 id="two-notes-printed-on-the-form">Two notes printed on the form</h2>
<ul>
<li>All anterior cases require a pre-op or study model.</li>
<li>All digital implant cases require a full arch gingival scan without the healing abutment.</li>
</ul>
<p>Checking these before you send the case avoids a call back from the lab.</p>
<h2 id="shade-and-scans">Shade and scans</h2>
<p>Write the shade and, where it is relevant, the stump shade. Tick &ldquo;Digital imp scan&rdquo; if you are sending an intraoral scan, and &ldquo;Custom shade&rdquo; if you would like the patient to visit the lab for a shade appointment. The tooth diagrams and the upper and lower arch chart are there for you to mark the teeth involved and sketch anything that is easier to draw than describe.</p>
<h2 id="photos">Photos</h2>
<p>If you are sending shade photographs, tick the box at the bottom of the form and email them to <a href="mailto:photos@dentalconceptssf.com">photos@dentalconceptssf.com</a>.</p>
<h2 id="before-you-send-it">Before you send it</h2>
<p>We do not have a public case portal. <a href="/contact">Contact the lab</a> to confirm the current way to send a case before sharing patient records.</p>
<p><a class="button" href="/assets/digital-rx.pdf" download>Download the RX form (PDF)</a></p>`,
  },
];

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection("blogs");
  await col.createIndex({ slug: 1 }, { unique: true });
  for (const post of posts) {
    await col.updateOne(
      { slug: post.slug },
      { $set: { ...post, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    );
    console.log(`Seeded: ${post.slug}`);
  }
  console.log(`Done. Database: ${dbName}, collection: blogs.`);
} finally {
  await client.close();
}
