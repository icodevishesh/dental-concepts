import re,os,sys,glob,shutil
D=sys.argv[1];B=sys.argv[2];os.chdir(D)
base='planner.html' if os.path.exists('planner.html') else 'upload-case.html'
s=open(base).read()
T='Upload a Case | Dental Concepts San Francisco'
M='Upload a digital case to Dental Concepts: choose the restoration, add your practice details, and upload your intraoral scan files and completed RX form.'
s=re.sub(r'<title>.*?</title>','<title>'+T+'</title>',s,count=1)
for a in ['name="description"','property="og:description"','name="twitter:description"']: s=re.sub(r'(<meta '+a+r' content=")[^"]*',lambda m:m.group(1)+M,s,count=1)
for a in ['property="og:title"','name="twitter:title"']: s=re.sub(r'(<meta '+a+r' content=")[^"]*',lambda m:m.group(1)+T,s,count=1)
s=re.sub(r'("@type":"WebPage","name":)"[^"]*","description":"[^"]*"',lambda m:m.group(1)+'"'+T+'","description":"'+M+'"',s,count=1)
main=open(B+'/upload_main.html').read()
s=re.sub(r'<main id="main">.*?</main>',lambda m:main,s,count=1,flags=re.S)
if 'upload.js' not in s: s=re.sub(r'(<script src="features\.js\?v=\d+" defer></script>)',r'\1<script src="upload.js?v=1" defer></script>',s,count=1)
open('upload-case.html','w').write(s)
shutil.copy(B+'/upload.js','upload.js')
UP='<a href="upload-case.html"><span class="q-ico"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M7 18a4.5 4.5 0 0 1-.8-8.93A6 6 0 0 1 17.7 8.1 4 4 0 0 1 17 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12v8M8.5 15.5 12 12l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Upload a case</a>'
n=0
for f in glob.glob('*.html'):
    h=open(f).read();o=h
    h=re.sub(r'<a href="planner\.html"><span class="q-ico">.*?</span>Case planner</a>','',h,flags=re.S)
    if 'quick-menu' in h and 'href="upload-case.html"><span class="q-ico">' not in h:
        h=h.replace('<p class="quick-label">Tools</p>','<p class="quick-label">Tools</p>'+UP,1)
    h=h.replace('href="planner.html">Case planner<','href="upload-case.html">Upload a case<')
    h=h.replace('href="planner.html">Plan a case<','href="upload-case.html">Upload a case<')
    h=h.replace('href="planner.html">plan a case<','href="upload-case.html">upload a case<')
    h=h.replace('planner.html','upload-case.html')
    h=re.sub(r'features\.css\?v=\d+','features.css?v=4',h)
    h=h.replace('9 AM to 4 PM','9 AM to 5 PM')
    if h!=o: open(f,'w').write(h);n+=1
js=open('features.js').read().replace("['Case planner', 'planner.html']","['Upload a case', 'upload-case.html']");open('features.js','w').write(js)
css=open('features.css').read()
if 'Upload a case page (2026-10-29)' not in css: open('features.css','a').write(open(B+'/upload.css').read())
if os.path.exists('planner.html'):
    os.makedirs('_unused',exist_ok=True);os.replace('planner.html','_unused/planner.html')
left=[f for f in glob.glob('*.html') if 'planner.html' in open(f).read() or 'Plan a case' in open(f).read() or 'Case planner' in open(f).read()]
print('updated',n,'files; leftovers:',left,'; features.js planner:', 'planner.html' in open('features.js').read())
