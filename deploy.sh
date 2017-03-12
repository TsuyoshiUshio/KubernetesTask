cp apply.js tasks/apply
cp general.js tasks/general
cp kubectl.js tasks/apply
cp kubectl.js tasks/general
cp package.json tasks/apply 
cp package.json tasks/general
rm -rf tasks/apply/node_modules 
rm -rf tasks/general/node_modules 
cp -R node_modules tasks/apply/node_modules/ 
cp -R node_modules tasks/general/node_modules/
