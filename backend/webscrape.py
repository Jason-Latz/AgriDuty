"""Quick experiment for scraping a list of tariffs from CBS News."""

import requests
from bs4 import BeautifulSoup

url = 'https://www.cbsnews.com/news/trump-reciprocal-tariffs-liberation-day-list/'
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")



# TODO: parse the HTML for any tariff values of interest
