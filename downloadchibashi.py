# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')
from flask import *
from time import gmtime, strftime
import subprocess
import uuid
import json
import os.path
from apiclient.errors import HttpError

import MediaDownloader as MD
import YoutubeSearch as YS

from config import *

app = Flask(__name__, static_folder='static')
result = {}
debugViewMode = False



########## START YOUTUBE Section ##########

#curl -H "Content-type: application/json" -X POST http://127.0.0.1:8080/downloader -d '{"url":"https://www.youtube.com/watch?v=MnFkC1VG8rs"}'
@app.route("/media/download", methods=['GET', 'POST'])
def downloader():
        if request.method == 'POST':
            session['url'] = request.json["url"]
            try:
                session['quality'] = request.json["quality"]
            except:
                session['quality'] = ""
            session['name'] = str(uuid.uuid1()) + '.txt'
            #return redirect(url_for('downloader'))

        if 'url' in session:
            dirname = strftime("%Y-%m-%d_%H-%M-%S-", gmtime()) + str(uuid.uuid1())
            url =escape(session['url'])
            quality = escape(session['quality'])
            addresstodl = u"cd static/downloads/;mkdir " + dirname + u";cd "+dirname+ u";python  " + MAIN_FOLDER + u"youtubedownloader.py '" + url.encode('utf-8').strip() +u"' "   + session['name'] + u" " + dirname + u" " + quality.encode('utf-8').strip()
            ##print addresstodl
            proc = subprocess.Popen(addresstodl, shell=True, stdin=None, stdout=None, stderr=None, close_fds=True)
            media_info = {}
            result['status'] = 'ok'
            media_info['url'] = session['url']
            media_info['name'] = session['name']
            result['object'] = media_info
            return json.dumps(result)

@app.route('/<string:vid>')
@app.route('/', methods = ['POST'])
@app.route('/')
def index(vid=None):
    url =''
    user = ''
    token = ''
    status = ''
    message = ''

    if session.get('token'):
        token=session.get('token')

    if session.get('status'):
        status=session.get('status')
        message=session.get('message')
        session.pop('status', None)
        session.pop('message', None)

    if vid:
        url=vid

    if request.method == 'POST':
        url=request.form["url"]

    if debugViewMode:
        res = make_response(render_template('debug.html', url=url, user=user, token=token, status=status, message=message))
    else:
        res = make_response(render_template('index.html', url=url, user=user, token=token, status=status, message=message))

    return res


#curl -H "Content-type: application/json" -X POST http://127.0.0.1:8080/media/info -d '{"url":"https://www.youtube.com/watch?v=MnFkC1VG8rs"}'
@app.route('/media/info', methods=['POST'])
def get_info():
    url = request.json["url"]
    try:
        media_info = MD.get_brief_info(url)
        result['status'] = 'ok'
        #media_info['dl_server'] = SD.getServer(url)
        result['object'] = media_info
        session[url] = result['object']['title']

        #add bad word filtering to avoid adult content downloading
        #TODO : https://github.com/saadeghi/curse
        badwords = []
        with open('badwords.txt') as f:
            lines = f.readlines()

        for line in lines:
            badwords.append(line.replace('\r', '').replace('\n', ''))
        testresult = result['object']['title']
        testresult = testresult.lower()

        for badword in badwords:
            if u" "+badword+" " in u""+testresult :
                result['status'] = 'error'
                result['message'] = "متاسفانه لینک درخواستی شما حاوی کلمات غیرمجاز است"
                result['object'] = ''
                return json.dumps(result)

        #add persian bad word filtering to avoid adult content downloading
        badwords = []
        with open('badwords_farsi.txt') as f:
            lines = f.readlines()

        for line in lines:
            badwords.append(line.replace('\r', '').replace('\n', ''))
        testresult = result['object']['title']

        for badword in badwords:
            if u" "+badword+" " in u""+testresult :
                result['status'] = 'error'
                result['message'] = "متاسفانه لینک درخواستی شما حاوی کلمات غیرمجاز است"
                result['object'] = ''
                return json.dumps(result)

        return json.dumps(result)
    except Exception, e:
        result['status'] = 'error'
        #result['message'] = e[0][1]
        result['message'] = "متاسفانه امکان دانلود این آدرس وجود ندارد"
        result['object'] = ''
        return json.dumps(result)


#curl -H "Content-type: application/json"  http://127.0.0.1:8080/getinformation/9181d7e2-c722-4d1d-b33d-da033885a6b4.txt
@app.route('/media/state/<path:filename>')
def getinformation(filename):
    status_list = {}
    if session.get('user_name') is None:
        filepath = "static/downloads/" + filename
    else:
        filepath = "static/users_downloads/" + filename
    if os.path.isfile(filepath) :

        labels = ['url', 'percent','size','time','name']
        label_index = 0
        with open(filepath) as f:
            for line in f:
                status_list[labels[label_index]] = line.rstrip('\n')
                if label_index == 4 :
                    status_list["folder"] = ORDINARY_DOWNLOAD_SERVER + status_list["name"][:-4]

                label_index = label_index + 1

        if label_index > 0 :
            result["status"] = "ok"
        else :
            result["status"] = "error"
    else :
        result["status"] = "error"

    result['object'] = status_list
    return json.dumps(result)


@app.route('/media/youtubeSearch/<path:name>', methods=['GET', 'POST'])
def youtubeSearch(name):
    max_results = 20
    try:
        result['status'] = 'ok'
        media_info = YS.youtube_search(name, max_results)
        result['object'] = media_info
    except HttpError, e:
        result['status'] = 'error'
        result['message'] = "An HTTP error %d occurred:\n%s" % (e.resp.status, e.content)
        result['object'] = ''

    return json.dumps(result)
########## END YOTUBE Section ##########


if __name__ == "__main__":
    debugViewMode = True
    # set the secret key.  keep this really secret:
    app.secret_key = MySECRET
    print "Run Debug Mode"
    app.run(debug=True,host=DEBUG_HOST,port=DEBUG_PORT)


app.secret_key = MySECRET
