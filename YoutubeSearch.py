#!/usr/bin/python

from apiclient.discovery import build
import json

import  urllib, urllib2

# Set DEVELOPER_KEY to the API key value from the APIs & auth > Registered apps
# tab of
#   https://cloud.google.com/console
# Please ensure that you have enabled the YouTube Data API for your project.
DEVELOPER_KEY = ""
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

def download_image_base64(img):
    class MyOpener(urllib.FancyURLopener):
        version = ("User-Agent=Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3 ( .NET CLR 3.5.30729)")

    my_urlopener = MyOpener()
    response = my_urlopener.open(img)

    data = response.read().encode('base64')
    data_url = 'data:image/png;base64,{}'.format(urllib.quote(data.rstrip('\n')))
    return data_url

def youtube_search(query, max_results):
  youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
    developerKey=DEVELOPER_KEY)

  # Call the search.list method to retrieve results matching the specified
  # query term.
  search_response = youtube.search().list(
    q=query,
    part="id,snippet",
    maxResults=max_results
  ).execute()

  videos = []
  channels = []
  playlists = []
  myjson = []

  # Add each result to the appropriate list, and then display the lists of
  # matching videos, channels, and playlists.
  for search_result in search_response.get("items", []):
    if search_result["id"]["kind"] == "youtube#video":
      search_result["snippet"]["thumbnails"]["default"]["url"] = download_image_base64(search_result["snippet"]["thumbnails"]["default"]["url"])
      search_result["snippet"]["thumbnails"]["high"]["url"] = download_image_base64(search_result["snippet"]["thumbnails"]["high"]["url"])
      search_result["snippet"]["thumbnails"]["medium"]["url"] = download_image_base64(search_result["snippet"]["thumbnails"]["medium"]["url"])

      myjson.append(search_result);
      videos.append("%s (%s)" % (search_result["snippet"]["title"],
                                 search_result["id"]["videoId"]))
    elif search_result["id"]["kind"] == "youtube#channel":
      channels.append("%s (%s)" % (search_result["snippet"]["title"],
                                   search_result["id"]["channelId"]))
    elif search_result["id"]["kind"] == "youtube#playlist":
      playlists.append("%s (%s)" % (search_result["snippet"]["title"],
                                    search_result["id"]["playlistId"]))
  return json.dumps(myjson)
  #print "==================================="
  #print "Videos:\n", "\n".join(videos), "\n"
  #print "Channels:\n", "\n".join(channels), "\n"
  #print "Playlists:\n", "\n".join(playlists), "\n"
