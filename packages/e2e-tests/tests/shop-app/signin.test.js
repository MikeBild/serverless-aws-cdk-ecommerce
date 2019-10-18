const chrome = require('chrome-aws-lambda')
const username = process.env.CDK_E2E_USERNAME
const password = process.env.CDK_E2E_PASSWORD
const baseUrl = process.env.CDK_E2E_SHOP_APP_URL

describe('Shop App', () => {
  describe('Signin Page', () => {
    // jest.setTimeout(200000)
    let browser
    let page

    beforeAll(async () => {
      browser = await chrome.puppeteer.launch({
        args: chrome.args,
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        // timeout: 200000,
        // slowMo: 100,
        // headless: chrome.headless,
        // devtools: true,
      })
      page = await browser.newPage()
      await page.goto(baseUrl, { waitUntil: 'networkidle2' })
    })

    afterAll(async () => {
      await browser.close()
    })

    test('signed out user, should redirect to "/signin"', async () => {
      await expect(page.target().url()).toBe(`${baseUrl}/signin`)
    })

    test('page, should have page title "E-Commerce Shop"', async () => {
      await expect(page.title()).resolves.toBe('E-Commerce Shop')
    })

    test('page, should display button "ANMELDEN"', async () => {
      const loginBtnText = await page.$eval('button', e => e.innerText)
      await expect(loginBtnText).toBe('ANMELDEN')
    })

    test('"ANMELDEN" click without username, should display a error message "Username cannot be empty"', async () => {
      const loginBtn = await page.$('[data-testid="login-button"]')
      await loginBtn.click()
      const errorMessage = await page.$eval('[data-testid="error-message"]', e => e.innerText)
      await expect(errorMessage).toBe('Username cannot be empty')
    })

    test(`"ANMELDEN" click with "${username}", should signin`, async () => {
      const usernameInput = await page.$('#email')
      await usernameInput.type(username)
      const passwordInput = await page.$('#password')
      await passwordInput.type(password)

      const loginBtn = await page.$('[data-testid="login-button"]')
      await Promise.all([loginBtn.click(), browser.waitForTarget(target => target.url() === `${baseUrl}/`)])
    })
  })
})
