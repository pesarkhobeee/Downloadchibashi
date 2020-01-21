DownloadChiBashi
==========================

DownloadChiBashi is a simple python Web Interface based on Flask framework for youtube-dl.

![ScreenShot](https://raw.github.com/pesarkhobeee/Downloadchibashi/master/static/screenshot/screenshot1.png)

![ScreenShot](https://raw.github.com/pesarkhobeee/Downloadchibashi/master/static/screenshot/screenshot2.png)

![ScreenShot](https://raw.github.com/pesarkhobeee/Downloadchibashi/master/static/screenshot/screenshot3.png)

![ScreenShot](https://raw.github.com/pesarkhobeee/Downloadchibashi/master/static/screenshot/screenshot4.png)


# How to Run:

### Development Environment

```
python2.7 -m virtualenv env
source env/bin/activate
```

### Production Environment

For production you can use docker and docker-compose, but before running it you should change **Domain** name which is **downloadchibashi.ir**

```
sed -i 's/downloadchibashi.ir/YOURDOMAIN/g' *
```  

After that, you can easily set up your docker container with help of :

```
docker-compose up -d
```

For Youtube search ability add new server IP to youtube google developer console:
https://console.developers.google.com/apis/credentials/

# Todo:

* Porting Python 2 Code to Python 3
* CI pipeline
* Security guidelines
* Coding style and General guidelines
* Tests and Debugging guidelines


### License:

MIT

