import re,os
os.chdir(os.path.expanduser('~/mnt/dental-concept'))
PEX='https://images.pexels.com/photos/6627599/pexels-photo-6627599.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800&h=800'
items=[
('crowns','Crowns &amp; veneers','full-contour-zirconia-crowns','Full contour zirconia crowns','Milled from a single piece of zirconia.','assets/products/full-contour-zirconia-crowns.webp'),
('crowns','Crowns &amp; veneers','layered-porcelain-crowns','Layered porcelain crowns','Built up by hand for life-like translucency.','assets/products/layered-porcelain-crowns.webp'),
('crowns','Crowns &amp; veneers','lithium-disilicate','Lithium disilicate (E.max)','Veneers, inlays, onlays and crowns.','assets/products/lithium-disilicate.webp'),
('crowns','Crowns &amp; veneers','gold-crowns','Gold crowns','Cast in a choice of three alloys.','assets/gold-crown.webp'),
('implants','Implants','full-arch-restorations','Full arch restorations','All-on-X prostheses, planned together.','assets/products/full-arch-restorations.webp'),
('implants','Implants','implant-crowns','Implant crowns','Screw-retained crowns for single implants.','assets/products/implant-crowns.webp'),
('implants','Implants','custom-abutments','Custom abutments','Titanium, designed for one patient.','assets/products/custom-abutments.webp'),
('implants','Implants','temporary-crowns-abutments','Temporary crowns &amp; abutments','Provisionals that protect and shape.','assets/products/temporary-crowns-abutments.webp'),
('other','Digital &amp; custom','digital-wax-up','Digital wax up','See the result before you prep.','assets/products/digital-wax-up.webp'),
('other','Digital &amp; custom','model-printing','Model printing','Resin models printed from your scan.','assets/products/model-printing.webp'),
('other','Digital &amp; custom','custom-shades','Custom shades','Shade matched in person at the lab.',PEX),
]
AR='<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
cards=''.join('<li class="menu-item" data-cat="%s"><a href="%s.html"><span class="menu-photo%s"><img src="%s" width="800" height="800" alt="" loading="lazy" decoding="async"><span class="menu-arrow">%s</span></span><span class="menu-text"><small>%s</small><strong>%s</strong><span>%s</span></span></a></li>'%(c,slug,' is-gold' if slug=='gold-crowns' else '',img,AR,cl,n,d) for c,cl,slug,n,d,img in items)
filters=''.join('<button type="button" class="menu-filter" data-filter="%s" aria-pressed="%s">%s <em>%d</em></button>'%(k,'true' if k=='all' else 'false',lab,cnt) for k,lab,cnt in [('all','All',11),('crowns','Crowns &amp; veneers',4),('implants','Implants',4),('other','Digital &amp; custom',3)])
sec=('<section class="section lab-menu" aria-labelledby="menu-heading"><div class="wrap">'
 '<div class="lab-menu-head"><div><span class="eyebrow">The lab menu</span><h2 id="menu-heading">Every restoration, made in San Francisco.</h2></div>'
 '<p>Eleven services on one RX form, from a single zirconia crown to a full arch. Choose one to see how it is made and what to send.</p></div>'
 '<div class="menu-filters" role="group" aria-label="Filter services">'+filters+'</div>'
 '<ul class="menu-grid">'+cards+'</ul>'
 '<div class="lab-menu-foot"><a class="button" href="services.html">See all lab services</a><a class="button button-light" href="assets/digital-rx.pdf" download>Download the RX form</a></div>'
 '</div></section>\n')
s=open('index.html').read()
s=re.sub(r'<section class="section lab-menu".*?</section>\n?','',s,flags=re.S)
m=re.search(r'<section class="section feature-band".*?</section>\n?',s,re.S)
s=s[:m.end()]+sec+s[m.end():]
open('index.html','w').write(s);print('ok')
