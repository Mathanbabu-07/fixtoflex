import urllib.request
import json
import urllib.parse

def test_api():
    query = urllib.parse.quote("react")
    url = f"https://unstop.com/api/public/opportunity/search-result?opportunity=internships&page=1&per_page=15&searchTerm={query}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            items = data.get('data', {}).get('data', [])
            print(f"Found {len(items)} items")
            if items:
                print(json.dumps(items[0], indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
