Update Chain ID in ui
=====================

chainid=abcdef

replace chain id in
graphenejs-ws/lib/ChainConfig.js

cd graphenejs-ws
npm run build
git add .
git commit -m 'release chainid $chainid'

cd ../graphenejs-lib
npm update graphenejs-ws
npm run build
git add .
git commit -m 'release chainid $chainid'

cd ../ui/web
npm update graphenejs-lib