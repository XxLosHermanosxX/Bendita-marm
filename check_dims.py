import urllib.request
import struct

def get_image_size(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            head = response.read(1024)
            if len(head) < 24:
                return None
            
            # JPEG: (2 bytes: 0xFF, 0xD8), ... (2 bytes: 0xFF, 0xC0), (2 bytes: length), (1 byte: precision), (2 bytes: height), (2 bytes: width)
            # Find SOF0 (Start Of Frame 0) marker: 0xFF 0xC0
            
            ftype = 0
            # JPEG validation
            if head[0] == 0xFF and head[1] == 0xD8:
                # Scan for SOF0/SOF2
                i = 2
                while i < len(head) - 10:
                    marker = head[i]
                    if marker == 0xFF:
                        code = head[i+1]
                        if code >= 0xC0 and code <= 0xCF and code != 0xC4 and code != 0xC8 and code != 0xCC:
                            # Found SOF
                            height = head[i+5] * 256 + head[i+6]
                            width = head[i+7] * 256 + head[i+8]
                            return width, height
                        else:
                            # Skip variable length marker
                            length = head[i+2] * 256 + head[i+3]
                            i += length + 2
                            continue
                    i += 1
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

urls = [
    "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/t483yxmu_IMG-20260113-WA0002%281%29.jpg",
    "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/wj3dr1nd_IMG-20260113-WA0000%281%29.jpg",
    "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/3qf9k38o_IMG-20260113-WA0001%281%29.jpg"
]

for i, url in enumerate(urls):
    dims = get_image_size(url)
    print(f"Image {i+1}: {dims}")
