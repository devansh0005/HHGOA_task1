import os
from PIL import Image, ImageChops

def trim_chrome(img):
    # Chrome is at the top. Let's just crop the top 180 pixels.
    w, h = img.size
    return img.crop((0, 180, w, h))

if not os.path.exists('assets'):
    os.makedirs('assets')

# 1. Main Logo (from sc1)
img1 = Image.open('sc1.png')
img1 = trim_chrome(img1)
w, h = img1.size

# We want the logo which is in the center. Let's just crop the center explicitly.
# Logo is Hacker House Goa. It's roughly between 10% and 90% width, and 20% to 60% height.
logo = img1.crop((w * 0.05, h * 0.15, w * 0.95, h * 0.75))
logo.save('assets/logo.png')

# 2. Web Background (from sc2)
img2 = Image.open('sc2.png')
img2 = trim_chrome(img2)
# Resize to something manageable for web background
bg = img2.resize((1440, int(1440 * (img2.height / img2.width))))
bg.save('assets/bg.png')

# 3. Pattern (from sc3)
img3 = Image.open('sc3.png')
img3 = trim_chrome(img3)
w3, h3 = img3.size
# Pattern is at the very bottom
pattern = img3.crop((0, h3 - 120, w3, h3))
pattern.save('assets/pattern.png')

# 4. Palm trees from sc7 for the card
img7 = Image.open('sc7.png')
img7 = trim_chrome(img7)
w7, h7 = img7.size
# Crop bottom left palm tree
palm_left = img7.crop((0, h7 * 0.4, w7 * 0.3, h7))
palm_left.save('assets/palm_left.png')

# Crop bottom right palm tree
palm_right = img7.crop((w7 * 0.7, h7 * 0.4, w7, h7))
palm_right.save('assets/palm_right.png')

print("Cropped successfully!")
