from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
# from .scrape import scrape_jlyric
from .scraping_service import Scraper
import json

@csrf_exempt
async def getData(request):
    if request.method == 'POST':
        args = json.loads(request.body.decode('utf-8'))
        # response = await scrape_jlyric(args)
        scraper = Scraper()
        response = await scraper.run(args)
        if response is None or len(response)==0:
            return JsonResponse({"error": "No data found"}, status=404)
        return JsonResponse(response,safe=False)
    else:
        return HttpResponse("Error 404! bad request")
# Create your views here.
