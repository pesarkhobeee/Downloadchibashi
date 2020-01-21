import subprocess
import sys
import re
from config import *
import os

def get_size(start_path = '.'):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
    return total_size/1048567

try:
    link = sys.argv[1]
except:
    link = ''
print "link: " + link

try:
    quality = sys.argv[4]
    quality = " -f " + quality
except:
    quality = ''
print "quality: " + quality

try:
    name = sys.argv[2]
except:
    name = ''
print "name: " + name

try:
    directory = sys.argv[3]
except:
    directory = ""
print "directory: " + directory

try:
    user_id = sys.argv[5]
except:
    user_id = ""
print "user_id: " + user_id

#cmd = "/usr/local/bin/youtube-dl " + link + " -f " + quality
cmd = "/usr/local/bin/youtube-dl " + link + quality
process = subprocess.Popen(
    cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
)
tmp = ""
Destination = ''

while True:

    out = process.stdout.read(1)
    if out == '' and process.poll() != None:
        break
    if out != '':
        sys.stdout.write(out)
        #fi.write("%s" % (out))
        if (out != '\n') and (out != '\r'):
            #fi.write("%s" % (out))
            tmp = tmp + str(out)
        else:
            if "Destination:" in tmp :
                Destination = tmp

            if not ("Destination:" in tmp) and ("[download]" in tmp) and ("at" in tmp) :
                download_progress = re.findall(r'[^ ]+',tmp)
                print tmp
                print download_progress
                fi = open("../" + name, "w")
                fi.write(link)
                fi.write("\n")
                fi.write(download_progress[1][:-1])
                fi.write("\n")
                fi.write(download_progress[3])
                fi.write("\n")
                fi.write(download_progress[7])
                fi.write("\n")
                fi.close()
            tmp = ""
            sys.stdout.flush()

fi = open("../" + name, "a")
result_file_name = directory + ".zip"
fi.write(result_file_name)
print "result_file_name " + result_file_name
fi.close()

