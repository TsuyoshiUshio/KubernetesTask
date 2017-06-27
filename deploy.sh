cp apply.js tasks/apply
cp general.js tasks/general
cp downloader.js tasks/downloader
cp kubectl.js tasks/apply
cp kubectl.js tasks/general
cp kubectl.js tasks/downloader
cp package.json tasks/apply 
cp package.json tasks/general
cp package.json tasks/downloader
rm -rf tasks/apply/node_modules 
rm -rf tasks/general/node_modules 
rm -rf tasks/downloader/node_modules
cp -R node_modules tasks/apply/node_modules/ 
cp -R node_modules tasks/general/node_modules/
cp -R node_modules tasks/general/node_modules/
