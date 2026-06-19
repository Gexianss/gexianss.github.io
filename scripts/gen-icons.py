import os
from playwright.sync_api import sync_playwright

os.makedirs('public/icons', exist_ok=True)
# 雙圈徽記 + 中央 </>，與站上 BrandMark.jsx 同造型
HTML = """
<!DOCTYPE html><html><head><style>
body {{ margin:0; }} .icon {{ width:{s}px; height:{s}px; background:#2D4D8E; border-radius:{r}px;
display:flex; align-items:center; justify-content:center; }}
svg {{ width:80%; height:80%; }}
.st {{ fill:none; stroke:#F7F4EF; stroke-linecap:round; stroke-linejoin:round; }}
</style></head><body><div class="icon">
<svg viewBox="0 0 100 100">
<circle class="st" style="stroke-width:4" cx="50" cy="50" r="40"/>
<circle class="st" style="stroke-width:3" cx="50" cy="50" r="33"/>
<path class="st" style="stroke-width:5" d="M44,41 L34,50 L44,59"/>
<path class="st" style="stroke-width:5" d="M55,38 L45,62"/>
<path class="st" style="stroke-width:5" d="M56,41 L66,50 L56,59"/>
</svg></div></body></html>
"""
with sync_playwright() as p:
    browser = p.chromium.launch()
    for size in (512, 192):
        page = browser.new_page(viewport={'width': size, 'height': size})
        page.set_content(HTML.format(s=size, r=size * 96 // 512))
        page.wait_for_timeout(800)
        page.screenshot(path=f'public/icons/icon-{size}.png')
    browser.close()
print('icons generated')
