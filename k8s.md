Kubernetes extension for VSTS 
===

Enable us to use Kubernetes related product for VSTS. Also it enable us to kubernetes endpoint for kubectl. You can use kubectl, helm, and istioctl by this extension. This task aims for using Linux Hosted Agent(preview). GitHub repo is [here](https://github.com/TsuyoshiUshio/KubernetesTask).

**NOTE:** this task is NOT the official Kubernetes task created by Microsoft. 

Currently you can use istio/helm feature from 3.0.0. or later.

![Header](https://raw.githubusercontent.com/TsuyoshiUshio/KubernetesTask/master/docs/images/Header.png)

# 1. How to use 

## 1.1. Create an endopint 

### Choose Kubernetes endpoint

Choose Kubernetes endpoint.

![Kubernetes Endpoint](https://raw.githubusercontent.com/TsuyoshiUshio/KubernetesTask/master/docs/images/endpoing01.png)

### Set your endpoint 

Kubernetes Connection pops up. Then fill the box.

![Kubernetes Connection](https://raw.githubusercontent.com/TsuyoshiUshio/KubernetesTask/master/docs/images/endpoint02.png)

* Connection name: Endpoint name (Anything is OK)
* Server URL : K8s Cluster URL for memo (Not used for the task until now)
* kubeconfig : Copy & paste your config file 

You can get config file from your k8s master node `.kube/config`. 
See [Microsoft Azure Container Service Engine - Kubernetes Walkthrough](https://docs.microsoft.com/en-us/azure/container-service/container-service-kubernetes-walkthrough)
Then copy the file content and paste on kubeconfig column.

**NOTE:**  

If you copy config file into Kubeconfig, the build log of VSTS might show you the contents.
This happens when you copy multiline. 
Kubernetes tasks support base64 encoding for Kubeconfig column. If you want to avoid this problem,
you can convert your config file into base64 string. You can find the tool for converting config file. `tools/convert.ts`

**Usage**

your config file should be `LF` not `CRLF` if you want to use on Linux hosted build.

```
tsc -p .
node tools/convert.js {filename}
```

You can find {filename}_new file which include base64 encoding string.

## 1.2. downloader 

If you want to use kubectl/istioctl/helm binary, you need to use this task in advance. For the backword compatibility, I letf the old tasks like `kubernetes apply task` and `kubernetes general task`. However, I recommend to use the new task with downloader. It will be much more flexible and simple.

If you use this downlaoder, you can avoid to download the binary several times. This task download kubectl/istioctl/helm binary into `./.vstsbin` directory and add it to the `PATH` environment variables. Also, it set `KUBECONFIG` environment variables. If you use this downloader, the following task can use kubectl/istioctl/helm command without specifying the full-path binary file name.

![downloader](https://raw.githubusercontent.com/TsuyoshiUshio/KubernetesTask/master/docs/images/downloader.png)

* Display Name: Name of the task
* k8s endpoint: select the endpoint which you created at `1.1. Create an endopint`
* kubectl binary: Leave it blank. Don't use this.(depricated)
* kubectl download version:If you want to specify the version, fill this, e.g. `v1.5.2`. Blank means latest.
* enable istioctl: Check it if you want to use istioctl
* istioctl download version: Specify the version. Blank doesn't mean the latest. not like the kubectl downloader. e.g. `0.1.5`
* enable helm: Check it if you want to use helm
* helm download version: Specify the version. Blank doesn't mean the latest. not like the kubectl downloader.  e.g. `2.4.1`

## 1.3. kubectl task

You can execute kubectl using this task. If you want to use this task, you need to use `downloader` task in advance. See `1.2. downloader`.

![kubectl task](https://raw.githubusercontent.com/TsuyoshiUshio/KubernetesTask/master/docs/images/kubectl.png)

* Display name: Name of the task
* Sub Command: Specify kubectl sub command like apply, get, and so on. 
Refer the [Overview of kubectl](https://kubernetes.io/docs/user-guide/kubectl-overview/).
* Argument: You can use any options and arguments. You can specify these with a space or a new line. New line will be converted into a space.

## 1.4. istio task

You can execute istioctl using this task. If you want to use this task, you need to use `downloader` task in advance. See `1.2. downloader`.

![istio task](https://raw.githubusercontent.com/TsuyoshiUshio/KubernetesTask/master/docs/images/istio.png)

* Display name: Name of the task
* Sub Command: Specify istio sub command like replace, create, and so on. 
Refer the [istioctl](https://istio.io/docs/reference/commands/istioctl.html).
* Argument: You can use any options and arguments. You can specify these with a space or a new line. New line will be converted into a space.

## 1.5. helm task

You can execute helm using this task. If you want to use this task, you need to use `downloader` task in advance. See `1.2. downloader`.

![helm task](https://raw.githubusercontent.com/TsuyoshiUshio/KubernetesTask/master/docs/images/helm.png)

* Display name: Name of the task
* Sub Command: Specify helm sub command like create, verify, and so on. 
Refer the [Using helm](https://docs.helm.sh/using_helm/#using-helm).
* Argument: You can use any options and arguments. You can specify these with a space or a new line. New line will be converted into a space.

## 1.6. kubernetes apply task

**NOTE:** kubernetes apply/general task is for backward compatibility.

### 1.6.1. Store and link kubectl command link with VSTS private repository (Optional)

If you use ver 2.0, you don't need this operation. However, this operation could fasten your pipeline without downloading a kubectl binary.

Link your repo which has kubecntl command. 

![Link Artifact](https://raw.githubusercontent.com/TsuyoshiUshio/KubernetesTask/master/docs/images/linkaritifact.png)

Please `chmod +x kubectl` before adding kubectl to your repo.

![VSTS Private Repository](https://raw.githubusercontent.com/TsuyoshiUshio/KubernetesTask/master/docs/images/repo01.png)

## 1.6.2. Setup your kubectlapply task

Then you can use the endpoint, specify the kubectl command and YAML file 
for deployment. Internally, it calls `kubectl apply` command. 

![kubectlapply Task](https://raw.githubusercontent.com/TsuyoshiUshio/KubernetesTask/master/docs/images/apply.png)

If you want to change the YAML file dynamically, you can use [Replace tokens](https://marketplace.visualstudio.com/items?itemName=qetza.replacetokens) on the VSTS Marketplace.

You can see the `downloadVersion` textbox. If you don't specify `KubectlBinary`, this task automatically download the latest
kubebinary. If you want to specify the version, fill the `downloadVersion`, e.g. `v1.5.2`.

## 1.7. kubernetes general task

**NOTE:** kubernetes apply/general task is for backward compatibility.

You can use every kubectl command you want. Use kubectlgeneral task.
You can specify a lot of arguments separated with space or new line. 

![kubectlgeneral Task](https://raw.githubusercontent.com/TsuyoshiUshio/KubernetesTask/master/docs/images/general.png)

You can see the `downloadVersion` textbox. If you don't specify `KubectlBinary`, this task automatically download the latest
kubebinary. If you want to specify the version, fill the `downloadVersion`, e.g. `v1.5.2`.


# 2. Project GitHub

Any contribution is welcome!

[TsuyoshiUshio/KubernetesTask](https://github.com/TsuyoshiUshio/KubernetesTask)

