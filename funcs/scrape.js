const { launchChrome } = require('./browser')

const sampleScrape = async () => {
    const [newPage, exitChrome] = await launchChrome()

    const [page] = await newPage()
    if (!page) return

    try {
        await page.goto('https://www.amazon.com/', { waitUntil: 'networkidle0' })
    } catch (e) {
        console.error('Could not open the link', e)
        await exitChrome()
        return;
    }
    console.log('Link opened')

    try {
        await page.click('#nav-hamburger-menu')
    } catch (e) {
        console.error('Could not click the element', e)
        await exitChrome()
        return;
    }
    console.log('Element clicked')
    await page.waitFor(10 * 1000)

    const sidebarExtracts = await page.evaluate(() => {
        let sidebarExtracts = []

        const sidebarLinks = document.querySelectorAll('a.hmenu-item')

        sidebarLinks.forEach(link => {
            const dataMenuId = link.getAttribute("data-menu-id")
            const linkText = link.innerText;
            sidebarExtracts.push({ dataMenuId, linkText })
        })

        return sidebarExtracts
    })

    console.log('sidebarExtracts =>', sidebarExtracts)

    await exitChrome()
}

sampleScrape()

//module.exports = sampleScrape