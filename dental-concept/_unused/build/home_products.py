import re,os
os.chdir(os.path.expanduser('~/mnt/dental-concept'))
PEX='https://images.pexels.com/photos/6627599/pexels-photo-6627599.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800&h=800'
items=[
('crowns','full-contour-zirconia-crowns','Full contour zirconia crowns','Milled from a single piece of zirconia.','assets/products/full-contour-zirconia-crowns.webp'),
('crowns','layered-porcelain-crowns','Layered porcelain crowns','Ceramic built up by hand for translucency.','assets/products/layered-porcelain-crowns.webp'),
('crowns','lithium-disilicate','Lithium disilicate (E.max)','Veneers, inlays, onlays and crowns.','assets/products/lithium-disilicate.webp'),
('crowns','gold-crowns','Gold crowns','Cast in a choice of three alloys.','assets/gold-crown.webp'),
('implants','full-arch-restorations','Full arch restorations','All-on-X prostheses fixed to implants.','assets/products/full-arch-restorations.webp'),
('implants','implant-crowns','Implant crowns','Screw-retained crowns for single implants.','assets/products/implant-crowns.webp'),
('implants','custom-abutments','Custom abutments','Titanium, designed for one patient.','assets/products/custom-abutments.webp'),
('implants','temporary-crowns-abutments','Temporary crowns &amp; abutments','Provisionals that protect and shape tissue.','assets/products/temporary-crowns-abutments.webp'),
('digital','digital-wax-up','Digital wax up','See the planned result before you prep.','assets/products/digital-wax-up.webp'),
('digital','model-printing','Model printing','Resin models printed from your scan.','assets/products/model-printing.webp'),
('digital','custom-shades','Custom shades','Shade matched in person at the lab.',PEX),
]
LBL={'crowns':'Crowns &amp; veneers','implants':'Implants','digital':'Digital &amp; custom'}
ARW='<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
cards=''
for cat,slug,name,line,img in items:
    gold=' is-gold' if slug=='gold-crowns' else ''
    cards+=('<li class="pc" data-cat="%s"><a href="%s.html"><span class="pc-media%s"><img src="%s" width="800" height="800" alt="" loading="lazy" decoding="async"></span>'
            '<span class="pc-text"><span class="pc-cat">%s</span><strong>%s</strong><span class="pc-line">%s</span></span><span class="pc-go">%s</span></a></li>')%(cat,slug,gold,img,LBL[cat],name,line,ARW)
chips=''.join('<button class="pc-chip" type="button" data-filter="%s" aria-pressed="%s">%s</button>'%(k,'true' if k=='all' else 'false',v) for k,v in [('all','All products'),('crowns','Crowns &amp; veneers'),('implants','Implants'),('digital','Digital &amp; custom')])
sec=('<section class="section products-showcase" aria-labelledby="products-heading"><div class="wrap">'
 '<div class="ps-head"><div><span class="eyebrow">Our products</span><h2 id="products-heading">Every restoration, made in San Francisco.</h2></div>'
 '<div class="ps-intro"><p>Eleven products across crowns, implants and digital services, all on one RX form.</p><a class="text-link" href="services.html">See all lab services</a></div></div>'
 '<div class="pc-chips" role="group" aria-label="Filter products">'+chips+'</div>'
 '<ul class="pc-grid">'+cards+'</ul></div></section>\n')
s=open('index.html').read()
s=re.sub(r'<section class="section products-showcase".*?</section>\n?','',s,flags=re.S)
s=s.replace('<section class="section ways-section"',sec+'<section class="section ways-section"',1)
open('index.html','w').write(s);print('ok')
