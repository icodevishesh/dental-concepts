import re,os,sys,shutil
D=sys.argv[1];B=sys.argv[2];os.chdir(D)
# 1. copy admin + data + site scripts
for sub in ['admin','data']:
    os.makedirs(sub,exist_ok=True)
    for f in os.listdir(os.path.join(B,sub)): shutil.copy(os.path.join(B,sub,f),os.path.join(sub,f))
for f in ['site-data.js','upload.js']: shutil.copy(os.path.join(B,f),f)
# 2. post.html from an existing article page
src=open('blog-custom-shade-appointments.html').read()
head=src[:src.find('</head>')]
head=re.sub(r'<title>.*?</title>','<title>Article | Dental Concepts</title>',head,count=1)
for a in ['name="description"','property="og:description"','name="twitter:description"']: head=re.sub(r'(<meta '+a+r' content=")[^"]*',r'\1Practical notes from the Dental Concepts lab in San Francisco.',head,count=1)
for a in ['property="og:title"','name="twitter:title"']: head=re.sub(r'(<meta '+a+r' content=")[^"]*',r'\1Article | Dental Concepts',head,count=1)
head=re.sub(r'<link rel="canonical"[^>]*>','',head)
head=re.sub(r'<script type="application/ld\+json">\{"@context":"https://schema.org","@type":"(BlogPosting|Article|BreadcrumbList|WebPage)".*?</script>','',head,flags=re.S)
body=src[src.find('</head>'):]
more=re.search(r'<div class="posts">(.*?)</div></div></section>',body,re.S)
moreHTML=more.group(1) if more else ''
visit=re.search(r'<section class="visit">.*?</section>',body,re.S)
main=('<main id="main">\n<div id="post-root"><div class="wrap post-wrap" style="padding:140px 0 80px"><p>Loading the article…</p></div></div>\n'
 '<section class="section tinted"><div class="wrap"><div class="section-head"><span class="eyebrow">Keep reading</span><h2>More articles</h2><p><a class="text-link" href="blog.html">All posts</a></p></div><div class="posts" id="more-posts">'+moreHTML+'</div></div></section>\n'
 +(visit.group(0) if visit else '')+'\n</main>')
body=re.sub(r'<main id="main">.*?</main>',lambda m:main,body,count=1,flags=re.S)
open('post.html','w').write(head+body)
# 3. script tags + events hook on public pages
TAGS='<script src="data/config.js?v=1"></script><script src="data/store.js?v=1" defer></script><script src="site-data.js?v=1" defer></script>'
for f in ['index.html','blog.html','post.html','events.html','contact.html','upload-case.html']:
    s=open(f).read()
    if 'site-data.js' not in s:
        s=re.sub(r'(<script src="features\.js\?v=\d+" defer></script>)',lambda m:TAGS+m.group(1),s,count=1)
    if f=='events.html' and 'data-events' not in s:
        s=s.replace('<section class="section flush-top"><div class="wrap"><div class="empty-state">','<section class="section flush-top"><div class="wrap" data-events><div class="empty-state">',1)
    if f=='upload-case.html': s=re.sub(r'upload\.js\?v=\d+','upload.js?v=2',s)
    s=re.sub(r'features\.css\?v=\d+','features.css?v=6',s)
    open(f,'w').write(s)
for f in [x for x in os.listdir('.') if x.endswith('.html')]:
    s=open(f).read();s2=re.sub(r'features\.css\?v=\d+','features.css?v=6',s)
    if s2!=s: open(f,'w').write(s2)
css=open('features.css').read()
if 'admin-managed content: post author box' not in css: open('features.css','a').write(open(os.path.join(B,'site-data.css')).read())
print('ok', [f for f in ['index.html','blog.html','post.html','events.html','contact.html','upload-case.html'] if 'site-data.js' in open(f).read()], 'events hook', 'data-events' in open('events.html').read())
