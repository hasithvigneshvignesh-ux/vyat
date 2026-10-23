const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = path.resolve('C:\\Users\\V.V.Hasith Reddy\\.gemini\\antigravity-ide\\brain\\93613756-a5e2-449d-9413-20ef59e54de3');

async function run() {
  console.log('Launching Edge from:', EDGE_PATH);
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  console.log('1. Verifying Public Access & Navigation Entry Points (Logged Out)...');

  // A. Check Homepage hero button
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  console.log('Opened homepage:', page.url());

  // Click Hero "Browse All CSE Courses"
  await page.click('#hero-cta-explore');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('After Hero button click, URL:', page.url());
  if (!page.url().includes('/courses') || page.url().includes('/login')) {
    throw new Error('Hero button redirected to: ' + page.url());
  }

  // B. Check Navbar Explore button
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.click('#nav-explore-btn');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('After Navbar Explore button click, URL:', page.url());
  if (!page.url().includes('/courses') || page.url().includes('/login')) {
    throw new Error('Navbar Explore button redirected to: ' + page.url());
  }

  // C. Check Navbar "Courses" Link
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent && a.textContent.trim() === 'Courses');
    if (link) link.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('After Navbar Courses link click, URL:', page.url());
  if (!page.url().includes('/courses') || page.url().includes('/login')) {
    throw new Error('Navbar Courses link redirected to: ' + page.url());
  }

  console.log('2. Testing Desktop Viewport (1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/courses', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'catalog_1440_all.png'), fullPage: false });
  console.log('Saved: catalog_1440_all.png');

  // Click Machine Learning Branch Tab
  await page.click('#tab-machine-learning');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'catalog_1440_machine_learning.png'), fullPage: false });
  console.log('Saved: catalog_1440_machine_learning.png');

  // Click "View syllabus" on the first skill
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const syllabusBtn = buttons.find(b => b.textContent && b.textContent.includes('View syllabus'));
    if (syllabusBtn) syllabusBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'catalog_1440_syllabus_drawer.png'), fullPage: false });
  console.log('Saved: catalog_1440_syllabus_drawer.png');

  // Close syllabus drawer via Escape key
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // Trigger search empty state
  await page.type('#courses-search-input', 'nonexistentxyz_term');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'catalog_1440_empty_state.png'), fullPage: false });
  console.log('Saved: catalog_1440_empty_state.png');

  // Clear search
  await page.evaluate(() => {
    const clearBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Clear search'));
    if (clearBtn) clearBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Test "Start learning" redirects to /login?next=...
  console.log('Testing "Start learning" button redirect...');
  await page.evaluate(() => {
    const startLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent && a.textContent.includes('Start learning'));
    if (startLink) startLink.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Start learning navigated to:', page.url());
  if (!page.url().includes('/login') || !page.url().includes('next=')) {
    throw new Error('Start learning button did not redirect to /login?next=, got: ' + page.url());
  }

  console.log('3. Testing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/courses', { waitUntil: 'networkidle0' });

  // Verify horizontal overflow (must be 0)
  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth - document.documentElement.clientWidth;
  });
  console.log('Mobile horizontal overflow px:', mobileOverflow);
  if (mobileOverflow > 1) {
    throw new Error('Detected horizontal overflow on mobile: ' + mobileOverflow + 'px');
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'catalog_390_all.png'), fullPage: false });
  console.log('Saved: catalog_390_all.png');

  // Click Data Science branch tab on mobile
  await page.click('#tab-data-science');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'catalog_390_data_science.png'), fullPage: false });
  console.log('Saved: catalog_390_data_science.png');

  // Open mobile syllabus bottom sheet
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const syllabusBtn = buttons.find(b => b.textContent && b.textContent.includes('View syllabus'));
    if (syllabusBtn) syllabusBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'catalog_390_syllabus_sheet.png'), fullPage: false });
  console.log('Saved: catalog_390_syllabus_sheet.png');

  // Close sheet
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // Search empty state on mobile
  await page.type('#courses-search-input', 'nonexistentquery');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'catalog_390_empty_state.png'), fullPage: false });
  console.log('Saved: catalog_390_empty_state.png');

  console.log('4. Testing responsive viewports for 0px horizontal scroll (360, 390, 768, 1024, 1440, 1920)...');
  const viewports = [360, 390, 768, 1024, 1440, 1920];
  for (const w of viewports) {
    await page.setViewport({ width: w, height: 800 });
    await page.goto('http://localhost:3000/courses', { waitUntil: 'networkidle0' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`Viewport ${w}px: overflow = ${overflow}px`);
    if (overflow > 1) {
      throw new Error(`Horizontal overflow at ${w}px: ${overflow}px`);
    }
  }

  await browser.close();
  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
