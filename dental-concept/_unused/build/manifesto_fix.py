import sys,os,re
os.chdir(sys.argv[1])
js=open('features.js').read()
old="  $$('.manifesto-text').forEach(function (p) {\n    var words"
new="  $$('.manifesto-text').forEach(function (p) {\n    if (!p.closest('[data-scene]')) return; // static manifesto: keep one plain paragraph\n    var words"
if 'static manifesto: keep one plain paragraph' not in js:
    assert old in js; js=js.replace(old,new,1); open('features.js','w').write(js)
css=open('features.css').read()
add='''
/* manifesto: one paragraph, 10% smaller, fewer lines (2026-10-29) */
#main .manifesto .manifesto-text{font-size:clamp(1.8rem,4.14vw,3.78rem) !important;line-height:1.12 !important;max-width:30ch}
@media (max-width:760px){#main .manifesto .manifesto-text{max-width:none}}
'''
if 'manifesto: one paragraph, 10% smaller' not in css: open('features.css','a').write(add)
for f in [x for x in os.listdir('.') if x.endswith('.html')]:
    s=open(f).read();s2=re.sub(r'features\.css\?v=\d+','features.css?v=5',s);s2=re.sub(r'features\.js\?v=\d+','features.js?v=2',s2)
    if s2!=s: open(f,'w').write(s2)
print('ok')
