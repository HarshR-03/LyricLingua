from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from . import youtubeSearch
from django.views.decorators.csrf import csrf_exempt
import json
# adding Folder_2 to the system path
@csrf_exempt
def dummy(request):
    if request.method == 'POST':
        args = json.loads(request.body.decode('utf-8'))
        print(args,args['q'])
        response = youtubeSearch.youtube_search(args)
        return JsonResponse(response,safe=False)
    else:
        return HttpResponse("Error 404! bad request")