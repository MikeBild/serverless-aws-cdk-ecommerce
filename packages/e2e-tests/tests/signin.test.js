const chrome = require('chrome-aws-lambda')

describe('SignIn User - Standardansicht', () => {
  jest.setTimeout(200000)
  let browser
  let page

  beforeAll(async () => {
    browser = await chrome.puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
      slowMo: 100,
      devtools: true,
      timeout: 200000,
    })
    page = await browser.newPage()
    await page.goto(process.env.CDK_E2E_BASE_URL, { waitUntil: 'networkidle2' })
  })

  afterAll(async () => {
    await browser.close()
  })

  test('should includes Title with "E-Commerce Sales"', async () => {
    await expect(page.title()).resolves.toBe('E-Commerce Sales')
  })

  test('should includes Button with "ANMELDEN"', async () => {
    const loginBtnText = await page.$eval('button', e => e.innerText)
    await expect(loginBtnText).toBe('ANMELDEN')
  })
})
