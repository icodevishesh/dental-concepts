import os,re,shutil,glob,time
H=os.path.expanduser('~/mnt')
D=H+'/dental-concept'; P=H+'/dental-concept - Premium Deisgn'
os.chdir(D)
PRODUCTS=['full-contour-zirconia-crowns','layered-porcelain-crowns','lithium-disilicate','gold-crowns','full-arch-restorations','implant-crowns','custom-abutments','temporary-crowns-abutments','digital-wax-up','model-printing','custom-shades']
# 1. backup current working copy
bk=D+'/_unused/pre-merge-'+time.strftime('%Y%m%d-%H%M')
os.makedirs(bk,exist_ok=True)
for f in glob.glob('*.html')+['style.css','app.js']: shutil.copy2(f,bk+'/'+f)
ns=re.search(r'<section class="numbers-strip".*?</section>',open('index.html').read(),re.S).group(0)
# 2. shared files from Premium
for f in ['index.html','planner.html','features.css','features.js']: shutil.copy2(P+'/'+f,D+'/'+f)
for f in glob.glob(P+'/assets/**/*',recursive=True):
    rel=os.path.relpath(f,P)
    if os.path.isfile(f) and not os.path.exists(D+'/'+rel):
        os.makedirs(os.path.dirname(D+'/'+rel),exist_ok=True);shutil.copy2(f,D+'/'+rel);print('asset',rel)
# 3. non-product pages: Premium version (has the interaction layer)
for f in glob.glob(P+'/*.html'):
    b=os.path.basename(f);slug=b[:-5]
    if slug in PRODUCTS or b in ('index.html','planner.html'): continue
    shutil.copy2(f,D+'/'+b)
# 4. product pages: today's <main> inside the Premium page frame
frame=open(P+'/rx.html').read()
fh=frame[frame.find('<body'):frame.find('<main id="main">')]
ff=frame[frame.find('</main>')+len('</main>'):]
LINKS='<link rel="stylesheet" href="features.css?v=1">'
SCR='<script src="features.js?v=1" defer></script>'
for slug in PRODUCTS:
    s=open(slug+'.html').read()
    head=s[:s.find('<body')]
    if 'features.css' not in head:
        head=re.sub(r'(<link rel="stylesheet" href="style\.css\?v=\d+">)',r'\1'+LINKS,head,count=1)
        head=re.sub(r'(<script src="app\.js\?v=\d+" defer></script>)',r'\1'+SCR,head,count=1)
    main=s[s.find('<main id="main">'):s.find('</main>')+len('</main>')]
    open(slug+'.html','w').write(head+fh+main+ff)
# 5. today's inner-page touches on the Premium copies
def eb(t): return '<span class="eyebrow">'+t+'</span>'
def put(f,before,label):
    s=open(f).read()
    if before in s and eb(label)+before not in s: s=s.replace(before,eb(label)+before,1);open(f,'w').write(s)
put('about.html','<h2 id="about-us-heading">','Our story')
put('about.html','<h2 id="vm-heading">','What drives us')
put('about.html','<h2 id="kf-heading">','Why Dental Concepts')
put('about.html','<h2>From early zirconia milling','Our history')
put('about.html','<h2>Meet our team','The people')
a=open('about.html').read()
if 'numbers-strip' not in a:
    m=re.search(r'<section class="section about-us".*?</section>',a,re.S)
    if m: a=a[:m.end()]+'\n'+ns+a[m.end():];open('about.html','w').write(a)
s=open('services.html').read()
for cid,lab in [('crowns','Restorations'),('implants','Implant solutions'),('other','Digital &amp; custom')]:
    s=re.sub(r'(<section class="svc-cat" id="'+cid+r'"><div class="section-head">)(<h2>)',r'\1'+eb(lab)+r'\2',s,count=1) if eb(lab) not in s else s
if eb('How it works') not in s: s=s.replace('<div class="start-copy"><h2>','<div class="start-copy">'+eb('How it works')+'<h2>',1)
s=re.sub(r'<p class="lab-credit">.*?</p>\s*','',s,flags=re.S)
open('services.html','w').write(s)
put('rx.html','<h2>Dental Concepts prescription form','Download')
for f in glob.glob('blog-*.html'):
    s=open(f).read()
    if eb('Keep reading') not in s: s=s.replace('<div class="section-head"><h2>More articles','<div class="section-head">'+eb('Keep reading')+'<h2>More articles',1);open(f,'w').write(s)
# 6. versions
for f in glob.glob('*.html'):
    s=open(f).read();s=re.sub(r'style\.css\?v=\d+','style.css?v=142',s);s=re.sub(r'app\.js\?v=\d+','app.js?v=15',s);open(f,'w').write(s)
print('backup:',bk)
for f in sorted(glob.glob('*.html')): s=open(f).read();print(f,'features' if 'features.js' in s else 'NO-FEATURES','planner' if 'planner.html' in s else 'no-planner','ai' if 'footer-ai' in s else 'no-ai')
