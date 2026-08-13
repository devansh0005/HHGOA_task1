from PIL import Image
import os

if not os.path.exists('assets'):
    os.makedirs('assets')

# 1. Main Logo
img1 = Image.open('sc1.png')
# Estimate crop for centered logo
# 2940x1912, let's crop from x=200, y=500 to x=2740, y=1400
logo = img1.crop((200, 500, 2740, 1400))
logo.save('assets/logo.png')

# 2. Web Background (resize sc2)
img2 = Image.open('sc2.png')
bg = img2.resize((2940//2, 1912//2))
bg.save('assets/bg.png')

# 3. Bottom pattern from sc3
img3 = Image.open('sc3.png')
# Bottom of sc3 has the patterned border
pattern = img3.crop((0, 1912-100, 2940, 1912))
pattern.save('assets/pattern.png')

