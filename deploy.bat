copy apply.js tasks\apply
copy general.js tasks\general
copy downloader.js tasks\downloader
copy kubectl.js tasks\apply
copy kubectl.js tasks\general
copy kubectl.js tasks\downloader

copy istioctl.js tasks\istio
copy base.js tasks\istio
copy helm.js tasks\helm
copy base.js tasks\helm
copy kubectlexec.js tasks\kubectl
copy base.js tasks\kubectl


copy package.json tasks\apply 
copy package.json tasks\general
copy package.json tasks\downloader
copy package.json tasks\istio
copy package.json tasks\helm
copy package.json tasks\kubectl

IF EXIST tasks\apply\node_modules ( 
RD /s /q tasks\apply\node_modules 
)

IF EXIST tasks\general\node_modules ( 
RD /s /q tasks\general\node_modules 
)

IF EXIST tasks\downloader\node_modules ( 
RD /s /q tasks\downloader\node_modules 
)

IF EXIST tasks\istio\node_modules (
RD /s /q tasks\istio\node_modules
)

IF EXIST tasks\helm\node_modules (
RD /s /q tasks\helm\node_modules
)

IF EXIST tasks\kubectl\node_modules (
RD /s /q tasks\kubectl\node_modules
)

xcopy /Y /I /S node_modules tasks\\apply\\node_modules
xcopy /Y /I /S node_modules tasks\\general\\node_modules
xcopy /Y /I /S node_modules tasks\\downloader\\node_modules
xcopy /Y /I /S node_modules tasks\\istio\\node_modules
xcopy /Y /I /S node_modules tasks\\helm\\node_modules
xcopy /Y /I /S node_modules tasks\\kubectl\\node_modules