Kubernetes extension for VSTS
===

Enable Kubernetes extension for VSTS. Kubernetes endpoint for kubectl config and kubectl apply build task.

# 1. Build the extension

```
tfx extension create --manifest-globs vss-extension.json
``` 

# 2. Upload to the market place

Go to the Market place [Market Place Manage](https://marketplace.visualstudio.com/manage)
Then upload and share with your VSTS account.
[Tsuyoshi Ushio's publisher site](https://marketplace.visualstudio.com/manage/publishers/tsuyoshiushio)

# 3 Current load map

Now I just start this project. Just initial commit. 
However, you can see the image of the endpoint and build task. 

1. Kubectl apply with kubectl binary. (You need to store your kubectl command in some repos.)
2. Enable to select the version of kubectl and automatically installed.
