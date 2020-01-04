cp apply.js tasks/apply
cp general.js tasks/general
cp downloader.js tasks/downloader
cp kubectl.js tasks/apply
cp kubectl.js tasks/general
cp kubectl.js tasks/downloader

cp base.js tasks/istio
cp istioctl.js tasks/istio

cp base.js tasks/helm
cp istioctl.js tasks/helm

cp base.js tasks/flux
cp fluxctl.js tasks/flux

cp base.js tasks/kubectl
cp kubectlexec.js tasks/kubectl

cp package.json tasks/apply 
cp package.json tasks/general
cp package.json tasks/downloader
cp package.json tasks/istio
cp package.json tasks/helm
cp package.json tasks/kubectl
cp package.json tasks/flux

rm -rf tasks/apply/node_modules 
rm -rf tasks/general/node_modules 
rm -rf tasks/downloader/node_modules
rm -rf tasks/istio/node_modules
rm -rf tasks/helm/node_modules
rm -rf tasks/kubectl/node_modules
rm -rf tasks/flux/node_modules

cp -R node_modules tasks/apply/node_modules/ 
cp -R node_modules tasks/general/node_modules/
cp -R node_modules tasks/general/node_modules/
cp -R node_modules tasks/istio/node_modules/
cp -R node_modules tasks/helm/node_modules/
cp -R node_modules tasks/kubectl/node_modules/
cp -R node_modules tasks/flux/node_modules/
