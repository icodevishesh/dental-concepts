import re,json,sys,html
SRC=sys.argv[1];OUT=sys.argv[2]
L=open(SRC).read().split('\n')
ORDER=[('Full Contour Zirconia','full-contour-zirconia-crowns'),('Layered Porcelain','layered-porcelain-crowns'),('Lithium Disilicate','lithium-disilicate'),('Gold Crowns','gold-crowns'),('Full Arch','full-arch-restorations'),('Implant Crowns','implant-crowns'),('Custom Abutments','custom-abutments'),('Temporary Crowns','temporary-crowns-abutments'),('Digital Wax','digital-wax-up'),('Model Printing','model-printing'),('Custom Shades','custom-shades')]
def clean(t):
    t=t.replace('\\"','"').replace("\\'","'").replace('\\|','|').replace('\\$','$').replace('\\&','&')
    t=t.replace('---','—').replace('--','–')
    t=re.sub(r'(^|[\s(])"',r'\1“',t);t=t.replace('"','”');t=t.replace("'",'’')
    t=html.escape(t,quote=False)
    return t.strip()
# page boundaries
marks=[i for i,l in enumerate(L) if re.search(r'\[Webpage \d+:',l)]
pages={}
for idx,i in enumerate(marks):
    title=re.search(r'\[Webpage \d+: (.*?)\]',L[i]).group(1)
    end=marks[idx+1] if idx+1<len(marks) else len(L)
    slug=next((s for k,s in ORDER if title.startswith(k)),None)
    if slug: pages[slug]=L[i+1:end]
def paras(lines):
    out=[];cur=[]
    for l in lines+['']:
        if l.strip()=='' :
            if cur: out.append(cur);cur=[]
        else: cur.append(l)
    res=[]
    for p in out:
        first=p[0]
        if re.match(r'-\s+',first):
            res.append(('li',clean(' '.join(re.sub(r'^\s*>?\s*','',x) for x in [re.sub(r'^-\s+','',first)]+p[1:]))))
        else:
            res.append(('p',' '.join(x.strip() for x in p)))
    return res
def kv(t):
    m=re.match(r'\*\*(.+?):?\*\*:?\s*(.*)$',t)
    if m and (m.group(1).endswith(':') or t.startswith('**'+m.group(1)+':**') or t.startswith('**'+m.group(1)+'**:')):
        return m.group(1).rstrip(':').strip(),m.group(2).strip()
    return None
data={}
for slug,lines in pages.items():
    d={}
    txt='\n'.join(lines)
    mt=re.search(r'\*\*Meta Title:\*\*(.*?)\n\n',txt,re.S).group(1)
    md=re.search(r'\*\*Meta Description:\*\*(.*?)\*\*Slug',txt,re.S).group(1)
    d['meta_title']=clean(' '.join(mt.split()));d['meta_desc']=clean(' '.join(md.split()))
    # sections
    secs={};cur=None
    for l in lines:
        m=re.match(r'## Section (\d+):\s*(.*)',l)
        if m: cur=len(secs)+1;secs[cur]={'title':m.group(2),'lines':[]};continue
        if cur: secs[cur]['lines'].append(l)
    P={k:paras(v['lines']) for k,v in secs.items()}
    def field(ps,key):
        for k,t in ps:
            r=kv(t) if k=='p' else None
            if r and r[0]==key: return clean(r[1])
    h=P[1];d['h1']=field(h,'H1');d['lead']=field(h,'Subtext')
    d['stats']=[[clean(a) for a in kv(t)] for k,t in P[2] if kv(t)]
    # how it works
    hw=P[3];d['how']={'eyebrow':field(hw,'Eyebrow'),'h2':field(hw,'H2'),'sub':field(hw,'Subtext'),'steps':[]}
    st=None;seen_sub=0
    for k,t in hw:
        r=kv(t) if k=='p' else None
        if not r: continue
        if r[0]=='Step label': st={'label':clean(r[1])};d['how']['steps'].append(st)
        elif st and r[0]=='H3': st['h3']=clean(r[1])
        elif st and r[0]=='Subtext': st['text']=clean(r[1])
    # new section
    ns=P[4];n={'title':secs[4]['title'],'eyebrow':field(ns,'Eyebrow'),'h2':field(ns,'H2'),'groups':[],'note':None}
    grp=None
    for k,t in ns:
        if k=='li':
            if grp is None: grp={'label':None,'items':[]};n['groups'].append(grp)
            grp['items'].append(t);continue
        r=kv(t)
        if r and r[0] in('Eyebrow','H2'): continue
        if t.startswith('(Suggested'): continue
        if r and r[1]=='': grp={'label':clean(r[0]),'items':[]};n['groups'].append(grp);continue
        n['note']=clean(t)
    d['new']=n
    # options
    op=P[5];o={'eyebrow':field(op,'Eyebrow'),'h2':field(op,'H2'),'sub':field(op,'Subtext'),'button':field(op,'Button'),'tabs':[]}
    o['labels']=[x.strip() for x in field(op,'Tab labels').split('·')]
    tab=None;started=False
    for k,t in op:
        r=kv(t) if k=='p' else None
        if r and r[0]=='H3': tab={'h3':clean(r[1]),'items':[]};o['tabs'].append(tab);started=True;continue
        if not started: continue
        if k=='li': tab['items'].append(t)
        elif r and r[0]=='Subtext': tab['sub']=clean(r[1])
        elif r and r[0]=='Link': tab['here']=r[1].strip().lower().startswith('you are')
        elif not r: tab['sub']=clean(t)
    d['options']=o
    b=P[6];d['band']={'eyebrow':field(b,'Eyebrow'),'h2':field(b,'H2'),'sub':field(b,'Subtext'),'button':field(b,'Button')}
    w=P[7];d['why']={'eyebrow':field(w,'Eyebrow'),'h2':field(w,'H2'),'cards':[]}
    for k,t in w:
        r=kv(t) if k=='p' else None
        if r and r[0]=='H3': d['why']['cards'].append({'h3':clean(r[1])})
        elif r and r[0]=='Subtext' and d['why']['cards']: d['why']['cards'][-1]['text']=clean(r[1])
    g=P[9];d['start']={'eyebrow':field(g,'Eyebrow'),'h2':field(g,'H2'),'sub':field(g,'Subtext')}
    f=P[10];d['faq']={'eyebrow':field(f,'Eyebrow'),'h2':field(f,'H2'),'sub':field(f,'Subtext'),'link':field(f,'Link'),'qa':[]}
    for k,t in f:
        m=re.match(r'\*\*Q:\s*(.*?)\*\*$',t) if k=='p' else None
        if m: d['faq']['qa'].append({'q':clean(m.group(1)),'a':[]});continue
        if d['faq']['qa']: d['faq']['qa'][-1]['a'].append([k,clean(t) if k=='p' else t])
    c=P[11];d['close']={'h2':field(c,'H2'),'sub':field(c,'Subtext') or next(clean(t) for k,t in c if k=='p' and not kv(t)),'button':field(c,'Button')}
    data[slug]=d
json.dump(data,open(OUT,'w'),indent=1,ensure_ascii=False)
print(len(data))
