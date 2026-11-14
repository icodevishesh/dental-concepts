import { getAllTestimonials } from "@/lib/testimonials";

export default async function TestimonialsCarousel() {
  const testimonials = await getAllTestimonials().catch(() => []);
  const testimonialPairs = Array.from(
    { length: Math.ceil(testimonials.length / 2) },
    (_, i) => testimonials.slice(i * 2, i * 2 + 2)
  );

  return (
    <div className="carousel" data-carousel role="region" aria-roledescription="carousel" aria-label="Testimonials">
      <div className="carousel-view"><div className="carousel-track">
        {testimonialPairs.length > 0 ? (
          testimonialPairs.map((pair, i) => (
            <div key={pair.map((t) => t._id?.toString()).join("-")} className="carousel-slide carousel-pair" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${testimonialPairs.length}`}>
              {pair.map((t) => (
                <figure key={t._id?.toString()} className="quote-card">
                  <blockquote><p>{t.quote}</p></blockquote>
                  <figcaption><strong>{t.name}</strong><span>{t.practice}</span></figcaption>
                </figure>
              ))}
            </div>
          ))
        ) : (
          <div className="carousel-slide carousel-pair" role="group" aria-roledescription="slide" aria-label="1 of 1">
            <figure className="quote-card is-placeholder"><blockquote><p>Paste a real quote from a dentist here, in their own words.</p></blockquote><figcaption><strong>Dentist’s name</strong><span>Practice name, city</span></figcaption></figure>
          </div>
        )}
      </div></div>
      <div className="carousel-ctrl"><button className="carousel-prev" type="button" aria-label="Previous testimonial"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button><p className="carousel-status" aria-live="polite">{`Slide 1 of ${Math.max(testimonialPairs.length, 1)}`}</p><button className="carousel-next" type="button" aria-label="Next testimonial"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>
    </div>
  );
}
