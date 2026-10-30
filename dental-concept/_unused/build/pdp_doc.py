import re,os,html,json
B=os.path.dirname(os.path.abspath(__file__))
os.chdir(os.path.expanduser('~/mnt/dental-concept'))
D=json.load(open(B+'/pdp_content.json'))
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
ALT={'full-contour-zirconia-crowns':'Full contour zirconia crowns','layered-porcelain-crowns':'Layered porcelain crowns on zirconia cores','lithium-disilicate':'Lithium disilicate veneers','gold-crowns':'A cast gold crown','full-arch-restorations':'A full arch implant prosthesis','implant-crowns':'An implant crown with its abutment and implant','custom-abutments':'Titanium custom abutments','temporary-crowns-abutments':'A provisional bridge','digital-wax-up':'A diagnostic wax-up on a model','model-printing':'A printed resin model with removable dies','custom-shades':'Shade guide tabs'}
LAB=('assets/lab-technicians.webp',1672,941,'Technicians working in the Dental Concepts lab','')
RX=('assets/rx-form-preview.webp',900,693,'First page of the Dental Concepts RX form',' is-doc')
def p(n,alt): return ('assets/products/step-'+n+'.webp',900,900,alt,' is-product')
STEP={
'full-contour-zirconia-crowns':[p('crown','A single zirconia crown'),p('bridge','A three-unit zirconia bridge')],
'layered-porcelain-crowns':[LAB,('assets/products/crowns-veneers.webp',1122,1402,'Porcelain crowns and veneers',' is-product')],
'lithium-disilicate':[p('maryland-bridges','A bonded anterior restoration'),p('crown','A single ceramic crown')],
'gold-crowns':[LAB,p('partial-metal-framework','Cast metal work, polished in the lab')],
'full-arch-restorations':[p('zirconia-hybrid','A zirconia full arch hybrid'),p('implant-acrylic-denture','An implant-retained acrylic arch')],
'implant-crowns':[p('zirconia-screw-retained-crown-with-ti-base','A zirconia screw-retained crown on a Ti-base'),p('screwmentable-restoration','A screw-retained implant crown')],
'custom-abutments':[p('zirconia-hybrid-custom-abutment','A zirconia hybrid custom abutment'),p('implant-bridges','An implant bridge on abutments')],
'temporary-crowns-abutments':[p('screw-retained-pmma-bridge','A screw-retained PMMA provisional bridge'),p('screw-retained-bridge','A screw-retained bridge')],
'digital-wax-up':[LAB,p('veneers','Anterior veneers')],
'model-printing':[p('diagnostic-wax-up','A model showing a planned result'),p('bridge','A three-unit bridge')],
'custom-shades':[LAB,p('veneers','Anterior veneers')],
}
CAT={'crowns':('Crowns &amp; veneers','services.html#crowns'),'implants':('Implants &amp; <span class="nb">All-on-X</span>','services.html#implants'),'other':('Other services','services.html#other')}
GROUP={'crowns':['full-contour-zirconia-crowns','layered-porcelain-crowns','lithium-disilicate','gold-crowns'],'implants':['full-arch-restorations','implant-crowns','custom-abutments','temporary-crowns-abutments'],'other':['digital-wax-up','model-printing','custom-shades']}
CATOF={s:c for c,l in GROUP.items() for s in l}
CK='<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
AR='<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
def ico(pth): return '<span class="pdp-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+pth+'</svg></span>'
PIN='<path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'
STAR='<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>'
PHONE='<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'
def plain(t): return re.sub(r'<[^>]+>','',html.unescape(t))
def attr(t): return html.escape(plain(t),quote=True)
def links(t):
    t=re.sub(r'([\w.]+@dentalconceptssf\.com)',r'<a href="mailto:\1">\1</a>',t)
    t=t.replace('1-800-700-LABS','<a href="tel:+18007005227">1-800-700-LABS</a>')
    t=re.sub(r'\(415\) 558-(\d{4})',lambda m:'<a href="tel:+1415558%s">(415) 558-%s</a>'%(m.group(1),m.group(1)),t)
    return t
def lis(items,icon): return ''.join('<li>%s<span>%s</span></li>'%(icon,links(x)) for x in items)
def build(slug):
    d=D[slug];c=CATOF[slug];f=slug+'.html';s=open(f).read()
    cname,chref=CAT[c];name=d['options']['tabs'][GROUP[c].index(slug)]['h3']
    crumbs='<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><a href="services.html">Lab services</a></li><li><a href="%s">%s</a></li><li aria-current="page">%s</li></ol></nav>'%(chref,cname,name)
    src,w,h=IMG[slug];gold=' is-gold' if slug=='gold-crowns' else ''
    imgs=[RX]+STEP[slug]
    stp=''
    for st,(im,iw,ih,al,cl) in zip(d['how']['steps'],imgs):
        stp+='<article class="pdp-step"><div class="pdp-step-copy"><span class="pdp-step-label">%s</span><h3>%s</h3><p>%s</p></div><figure class="pdp-step-media%s"><img src="%s" width="%s" height="%s" alt="%s" loading="lazy" decoding="async"></figure></article>'%(st['label'],st['h3'],links(st['text']),cl,im,iw,ih,attr(al))
    # new section
    n=d['new'];gs=n['groups']
    if len(gs)>1:
        cards=''.join('<div class="pdp-check-card%s"><h3>%s</h3><ul class="pdp-checks">%s</ul></div>'%('' if i==0 else ' is-compare',g['label'],lis(g['items'],CK if i==0 else AR)) for i,g in enumerate(gs))
        body='<div class="pdp-check-cards">'+cards+'</div>'
    else:
        body='<div class="pdp-check-cards is-single"><div class="pdp-check-card"><ul class="pdp-checks is-cols">'+lis(gs[0]['items'],CK)+'</ul></div></div>'
    newsec=('<section class="section pdp-check" aria-labelledby="check-heading"><div class="wrap pdp-check-grid"><div class="pdp-check-head"><span class="eyebrow">'+n['eyebrow']+'</span><h2 id="check-heading">'+n['h2']+'</h2>'
            +('<p>'+links(n['note'])+'</p>' if n['note'] else '')+'<a class="text-link" href="contact.html">Talk to the lab</a></div>'+body+'</div></section>\n')
    # options
    o=d['options'];grp=GROUP[c];tl='';pn=''
    for i,k in enumerate(grp):
        on=k==slug;t=o['tabs'][i];ti,tw,th=IMG[k]
        tl+='<button class="pdp-tab" role="tab" id="tab-%s" aria-controls="panel-%s" aria-selected="%s" tabindex="%s">%s</button>'%(k,k,'true' if on else 'false',0 if on else -1,o['labels'][i])
        link='<span class="pdp-here">You are here</span>' if on else '<a class="text-link" href="%s.html">Learn more</a>'%k
        pn+='<div class="pdp-panel" role="tabpanel" id="panel-%s" aria-labelledby="tab-%s"%s><div class="pdp-panel-copy"><h3>%s</h3><p>%s</p><ul class="pdp-checks">%s</ul>%s</div><div class="pdp-panel-media%s"><img src="%s" width="%s" height="%s" alt="%s" loading="lazy" decoding="async"></div></div>'%(k,k,'' if on else ' hidden',t['h3'],t.get('sub',''),lis(t['items'],CK),link,' is-gold' if k=='gold-crowns' else '',ti,tw,th,attr(ALT[k]))
    b=d['band']
    bhref='mailto:photos@dentalconceptssf.com' if 'photo' in b['button'].lower() else 'custom-shades.html'
    w=d['why'];icons=[PIN,STAR,PHONE]
    why=''.join('<article>'+ico(icons[i])+'<h3>'+cd['h3']+'</h3><p>'+cd['text']+'</p></article>\n' for i,cd in enumerate(w['cards']))
    st=d['start'];fq=d['faq']
    qa=''
    for q in fq['qa']:
        ans='';ul=[]
        for k,t in q['a']+[['end','']]:
            if k=='li': ul.append(t);continue
            if ul: ans+='<ul>'+''.join('<li>'+links(x)+'</li>' for x in ul)+'</ul>';ul=[]
            if k=='p': ans+='<p>'+links(t)+'</p>'
        qa+='<details><summary>%s</summary><div class="faq-answer">%s</div></details>'%(q['q'],ans)
    faq=('<section class="section faq" aria-labelledby="faq-heading"><div class="wrap faq-grid">\n<div class="faq-head"><span class="eyebrow">'+fq['eyebrow']+'</span><h2 id="faq-heading">'+fq['h2']+'</h2><p>'+fq['sub']+'</p><a class="text-link" href="contact.html">'+fq['link']+'</a></div>\n<div class="faq-list">'+qa+'</div></div></section>')
    cl=d['close']
    visit='<section class="visit"><div class="wrap visit-grid">\n<div class="visit-lead"><h2>'+cl['h2']+'</h2><p>'+links(cl['sub'])+'</p><a class="button button-light" href="contact.html">'+cl['button']+'</a></div></div></section>'
    main=('<main id="main">\n'
     '<section class="pdp-hero"><div class="wrap pdp-hero-grid"><div class="pdp-hero-copy">'+crumbs+'\n'
     '<h1>'+d['h1']+'</h1><p class="lead">'+d['lead']+'</p>\n'
     '<div class="actions"><a class="button" href="send-case.html">Start a case</a><a class="button button-outline" href="assets/digital-rx.pdf" download>Download the RX form</a></div></div>\n'
     '<figure class="pdp-hero-media'+gold+'"><img class="product-img" src="'+src+'" width="%s" height="%s" alt="'%(w,h)+attr(ALT[slug])+'" fetchpriority="high" decoding="async"></figure></div></section>\n'
     '<section class="pdp-stats" aria-label="At a glance"><div class="wrap"><dl>\n'
     +''.join('<div><dt>%s</dt><dd>%s</dd></div>\n'%(a,b2) for a,b2 in d['stats'])+
     '</dl></div></section>\n'
     '<section class="section pdp-process"><div class="wrap"><div class="section-head"><span class="eyebrow">'+d['how']['eyebrow']+'</span><h2>'+d['how']['h2']+'</h2><p>'+d['how']['sub']+'</p></div>'+stp+'</div></section>\n'
     +newsec+
     '<section class="section pdp-materials" aria-labelledby="materials-heading"><div class="wrap"><div class="center-head"><span class="eyebrow">'+o['eyebrow']+'</span><h2 id="materials-heading">'+o['h2']+'</h2><p>'+o['sub']+'</p><a class="button" href="contact.html">'+o['button']+'</a></div>\n'
     '<div class="pdp-tabs" data-count="%d"><div class="pdp-tablist" role="tablist" aria-label="%s">'%(len(grp),attr(o['eyebrow']))+tl+'</div>'+pn+'</div></div></section>\n'
     '<section class="pdp-band"><div class="wrap"><span class="eyebrow">'+b['eyebrow']+'</span><h2>'+b['h2']+'</h2><p>'+links(b['sub'])+'</p><a class="button" href="'+bhref+'">'+b['button']+'</a></div></section>\n'
     '<section class="section pdp-quality"><div class="wrap"><div class="center-head"><span class="eyebrow">'+w['eyebrow']+'</span><h2>'+w['h2']+'</h2></div><div class="pdp-quality-grid">\n'+why+
     '</div></div></section>\n'
     '<section class="section pdp-quote"><div class="wrap"><div class="center-head"><span class="eyebrow">Testimonials</span><h2>What dentists say</h2></div><figure class="quote-card is-placeholder pdp-quote-card"><blockquote><p>Placeholder: paste a real quote from a dentist about our '+plain(name).lower().replace('&','&amp;')+' here, in their own words.</p></blockquote><figcaption><strong>Dentist’s name</strong><span>Practice name, city</span></figcaption></figure></div></section>\n'
     '<section class="section pdp-start tinted"><div class="wrap pdp-start-grid"><div><span class="eyebrow">'+st['eyebrow']+'</span><h2>'+st['h2']+'</h2><p>'+links(st['sub'])+'</p></div><div class="actions"><a class="button" href="send-case.html">How to send a case</a><a class="button button-light" href="contact.html">Talk to the lab</a></div></div></section>\n'
     +faq+'\n'+visit+'\n</main>')
    s=re.sub(r'<main id="main">.*?</main>',lambda m:main,s,count=1,flags=re.S)
    # meta
    T=html.escape(plain(d['meta_title']),quote=True);M=html.escape(plain(d['meta_desc']),quote=True)
    s=re.sub(r'<title>.*?</title>','<title>'+T+'</title>',s,count=1)
    for pat in [r'(<meta name="description" content=")[^"]*',r'(<meta property="og:description" content=")[^"]*',r'(<meta name="twitter:description" content=")[^"]*']: s=re.sub(pat,lambda m:m.group(1)+M,s,count=1)
    for pat in [r'(<meta property="og:title" content=")[^"]*',r'(<meta name="twitter:title" content=")[^"]*']: s=re.sub(pat,lambda m:m.group(1)+T,s,count=1)
    js=lambda t:json.dumps(plain(t),ensure_ascii=False)[1:-1]
    s=re.sub(r'("@type":"WebPage","name":)"[^"]*","description":"[^"]*"',lambda m:m.group(1)+'"'+js(d['meta_title'])+'","description":"'+js(d['meta_desc'])+'"',s,count=1)
    s=re.sub(r'("@type":"Service","name":"[^"]*","description":)"[^"]*"',lambda m:m.group(1)+'"'+js(d['meta_desc'])+'"',s,count=1)
    fj={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":plain(q['q']),"acceptedAnswer":{"@type":"Answer","text":' '.join(plain(t) for k,t in q['a'])}} for q in fq['qa']]}
    s=re.sub(r'<script type="application/ld\+json" id="faq-ld">.*?</script>','',s,flags=re.S)
    s=s.replace('</head>','<script type="application/ld+json" id="faq-ld">'+json.dumps(fj,ensure_ascii=False)+'</script></head>',1)
    open(f,'w').write(s);return len(main)
for slug in D: print(slug,build(slug))
