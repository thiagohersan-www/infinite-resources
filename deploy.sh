#!/bin/bash

git remote add mn thiagohersan-hub:marinagem-www/infinitum.marinagem.com.git
git remote add th thiagohersan-hub:thiagohersan-www/infinitum.thiagohersan.com.git
git checkout --orphan gh-pages
git rm --cached -r . &> /dev/null
echo "infinitum.marinagem.com" > CNAME
git add assets/ css/ js/ index.html CNAME
git commit -m "updates sites" &> /dev/null
git push mn :gh-pages
git push th :gh-pages
git push mn gh-pages
echo "infinitum.thiagohersan.com" > CNAME
git add CNAME
git commit -m "updates sites" &> /dev/null
git push th gh-pages
