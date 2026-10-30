import re,os,html
os.chdir(os.path.expanduser('~/mnt/dental-concept'))
PEX='https://images.pexels.com/photos/6627599/pexels-photo-6627599.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=1200'
IMG={'full-contour-zirconia-crowns':('assets/products/full-contour-zirconia-crowns.webp',1254,1254),
'layered-porcelain-crowns':('assets/products/layered-porcelain-crowns.webp',1254,1254),
'lithium-disilicate':('assets/products/lithium-disilicate.webp',1254,1254),
'gold-crowns':('assets/gold-crown.webp',478,454),
'full-arch-restorations':('assets/products/full-arch-restorations.webp',1254,1254),
'implant-crowns':('assets/products/implant-crowns.webp',1254,1254),
'custom-abutments':('assets/products/custom-abutments.webp',1254,1254),
'temporary-crowns-abutments':('assets/products/temporary-crowns-abutments.webp',1254,1254),
'digital-wax-up':('assets/products/digital-wax-up.webp',1254,1254),
'model-printing':('assets/products/model-printing.webp',1254,1254),
'custom-shades':(PEX,1200,1200)}
NAME={'full-contour-zirconia-crowns':'Full contour zirconia crowns','layered-porcelain-crowns':'Layered porcelain crowns','lithium-disilicate':'Lithium disilicate (E.max)','gold-crowns':'Gold crowns','full-arch-restorations':'Full arch restorations','implant-crowns':'Implant crowns','custom-abutments':'Custom abutments','temporary-crowns-abutments':'Temporary crowns &amp; abutments','digital-wax-up':'Digital wax up','model-printing':'Model printing','custom-shades':'Custom shades'}
CAT={'crowns':('Crowns &amp; veneers','services.html#crowns'),'implants':('Implants &amp; <span class="nb">All-on-X</span>','services.html#implants'),'other':('Other services','services.html#other')}
GROUP={'crowns':['full-contour-zirconia-crowns','layered-porcelain-crowns','lithium-disilicate','gold-crowns'],'implants':['full-arch-restorations','implant-crowns','custom-abutments','temporary-crowns-abutments'],'other':['digital-wax-up','model-printing','custom-shades']}
TAB={
'full-contour-zirconia-crowns':('Full contour zirconia','Milled from a single piece of zirconia, with no layered ceramic.',['Designed digitally, then milled, sintered and finished by a technician','Often prescribed for posterior teeth where strength is the priority']),
'layered-porcelain-crowns':('Layered porcelain','Ceramic built up by hand over a core for control over translucency.',['Colour, translucency and surface character varied across the tooth','Often prescribed where appearance matters most, such as anterior teeth']),
'lithium-disilicate':('E.max','A glass ceramic for veneers, inlays, onlays and crowns.',['Natural, translucent appearance for single-tooth restorations','Include the stump shade: it matters with a translucent material']),
'gold-crowns':('Gold','A cast gold crown in your choice of alloy.',['Three alloys on the RX form: high yellow, high noble white and noble white','Often prescribed for posterior teeth where a metal restoration is preferred']),
'full-arch-restorations':('Full arch','One prosthesis replacing a whole arch, fixed to several implants.',['Planned closely with you, usually with a provisional first','Full arch gingival scan without the healing abutment for digital cases']),
'implant-crowns':('Implant crowns','Screw-retained crowns for single implants.',['Lab cemented as one piece, or supplied as two pieces','Angulated screw access can be requested where possible']),
'custom-abutments':('Custom abutments','Designed for one patient’s implant position and soft tissue.',['Titanium as standard, with gold hue and zirconia where the case allows','Crown lab cemented or supplied separately']),
'temporary-crowns-abutments':('Temporaries','Provisional crowns and abutments while the final is made.',['Protect the prep, trial shape and bite, or bridge healing time','Implant temporaries can help shape the soft tissue']),
'digital-wax-up':('Digital wax up','A proposed tooth design made on a scan, before any prep.',['Plan aesthetic cases and discuss the result with the patient','A basis for provisionals']),
'model-printing':('Model printing','Physical resin models printed from your scan.',['Check fit, hold removable dies or show a planned result','A common step when no physical impression was taken']),
'custom-shades':('Custom shades','Your patient visits the lab so the technician sees the tooth.',['Most useful for anteriors and single restorations','About 15 to 20 minutes at 244 9th Street']),
}
P={
'full-contour-zirconia-crowns':dict(cat='crowns',h1='Full contour zirconia crowns you’re proud to seat.',lead='Milled from a single piece of zirconia, designed digitally and finished by hand in our San Francisco lab.',stat=('10–15 days','Restoration turnaround listed on our RX form'),rx='Full Contour Zirconia',make=('Designed digitally, milled in San Francisco','Shape, contacts and occlusion are designed with 3Shape tools, then the crown is milled on Roland equipment, sintered, and finished by a technician.'),seat='Our RX form lists restorations at 10 to 15 days. Confirm timing for your case with the lab before you schedule the patient.',q2=('Zirconia is where we started','The founders milled zirconia crowns for other labs as Prestige Milling before Dental Concepts opened.')),
'layered-porcelain-crowns':dict(cat='crowns',h1='Layered crowns with life in the enamel.',lead='Ceramic built up by hand over a core, so translucency, colour and surface character can be shaped across the tooth.',stat=('10–15 days','Restoration turnaround listed on our RX form'),rx='Zirconia (Layered)',make=('Built up by hand, layer by layer','The core is milled, then a ceramist builds up the porcelain in layers to vary translucency and colour, and finishes the surface by hand.'),seat='Our RX form lists restorations at 10 to 15 days. Confirm timing for your case with the lab before you schedule the patient.',q2=('A ceramist, not just a machine','The visible surface of every layered crown is built and finished by hand.')),
'lithium-disilicate':dict(cat='crowns',h1='E.max that blends into the smile.',lead='Lithium disilicate veneers, inlays, onlays and crowns, with a natural, translucent finish.',stat=('10–15 days','Restoration turnaround listed on our RX form'),rx='Lithium Disilicate',make=('Designed for the tooth it replaces','The restoration is designed digitally, then made in lithium disilicate and stained and glazed by a technician.'),seat='Our RX form lists restorations at 10 to 15 days. Confirm timing for your case with the lab before you schedule the patient.',q2=('Stump shade taken seriously','With a translucent material the prep colour shows through, so we ask for it and design around it.')),
'gold-crowns':dict(cat='crowns',h1='Gold crowns, cast the classic way.',lead='Cast in your choice of three gold alloys for posterior teeth where a metal restoration is preferred.',stat=('3 alloys','High yellow, high noble white and noble white'),rx='Gold Crown',make=('Waxed, cast and finished','The crown is shaped, cast in the alloy you choose on the RX form, then fitted and polished by a technician.'),seat='Our RX form lists restorations at 10 to 15 days. Confirm timing for your case with the lab before you schedule the patient.',q2=('A long-established crown, done well','Gold remains one of the most proven crown types in dentistry, and we still make it.')),
'full-arch-restorations':dict(cat='implants',h1='Full arch cases, planned together.',lead='All-on-X prostheses fixed to implants, planned step by step with you from records to the final.',stat=('3–4 weeks','Implant case turnaround listed on our RX form'),rx='the implant system and size',make=('Planned, tried in, then finished','These are multi-stage cases, usually with a provisional before the final prosthesis. We agree records, try-ins and timing with you up front.'),seat='Our RX form lists implant cases at 3 to 4 weeks. Confirm timing for your case with the lab before you schedule the patient.',q2=('Talk to the lab early','Full arch work goes best when records and try-ins are agreed before the first appointment.')),
'implant-crowns':dict(cat='implants',h1='Implant crowns that seat without a fight.',lead='Screw-retained crowns for single implants, lab cemented as one piece or supplied as two.',stat=('3–4 weeks','Implant case turnaround listed on our RX form'),rx='the implant system and size',make=('Designed around the implant','The crown and abutment are designed for the implant position, with angulated screw access where it is possible, then finished by a technician.'),seat='Our RX form lists implant cases at 3 to 4 weeks. Confirm timing for your case with the lab before you schedule the patient.',q2=('Retrievable by design','Screw-retained crowns can be removed by the clinician later if needed.')),
'custom-abutments':dict(cat='implants',h1='Custom abutments made for one patient.',lead='Titanium as standard, designed for the implant position and soft tissue instead of a stock part.',stat=('3–4 weeks','Implant case turnaround listed on our RX form'),rx='the implant system and size',make=('Designed for the tissue','The abutment is designed for this patient’s emergence profile and soft tissue, then made in titanium, or gold hue or zirconia where the case allows.'),seat='Our RX form lists implant cases at 3 to 4 weeks. Confirm timing for your case with the lab before you schedule the patient.',q2=('Not a stock part','Every custom abutment is shaped for the patient it is made for.')),
'temporary-crowns-abutments':dict(cat='implants',h1='Temporaries that do a real job.',lead='Provisional crowns and abutments that protect, trial shape and bite, and help shape the tissue.',stat=('10–15 days','Provisionals, as listed on our RX form'),rx='Provisional',make=('Designed for what it needs to do','Tell us whether the temporary is there to protect, to trial the shape, or to shape the tissue, and it is designed for that.'),seat='Our RX form lists provisionals with restorations at 10 to 15 days. Timing for implant temporaries depends on the case, so confirm it with the lab.',q2=('Part of the final plan','A well-made temporary makes the final restoration easier to get right.')),
'digital-wax-up':dict(cat='other',h1='See the result before you prep.',lead='A digital diagnostic wax-up shows the planned shape and position of restorations on a scan of the patient’s teeth.',stat=('10–15 days','Listed with restorations on our RX form'),rx='Digital Diagnostic Wax-Up',make=('Designed on the patient’s scan','The proposed teeth are designed digitally from your scan and notes, ready to discuss with the patient and use for provisionals.'),seat='Our RX form lists a digital diagnostic wax-up with restorations at 10 to 15 days. Confirm timing for your case with the lab.',q2=('A shared picture of the plan','A wax-up gives you and your patient the same view of the result before treatment starts.')),
'model-printing':dict(cat='other',h1='Your scan, in your hand.',lead='Resin models printed from your digital scan, for checking fit, holding dies or showing a planned result.',stat=('On request','Contact the lab to confirm current turnaround'),rx=None,make=('Printed from your files','We print the model in resin from your scan files, with removable dies where the case needs them.'),seat='Turnaround is not published for this service. Contact the lab to confirm current details before planning a case.',q2=('Made for a digital workflow','Printed models fill the gap when no physical impression was taken.')),
'custom-shades':dict(cat='other',h1='Shade matched in person, not by number.',lead='Bring your patient to the lab so the technician building the restoration sees the tooth for themselves.',stat=('15–20 min','Approximate length of a shade visit'),rx='Custom shade',make=None,seat=None,q2=('Seen by the person building it','The technician who makes the restoration is the one who matches the shade.')),
}
CK='<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
def ico(p): return '<span class="pdp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg></span>'
PIN='<path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'
STAR='<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>'
PHONE='<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'
def plain(t): return re.sub(r'<[^>]+>','',html.unescape(t)).replace('&','&amp;')
def build(slug):
    c=P[slug];f=slug+'.html';s=open(f).read()
    faq=re.search(r'<section class="section faq".*?</section>',s,re.S).group(0).replace('<span class="eyebrow">FAQ</span>','<span class="eyebrow">Need help?</span>')
    visit=re.search(r'<section class="visit">.*?</section>',s,re.S).group(0)
    cname,chref=CAT[c['cat']];name=NAME[slug]
    crumbs='<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><a href="services.html">Lab services</a></li><li><a href="%s">%s</a></li><li aria-current="page">%s</li></ol></nav>'%(chref,cname,name)
    src,w,h=IMG[slug];gold=' is-gold' if slug=='gold-crowns' else ''
    if slug=='custom-shades':
        steps=[('Book','Call to book a visit','Call (415) 558-9717 to book, and tick “Custom shade” on the RX form so the case and the visit are linked.','assets/rx-form-preview.webp',900,693,'First page of the Dental Concepts RX form',' is-doc'),
               ('Visit','About 15 to 20 minutes at the lab','Your patient visits us at 244 9th Street, San Francisco, Monday to Friday, 9:00 AM to 4:00 PM, and the technician looks at the tooth in person.','assets/lab-technicians.webp',1672,941,'Technicians working in the lab',''),
               ('Seat','A restoration that matches its neighbours','The technician who saw the tooth builds the restoration. Confirm timing for your case with the lab.',src,w,h,'Shade guide tabs',' is-product')]
    else:
        if c['rx'] is None: rxline='Send your scan files with a note on the RX about what the model is for. Contact the lab to confirm how to send the files.'
        elif c['rx'].startswith('the '): rxline='Complete the RX form with %s and the shade, then send your impression or scan.'%c['rx']
        else: rxline='Tick “%s” on the RX form, add the shade and send your impression or scan with the opposing arch and bite.'%c['rx']
        steps=[('Prescribe','Tell us exactly what you need',rxline,'assets/rx-form-preview.webp',900,693,'First page of the Dental Concepts RX form',' is-doc'),
               ('Design &amp; make',c['make'][0],c['make'][1],'assets/lab-technicians.webp',1672,941,'Technicians finishing restorations and reviewing a digital design',''),
               ('Seat','Delivered ready for the chair',c['seat'],src,w,h,plain(name),' is-product'+gold)]
    stp=''.join('<article class="pdp-step"><div class="pdp-step-copy"><span class="pdp-step-label">%s</span><h3>%s</h3><p>%s</p></div><figure class="pdp-step-media%s"><img src="%s" width="%s" height="%s" alt="%s" loading="lazy" decoding="async"></figure></article>'%(a,b,t,cl,im,iw,ih,al) for a,b,t,im,iw,ih,al,cl in steps)
    grp=GROUP[c['cat']];tl='';pn=''
    for k in grp:
        on=k==slug;lab,tag,pts=TAB[k];ti,tw,th=IMG[k]
        tl+='<button class="pdp-tab" role="tab" id="tab-%s" aria-controls="panel-%s" aria-selected="%s" tabindex="%s">%s</button>'%(k,k,'true' if on else 'false',0 if on else -1,lab)
        checks=''.join('<li>%s<span>%s</span></li>'%(CK,b) for b in pts)
        link='<span class="pdp-here">You are here</span>' if on else '<a class="text-link" href="%s.html">Learn more</a>'%k
        pn+='<div class="pdp-panel" role="tabpanel" id="panel-%s" aria-labelledby="tab-%s"%s><div class="pdp-panel-copy"><h3>%s</h3><p>%s</p><ul class="pdp-checks">%s</ul>%s</div><div class="pdp-panel-media%s"><img src="%s" width="%s" height="%s" alt="%s" loading="lazy" decoding="async"></div></div>'%(k,k,'' if on else ' hidden',NAME[k],tag,checks,link,' is-gold' if k=='gold-crowns' else '',ti,tw,th,plain(NAME[k]))
    th={'crowns':('Crown options','A material for every case','Four crown options on one RX form. Material choice is a clinical decision, and we are glad to talk it through.'),
        'implants':('Implant options','Everything for the implant case','From a single implant crown to a full arch, on one RX form. Talk to the lab early on implant cases.'),
        'other':('Digital &amp; custom','Services around the restoration','Planning, models and shade work that make the final restoration easier to get right.')}[c['cat']]
    if slug=='custom-shades':
        band=('Shade photographs','Can’t bring the patient in? Send photos.','Email shade photographs to photos@dentalconceptssf.com with the case details. Include a shade tab in the shot, in natural light.','mailto:photos@dentalconceptssf.com','Email shade photos')
    else:
        band=('The shade protocol','If the shade matters, see us in person.','Book a 15 to 20 minute custom shade appointment at the lab, or send photographs to photos@dentalconceptssf.com. A technician matches the restoration to the patient, not to a tab.','custom-shades.html','Book a shade appointment')
    proc='From booking to seat, in three steps.' if slug=='custom-shades' else 'From prescription to seat, with no guesswork.'
    main=('<main id="main">\n'
     '<section class="pdp-hero"><div class="wrap pdp-hero-grid"><div class="pdp-hero-copy">'+crumbs+'\n'
     '<h1>'+c['h1']+'</h1><p class="lead">'+c['lead']+'</p>\n'
     '<div class="actions"><a class="button" href="send-case.html">Start a case</a><a class="button button-outline" href="assets/digital-rx.pdf" download>Download the RX form</a></div></div>\n'
     '<figure class="pdp-hero-media'+gold+'"><img class="product-img" src="'+src+'" width="%s" height="%s" alt="'%(w,h)+plain(name)+'" fetchpriority="high" decoding="async"></figure></div></section>\n'
     '<section class="pdp-stats" aria-label="At a glance"><div class="wrap"><dl>\n'
     '<div><dt>'+c['stat'][0]+'</dt><dd>'+c['stat'][1]+'</dd></div>\n'
     '<div><dt>Since 2006</dt><dd>A San Francisco lab, starting as Prestige Milling</dd></div>\n'
     '<div><dt>1 call</dt><dd>To reach the technician on your case</dd></div>\n'
     '</dl></div></section>\n'
     '<section class="section pdp-process"><div class="wrap"><div class="section-head"><span class="eyebrow">How it works</span><h2>'+proc+'</h2><p>Three steps, with a technician you can talk to at every one of them.</p></div>'+stp+'</div></section>\n'
     '<section class="section pdp-materials" aria-labelledby="materials-heading"><div class="wrap"><div class="center-head"><span class="eyebrow">'+th[0]+'</span><h2 id="materials-heading">'+th[1]+'</h2><p>'+th[2]+'</p><a class="button" href="contact.html">Discuss a case</a></div>\n'
     '<div class="pdp-tabs" data-count="%d"><div class="pdp-tablist" role="tablist" aria-label="%s">'%(len(grp),plain(th[0]))+tl+'</div>'+pn+'</div></div></section>\n'
     '<section class="pdp-band"><div class="wrap"><span class="eyebrow">'+band[0]+'</span><h2>'+band[1]+'</h2><p>'+band[2]+'</p><a class="button" href="'+band[3]+'">'+band[4]+'</a></div></section>\n'
     '<section class="section pdp-quality"><div class="wrap"><div class="center-head"><span class="eyebrow">Why Dental Concepts</span><h2>Craftsman-level quality</h2></div><div class="pdp-quality-grid">\n'
     '<article>'+ico(PIN)+'<h3>Made in San Francisco</h3><p>Designed, made and finished at our lab on 9th Street, not sent overseas.</p></article>\n'
     '<article>'+ico(STAR)+'<h3>'+c['q2'][0]+'</h3><p>'+c['q2'][1]+'</p></article>\n'
     '<article>'+ico(PHONE)+'<h3>A technician you can call</h3><p>Questions about preparation, design or shade go straight to the people making the case.</p></article>\n'
     '</div></div></section>\n'
     '<section class="section pdp-quote"><div class="wrap"><div class="center-head"><span class="eyebrow">Testimonials</span><h2>What dentists say</h2></div><figure class="quote-card is-placeholder pdp-quote-card"><blockquote><p>Placeholder: paste a real quote from a dentist about our '+plain(name).lower()+' here, in their own words.</p></blockquote><figcaption><strong>Dentist’s name</strong><span>Practice name, city</span></figcaption></figure></div></section>\n'
     '<section class="section pdp-start tinted"><div class="wrap pdp-start-grid"><div><span class="eyebrow">Get started</span><h2>Learn how to send your first case.</h2><p>New to the lab? Open an account, download the RX form and confirm with the team how to send impressions or scans.</p></div><div class="actions"><a class="button" href="send-case.html">How to send a case</a><a class="button button-light" href="contact.html">Talk to the lab</a></div></div></section>\n'
     +faq+'\n'+visit+'\n</main>')
    s=re.sub(r'<main id="main">.*?</main>',lambda m:main,s,count=1,flags=re.S)
    open(f,'w').write(s);return len(main)
for slug in P: print(slug,build(slug))
