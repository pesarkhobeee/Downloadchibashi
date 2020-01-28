DownloadChiBashi
==========================

DownloadChiBashi is a simple python Web Interface based on Flask framework for youtube-dl. You can find the rest of english after Farsi description.  

<div dir="rtl">
دانلودچی‌باشی یک رابط کاربری تحت وب برای دانلود فایل های صوتی و تصویری از منابع مهم جهانی بالاخص سایت یوتیوب هست:   
</div>

![ScreenShot](https://raw.github.com/pesarkhobeee/Downloadchibashi/master/static/screenshot/screenshot1.png)

![ScreenShot](https://raw.github.com/pesarkhobeee/Downloadchibashi/master/static/screenshot/screenshot2.png)

![ScreenShot](https://raw.github.com/pesarkhobeee/Downloadchibashi/master/static/screenshot/screenshot3.png)

<div dir="rtl">
شما میتوانید آن را بسادگی بر روی سرور خود نصب و راه اندازی کنید، در مثال پایین فرض بر این است که شما قصد نصب بر روی یک سرور لینوکس اوبنتو نسخه ۱۸ بدون هیچ تنظیمات قبلی را دارید فلذا در اولین گام تمام پیش نیازها نصب و سپس فایل های پروژه دانلودچی‌باشی دریافت و از روی انها سرور وب و خود برنامه با کمک تکنولوژی داکر به سادگی ساخته و اجرا میشوند:   
</div>


```
sudo apt update
sudo apt upgrade
sudo apt install docker docker-compose git
sudo systemctl status docker
sudo usermod -aG docker ${USER}
su - ${USER}
docker-compose --version

git clone https://github.com/pesarkhobeee/Downloadchibashi.git
cd Downloadchibashi
find ./ -type f -exec sed -i -e 's/downloadchibashi.ir/YOURDOMAIN/g' {} \;
docker-compose up -d
docker-compose ps
```


# How to Run:

### Development Environment

```
python2.7 -m virtualenv env
source env/bin/activate
```

#### Frontend
The frontend app is developed using AngularJS. You can find source files in `static/ui` folder. 
```
# installing frontend app dependencies
bower install

# intalling frontend minification dependencies
npm install

# minifiying frontend app
npm run build
```

### Production Environment

For production you can use docker and docker-compose, but before running it you should change **Domain** name which is **downloadchibashi.ir**

```
find ./ -type f -exec sed -i -e 's/downloadchibashi.ir/YOURDOMAIN/g' {} \;
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

