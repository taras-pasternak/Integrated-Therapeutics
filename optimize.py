from PIL import Image
import os

img_path = 'assets/images/home.jpg'
try:
    img = Image.open(img_path)
    # Save as WebP for better optimization, or just optimized JPEG
    img.save('assets/images/home_opt.webp', format='WebP', quality=80)
    print("Optimized successfully as WebP")
except Exception as e:
    print(f"Error: {e}")
