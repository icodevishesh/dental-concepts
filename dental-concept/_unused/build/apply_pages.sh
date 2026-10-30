set -e
cd "$HOME/mnt/dental-concept"
B=_unused/build
grep -q 'doc content 2026-10: home hero' style.css || cat $B/pages.css >> style.css
python3 $B/pages_doc.py
sed -i 's/9:00 AM to 4:00 PM/9 AM to 5 PM/g; s/"closes":"16:00"/"closes":"17:00"/g' *.html
sed -i 's/style\.css?v=[0-9]*/style.css?v=144/' *.html
grep -c '4:00 PM\|"16:00"' *.html | grep -v ':0' || echo hours-clean
