import re,sys
f=sys.argv[1];s=open(f).read()
s=s.replace('<section class="manifesto" data-scene="manifesto"','<section class="manifesto"',1)
old=re.search(r'<span class="tag t1".*?<span class="tag t3"[^>]*>Hand finished</span>',s,re.S)
if old and 'manifesto-tags' not in s:
    s=s.replace(old.group(0),'<div class="manifesto-tags"><span class="tag t1">Since 2006</span><span class="tag t2">Shade matched</span><span class="tag t3">Hand finished</span></div>',1)
open(f,'w').write(s)
print('scene' , 'data-scene="manifesto"' in s, 'tags', 'manifesto-tags' in s)
