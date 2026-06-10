import os
import urllib.request as urllib_request
from urllib.error import HTTPError, URLError
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# Target website
base_url = "https://ul.edu.pk/"

# Create folder to save images
os.makedirs("images", exist_ok=True)

# Helper to perform a GET with a simple User-Agent
def fetch_bytes(url, timeout=15):
    req = urllib_request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib_request.urlopen(req, timeout=timeout) as resp:
        return resp.read()

def fetch_text(url, timeout=15, encoding="utf-8"):
    data = fetch_bytes(url, timeout=timeout)
    try:
        return data.decode(encoding)
    except Exception:
        return data.decode(encoding, errors="replace")

# Get page content
try:
    page_html = fetch_text(base_url)
except (HTTPError, URLError, Exception) as e:
    raise RuntimeError(f"Failed to fetch {base_url}: {e}")

# Parse HTML
soup = BeautifulSoup(page_html, "html.parser")

# Find all image tags
img_tags = soup.find_all("img")

print(f"Found {len(img_tags)} images. Downloading...")

# Download each image
for i, img in enumerate(img_tags, start=1):
    img_url = img.get("src")
    if not img_url:
        continue

    # Make full URL if image link is relative
    full_url = urljoin(base_url, img_url)

    try:
        # Download the image
        img_data = fetch_bytes(full_url)
        # Extract image name
        img_name = os.path.basename(full_url.split("?")[0])
        if not img_name:
            img_name = f"image_{i}"
        # File path
        file_path = os.path.join("images", f"{i}_{img_name}")
        
        # Save image
        with open(file_path, "wb") as f:
            f.write(img_data)
        
        print(f"✅ Saved: {file_path}")
    except (HTTPError, URLError, Exception) as e:
        print(f"❌ Failed to download {full_url} — {e}")

print("\n🎉 All available images downloaded successfully to 'images' folder.")
