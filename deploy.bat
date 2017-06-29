copy apply.js tasks\apply
copy general.js tasks\general
copy downloader.js tasks\downloader
copy kubectl.js tasks\apply
copy kubectl.js tasks\general
copy kubectl.js tasks\downloader

copy istioctl.js tasks\istio
copy base.js tasks\istio

copy package.json tasks\apply 
copy package.json tasks\general
copy package.json tasks\downloader
copy package.json tasks\istio

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

xcopy /Y /I /S node_modules tasks\\apply\\node_modules
xcopy /Y /I /S node_modules tasks\\general\\node_modules
xcopy /Y /I /S node_modules tasks\\downloader\\node_modules
xcopy /Y /I /S node_modules tasks\\istio\\node_modules