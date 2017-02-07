copy apply.js ApplyTaskFolder
copy general.js GeneralTaskFolder
copy kubectl.js ApplyTaskFolder
copy kubectl.js GeneralTaskFolder
copy package.json ApplyTaskFolder 
copy package.json GeneralTaskFolder

IF EXIST ApplyTaskFolder\node_modules ( 
RD /s /q ApplyTaskFolder\node_modules 
)

IF EXIST GeneralTaskFolder\node_modules ( 
RD /s /q GeneralTaskFolder\node_modules 
)

xcopy /Y /I /S node_modules ApplyTaskFolder\\node_modules
xcopy /Y /I /S node_modules GeneralTaskFolder\\node_modules