import re, json, os, subprocess, zipfile, time, urllib, urllib2
from urlparse import urlparse


class MediaDownloader:
    def __init__(self, info):
        self.info = info

        # single media
        self.type = 's'

    def get_file_name(self, code = -1):
        ext = ''

        if code != -1:
            for e in self.info['formats']:
                if e['format_id'] == code:
                    ext = e['ext']
                    break
            code = '.' + code
        else:
            ext = self.info['ext']
            code = ''

        name = self.info['mtitle'] + code + '.' + ext
        return name

    def download(self, code = -1):
        '''Downloads the video given by 'url' and with the quality given by
        'code'.'''

        ext = ''
        if code != -1:
            ext = " -f " + code

        rename_to = self.get_file_name(code)
        dst = download_location + rename_to
        command = ''

        if not os.access(dst, os.F_OK):
            outtmpl = dst
            #this might throw exception, should be caught in the caller of this function
            command = "youtube-dl --newline -ci" + ext + " -o '" + outtmpl + "' '" + self.info['webpage_url'] + "'"

        return command, rename_to, dst

    def finalize_download(self):
        pass


class SouncloudChannelDownloader:
    def __init__(self, url):
        self.url = url

        # souncloud multiple
        self.type = 'sm'

    def download(self, code):
        o = urlparse(self.url)

        self.folder = o.path[1:].replace('/','-')
        self.filename = self.folder + '-' + str(time.ctime()) + '.zip'
        self.destination = download_location + self.folder + '/'

        command = ''

        if not os.path.exists(self.destination):
            os.makedirs(self.destination)

        #if not os.access(self.destination, os.F_OK):
        outtmpl = self.destination + '%(title)s.%(ext)s'
        command = "youtube-dl --newline -ci -o '" + outtmpl + "' '" + self.url + "'"

        return command, self.filename, download_location + self.filename

    def finalize_download(self):
        zipf = zipfile.ZipFile(download_location + self.filename, 'w')

        for file in os.listdir(self.destination):
            print '*********** dd'
            zipf.write(self.destination + file, arcname=file)

        zipf.close()


def download_image_base64(img):
    class MyOpener(urllib.FancyURLopener):
    	version = ("User-Agent=Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3 ( .NET CLR 3.5.30729)")

    my_urlopener = MyOpener()
    response = my_urlopener.open(img)

    data = response.read().encode('base64')
    data_url = 'data:image/png;base64,{}'.format(urllib.quote(data.rstrip('\n')))
    return data_url

def MediaDownloaderFactory(url):
    media = None
    url = parse_url(url)

    media_count = get_media_count(url)
    if media_count == 'invalid':
        raise Exception((0,'Invalid url'))

    if media_count > 1:
        media = SouncloudChannelDownloader(url)
    else:
        info = get_information(url)
        media = MediaDownloader(info)

    return media

def get_brief_info(url):
    """
    Brife information for media or channels
    """
    url = parse_url(url)

    media_info = {}

    media_count = get_media_count(url)
    if media_count == 'invalid':
        raise Exception((0,'Invalid url'))

    if media_count > 1:
        media_info['multiple'] = True
        media_info['media_count'] = media_count
        media_info['thumb_url'] = 'http://downloadchibashi.ir/static/soundcloud-icon.png'
        o = urlparse(url)
        media_info['title'] = o.path[1:].replace('/',' ')
    else:
        info = get_information(url)

        media_info['quality'] = info['quality']
        if 'thumbnails' not in info:
            media_info['thumb_url'] = 'http://downloadchibashi.ir/static/no-thumb.gif'
        else:
            media_info['thumb_url'] = download_image_base64(info['thumbnails'][0]['url'])
        media_info['title'] = info['title']
        media_info['multiple'] = False

    return media_info


def get_information(url):
    o = urlparse(url)

    if len(o.scheme) == 0 or len(o.netloc) == 0:
        raise Exception((0,'Invalid url'))

    extractors = ['youtube', 'facebook', 'soundcloud', 'vimeo']

    try:
        info = get_info(url)

        output = subprocess.check_output(["youtube-dl", "-F", url])

    except Exception, e:
        raise Exception((1, 'Unable to download this link'))

    media_count = get_media_count(url)
    if media_count == 'invalid':
        raise Exception((0,'Invalid url'))

    if media_count > 1:
        info['quality'] = []
    else:
        best = ''
        for line in output.split('\n')[5:]:
            if 'best' in line:
                best = line.split(' ')[0]
                break

        formats = {}
        unknown_count = 0
        all_count = 0
        for f in info['formats']:
            if 'unknown' in f['format']:
                unknown_count += 1

            formats[f['format_id']] = f['format'].replace(f['format_id']+' - ', f['ext']+' - ')
            if f['format_id'] == best:
                formats[f['format_id']] = formats[f['format_id']] + ' (best)'

            all_count += 1

        if all_count == unknown_count:
            info['quality'] = []
        else:
            info['quality'] = formats


    if info['extractor'] not in extractors:
        raise Exception((2, 'This site is not supported'))

    return info


def get_info(url):
    """
    Getting all information of a media
    """
    result = subprocess.check_output(['youtube-dl','--no-playlist', '-j', url])

    try:
        vid_info = json.loads(result)
        vid_info['mtitle'] = get_title(vid_info)

    except ValueError, e:
        raise Exception(e)

    return vid_info


def get_title(info):
    """
    Manupulating file name
    """
    filtered = re.sub(r'[^\w]+', '-', info['title'], flags=re.UNICODE)
    if filtered == '-':
        return info['id']
    return filtered

def parse_url(url):
    parsed = url
    o = urlparse(url)
    if 'facebook' in o.netloc and 'video.php' not in o.path:
        path = o.path
        if path[-1] == '/':
            path = path[:-1]
        parsed = 'https://www.facebook.com/video.php?v=' + path.split('/')[3]
    elif 'soundcloud' in o.netloc:
        path = o.path
        if path[-1] == '/':
            path = path[:-1]
            url = url[:-1]
        if len(path.split('/')) == 2:
            parsed = url + '/tracks'

    return parsed

def get_media_count(url):
    o = urlparse(url)

    if 'soundcloud.com' in o.netloc:
        data = json.loads(urllib.urlopen(
        'http://api.soundcloud.com/resolve?url=%s&client_id=c27e92402a038fea8fd0532b23b9b169' % url).read())

        if 'tracks' in data:
            return len(data['tracks'])
        elif 'kind' in data:
            if data['kind'] == 'track':
                return 1
            elif data['kind'] == 'playlist':
                return len(json.loads(urllib.urlopen(data['uri']).read())['tracks'])
            else:
                raise Exception((1, 'Invalid'))
        else:
            if 'kind' in data[0] and data[0]['kind'] == 'track':
                return len(data)
            else:
                raise Exception((1, 'Invalid'))
    else:
        return 1

# The last character must be '/'
download_location = "/home/farid/htdocs/webdisk1/"
