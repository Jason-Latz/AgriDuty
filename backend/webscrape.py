import requests
from bs4 import BeautifulSoup

url = 'https://www.cbsnews.com/news/trump-reciprocal-tariffs-liberation-day-list/'
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")


