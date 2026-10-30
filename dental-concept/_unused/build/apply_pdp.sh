set -e
cd "$HOME/mnt/dental-concept"
B=_unused/build
mkdir -p _unused/pre-doc-$(date +%Y%m%d-%H%M) && cp *.html style.css app.js _unused/pre-doc-$(date +%Y%m%d-%H%M)/
for f in $B/img/*.webp; do cp "$f" assets/products/step-$(basename "$f"); done
grep -q 'PDP: new "before you send' style.css || cat $B/check.css >> style.css
python3 $B/pdp_doc.py
sed -i 's/style\.css?v=[0-9]*/style.css?v=143/' *.html
ls assets/products | wc -l
