from bs4 import BeautifulSoup
import sys
import requests
from csv import writer

pageNumber = 0
URL = 'https://www.guloggratis.dk/s/q-land%20cruiser/?n=' + str(pageNumber)

page = requests.get(URL)
soup = BeautifulSoup(page.text, 'html.parser')

#content = soup.find(class_='item')
#print(content.find(class_='text'))

# dbaListing mainContent

# Check how many pages in the search
spanElement = soup.find(class_='css-1dp3uur-OutroSpan')
splittetElement = spanElement.text.split()
#print("There are this many pages to search: " + splittetElement[-1])
amountOfPages = int(splittetElement[-1])
	
# Search specific items:::

positiveWords = 'toyota', 'landcruiser', 'land cruiser'
negativeWords = 'opkøber', 'opkøbe'
hitWords = 'hj60', 'hj61','fj60', 'fj62', '1987', '1986', '1985', '1988', '1989', '1990'


hits = []



for x in range(amountOfPages):
	URL = 'https://www.guloggratis.dk/s/q-land+cruiser/?n=' + str(x*60)
	page = requests.get(URL)
	soup = BeautifulSoup(page.text, 'html.parser')
	items = soup.find_all(class_='css-10inwkt-StyledLink-ListingItemLink-ListingItemLink-ListingItemLink')
	#print('Checking page: ' + URL)

	for content in items:
		containsNWord = False
		containsPWord = False
		containsHWord = False
		text = content.find(class_='css-cqyjj9-Description').text
		#print(text)
		itemURL = content.parent.find('a',href=True)
		#print("Found listing URL: ", itemURL['href'])
		for pWord in positiveWords:
			if pWord in text.lower():
				containsPWord = True
		if containsPWord:
			for nWord in negativeWords:
				if nWord in text.lower():
					containsNWord = True
			for hitWord in hitWords:
				if hitWord in text.lower():
					containsHWord = True
		if containsPWord:
			if not containsNWord:
				if containsHWord:
					itemURLComplete = 'https://guloggratis.dk' + itemURL['href']
					print(itemURLComplete)
					hits.append(itemURLComplete)	
#print('Found these hits: ')
#print(hits)
sys.stdout.flush()
