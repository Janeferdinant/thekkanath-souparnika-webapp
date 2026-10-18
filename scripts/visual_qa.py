"""Capture public UI at handoff widths and smoke-check key interactions.

Run against a local Vite server: python scripts/visual_qa.py
Requires Python Playwright, its Chromium browser, and Pillow installed on the machine.
"""
from pathlib import Path
from datetime import date, timedelta
import hashlib
import json
from PIL import Image, ImageChops, ImageStat
from playwright.sync_api import sync_playwright

BASE = 'http://127.0.0.1:5173'
OUT = Path('docs/screenshots')
OUT.mkdir(parents=True, exist_ok=True)

manifest = json.loads(Path('thekkanath-uiux-agent-kit/design/PHOTO_SOURCE_MANIFEST.json').read_text(encoding='utf-8'))
assert len(manifest) == 7
for item in manifest:
    source = Path('public/assets/venue') / Path(item['original']).name
    assert hashlib.sha256(source.read_bytes()).hexdigest() == item['sha256_original'], source
    optimized = Path('public/assets/venue/optimized') / Path(item['webp']).name
    assert optimized.is_file(), optimized
    with Image.open(source) as jpg, Image.open(optimized) as webp:
        original_pixels, optimized_pixels = jpg.convert('RGB'), webp.convert('RGB')
        assert original_pixels.size == optimized_pixels.size, optimized
        mean_difference = sum(ImageStat.Stat(ImageChops.difference(original_pixels, optimized_pixels)).mean) / 3
        assert mean_difference < 3, (optimized, mean_difference)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for width in (360, 390, 768, 1024, 1440):
        page = browser.new_page(viewport={"width": width, "height": 900}, device_scale_factor=1)
        page.goto(BASE, wait_until='networkidle')
        page.screenshot(path=str(OUT / f'home-{width}-viewport.png'))
        page.locator('img').evaluate_all("images => images.forEach(img => img.loading = 'eager')")
        page.evaluate("""async () => { for (let y = 0; y < document.body.scrollHeight; y += 650) {
          scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 80)); }
          scrollTo(0, 0); }""")
        page.wait_for_function("[...document.images].every(img => img.complete)", timeout=10000)
        failed_images = page.locator('img').evaluate_all("images => images.filter(img => !img.naturalWidth).map(img => img.currentSrc || img.src)")
        assert not failed_images, f"missing images at {width}: {failed_images}"
        if width in (390, 1440):
            tour_card = page.locator('.lux-tour-card')
            tour_card.scroll_into_view_if_needed()
            page.locator('.lux-tour-photo img').evaluate('async img => { await img.decode(); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); }')
            tour_card.screenshot(path=str(OUT / f'tour-section-{width}.png'))
        state = page.evaluate("""() => ({ width: document.documentElement.scrollWidth,
          viewport: innerWidth, heroLoaded: document.querySelector('.lux-hero-image img')?.complete,
          heroNaturalWidth: document.querySelector('.lux-hero-image img')?.naturalWidth })""")
        assert state['width'] <= width + 1, f"horizontal overflow at {width}: {state}"
        assert state['heroLoaded'] and state['heroNaturalWidth'] > 0, f"hero image missing: {state}"
        if width <= 980:
            page.get_by_role('button', name='Open menu').click()
            assert page.get_by_role('navigation', name='Mobile navigation').is_visible()
            page.set_viewport_size({"width": 1024, "height": 900})
            assert page.get_by_role('navigation', name='Mobile navigation').count() == 0
            page.set_viewport_size({"width": width, "height": 900})
            page.get_by_role('button', name='Open menu').click()
            page.keyboard.press('Escape')
            assert page.get_by_role('navigation', name='Mobile navigation').count() == 0
        page.close()

    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(BASE + '/gallery', wait_until='networkidle')
    assert page.locator('.lux-gallery-tile').count() == 7
    assert page.locator('.lux-gallery-tile img').evaluate_all('(images) => images.every(img => img.complete && img.naturalWidth > 0)')
    page.get_by_role('button', name='View full photograph: Event seating').click()
    assert page.get_by_role('dialog', name='Actual venue photograph viewer').is_visible()
    assert page.evaluate("document.activeElement?.getAttribute('aria-label')") == 'Close photo viewer'
    page.keyboard.press('Shift+Tab')
    assert page.evaluate("document.activeElement?.getAttribute('aria-label')") == 'Next photograph'
    page.keyboard.press('Tab')
    assert page.evaluate("document.activeElement?.getAttribute('aria-label')") == 'Close photo viewer'
    page.keyboard.press('ArrowRight')
    assert 'Entrance and lobby' in page.get_by_role('dialog').inner_text()
    page.keyboard.press('Escape')
    assert page.get_by_role('dialog').count() == 0
    page.screenshot(path=str(OUT / 'gallery-desktop.png'))
    for path in ('halls', 'facilities', 'tour', 'enquire', 'contact', 'faq', 'halls/stage-hall'):
        page.goto(BASE + '/' + path, wait_until='networkidle')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), f'overflow on {path}'
        page.screenshot(path=str(OUT / (path.replace('/', '-') + '-desktop.png')))
    page.goto(BASE + '/admin', wait_until='networkidle')
    assert page.locator('body').inner_text().strip()
    page.screenshot(path=str(OUT / 'admin-desktop.png'))
    page.goto(BASE + '/admin/bookings', wait_until='networkidle')
    booking_trigger = page.get_by_role('button', name='Create New Booking')
    booking_trigger.click()
    booking_name = page.get_by_role('dialog').locator('input[type=text]').first
    booking_name.fill('Modal Focus QA')
    assert booking_name.evaluate('(input) => document.activeElement === input')
    page.keyboard.press('Escape')
    assert page.get_by_role('dialog').count() == 0
    assert booking_trigger.evaluate('(button) => document.activeElement === button')
    page.close()

    reduced = browser.new_page(viewport={"width": 390, "height": 844}, reduced_motion='reduce')
    reduced.goto(BASE, wait_until='networkidle')
    assert reduced.locator('.lux-hero-particles').count() == 1
    assert reduced.evaluate("getComputedStyle(document.querySelector('.lux-hero-image img')).animationName") == 'none'
    reduced.screenshot(path=str(OUT / 'home-mobile-reduced-motion.png'))
    reduced.close()
    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    for path in ('halls', 'facilities', 'gallery', 'tour', 'enquire', 'contact'):
        mobile.goto(BASE + '/' + path, wait_until='networkidle')
        assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), f'mobile overflow on {path}'
        mobile.screenshot(path=str(OUT / (path + '-mobile.png')))
    mobile.close()

    # Exercise the existing multi-step enquiry and verify its saved record reaches admin.
    flow = browser.new_page(viewport={"width": 390, "height": 844})
    flow.goto(BASE + '/enquire', wait_until='networkidle')
    flow.get_by_role('button', name='Continue to Contact Details').click()
    assert 'Please select a preferred event date' in flow.locator('body').inner_text()
    flow.get_by_label('Preferred event date').fill((date.today() + timedelta(days=7)).isoformat())
    flow.get_by_role('button', name='Continue to Contact Details').click()
    flow.get_by_label('Your full name').fill('Visual QA Guest')
    flow.get_by_label('Mobile phone number').fill('9876543210')
    flow.get_by_role('button', name='Review & Confirm').click()
    flow.locator('input[type=checkbox]').last.check()
    flow.get_by_role('button', name='Submit Booking Enquiry').click()
    flow.get_by_text('Enquiry Saved').wait_for()
    flow.goto(BASE + '/admin/enquiries', wait_until='networkidle')
    assert 'Visual QA Guest' in flow.locator('body').inner_text()
    flow.close()

    quick = browser.new_page(viewport={"width": 390, "height": 844})
    quick.goto(BASE + '/contact', wait_until='networkidle')
    quick.get_by_label('Your name').fill('Contact QA Guest')
    quick.get_by_label('Phone number').fill('9876543210')
    quick.get_by_label('Your message or question').fill('Requesting a venue visit.')
    quick.locator('input[type=checkbox]').check()
    quick.get_by_role('button', name='Send Message to Management').click()
    quick.get_by_text('Message Saved').wait_for()
    assert 'Requesting%20a%20venue%20visit.' in quick.get_by_role('link', name='Send by email').get_attribute('href')
    assert 'Requesting%20a%20venue%20visit.' in quick.get_by_role('link', name='Send by WhatsApp').get_attribute('href')
    quick.goto(BASE + '/admin/enquiries', wait_until='networkidle')
    quick.get_by_placeholder('Search by name, phone, or reference...').fill('Contact QA Guest')
    assert 'Date not specified' in quick.locator('body').inner_text()
    assert 'Guests not specified' in quick.locator('body').inner_text()
    quick.close()
    browser.close()

print('Responsive widths, images, mobile menu, lightbox, admin, reduced motion and enquiry submissions: passed')
