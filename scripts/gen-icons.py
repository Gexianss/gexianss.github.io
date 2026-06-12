import os
from playwright.sync_api import sync_playwright

os.makedirs('public/icons', exist_ok=True)
HTML = """
<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@600&display=swap');
body {{ margin:0; }} .icon {{ width:{s}px; height:{s}px; background:#2D4D8E; border-radius:{r}px;
display:flex; align-items:center; justify-content:center;
font-family:'Noto Serif TC',serif; font-weight:600; font-size:{f}px; color:#F7F4EF; }}
</style></head><body><div class="icon">張</div></body></html>
"""
with sync_playwright() as p:
    browser = p.chromium.launch()
    for size in (512, 192):
        page = browser.new_page(viewport={'width': size, 'height': size})
        page.set_content(HTML.format(s=size, r=size * 96 // 512, f=size * 280 // 512))
        page.wait_for_timeout(1500)
        page.screenshot(path=f'public/icons/icon-{size}.png')
    browser.close()
print('icons generated')
