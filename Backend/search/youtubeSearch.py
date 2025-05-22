from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv
import os
import sys
from pathlib import Path

# BASE_DIR = Path(__file__).resolve().parent.parent
# Add parent directory to the Python path
# sys.path.append(str(BASE_DIR.parent))
# Load the .env file
# load_dotenv(dotenv_path=BASE_DIR / '.env')
load_dotenv()

DEVELOPER_KEY = os.getenv('DEVELOPER_KEY')
# print(DEVELOPER_KEY)
YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'

def youtube_search(options):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
    developerKey=DEVELOPER_KEY)

    # Call the search.list method to retrieve results matching the specified
    # query term.
    try:
        search_response = youtube.search().list(
        q= str(options['q']),
        part='id,snippet',
        maxResults=int(options['max_results']),
        videoCategoryId=int(options['categoryId']),
        type="video"
        ).execute()
        return search_response.get('items', [])
    except HttpError as e:
        return 'An HTTP error %d occurred:\n%s' % (e.resp.status, e.content)

    # videos = []
    # channels = []
    # playlists = []

    # Add each result to the appropriate list, and then display the lists of
    # matching videos, channels, and playlists.
    #   for search_result in search_response.get('items', []):
    #     if search_result['id']['kind'] == 'youtube#video':
    #       videos.append('%s (%s)' % (search_result['snippet']['title'],
    #                                  search_result['id']['videoId']))
    #     elif search_result['id']['kind'] == 'youtube#channel':
    #       channels.append('%s (%s)' % (search_result['snippet']['title'],
    #                                    search_result['id']['channelId']))
    #     elif search_result['id']['kind'] == 'youtube#playlist':
    #       playlists.append('%s (%s)' % (search_result['snippet']['title'],
    #                                     search_result['id']['playlistId']))

    #   print ('Videos:\n', '\n'.join(videos), '\n')
    #   print ('Channels:\n', '\n'.join(channels), '\n')
    #   print ('Playlists:\n', '\n'.join(playlists), '\n')

#   parser = argparse.ArgumentParser()
#   parser.add_argument('--q', help='Search term', default='Google')
#   parser.add_argument('--max-results', help='Max results', default=25)
#   args = parser.parse_args()
