import puppeteer from 'puppeteer';
import fs from 'fs';
import { Socket } from 'socket.io';

export type FormValues = {
    job_title: string;
    location: string;
    industry: string;
    number_of_pages: number
};
export async function scrappLinkedinLead(socket: Socket, data: FormValues) {
    const pageNumber = data.number_of_pages || 1;


    const browser = await puppeteer.launch({
        headless: false,
    });

    const COOKIE_PATH = './cookies.json';

    const page = await browser.newPage();

    await page.setViewport({ width: 1500, height: 1024 })

    for (let i = 1; i <= pageNumber; i++) {

        const queryParams = new URLSearchParams({
            keywords: data.job_title,
            origin: "SWITCH_SEARCH_VERTICAL",
            page: String(i)
        })

        // Load cookies if they exist
        if (fs.existsSync(COOKIE_PATH)) {
            const cookies = JSON.parse(fs.readFileSync(COOKIE_PATH, 'utf-8'));
            await browser.setCookie(...cookies);
            console.log('Cookies loaded, session restored.');
        }


        // Wait for manual login if cookies are not present
        if (!fs.existsSync(COOKIE_PATH)) {

            console.log('Please log in manually...');
            await page.waitForSelector("input")
            await page.type("#username", "nimahin25@gmail.com")
            await page.type("#password", "hg$$%hkmhhi##@355")
            await page.locator("button[type=submit]").click()

            const profileImgSelector = 'img[src*="profile-displayphoto"]';
            await page.waitForSelector(profileImgSelector, { timeout: 0 });

            const cookies = await browser.cookies();
            fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
            console.log('Cookies saved for future runs.');
        }
        console.log("Logged in success")
        try {

            const response = await page.goto(`https://www.linkedin.com/search/results/people/?${queryParams}`);

            if (!response) {
                socket.emit("linkedin_search_page_not_found")
                break;
            }

            socket.emit("extracting_page", {
                currentPage: i,
                totalPages: pageNumber
            })


            const results = await page.evaluate(async () => {
                await new Promise((r) => setTimeout(r, 1000))
                // Select the main container
                const mainDiv = document.querySelector('div[role="main"][data-sdui-screen="com.linkedin.sdui.flagshipnav.search.SearchResultsPeople"]');
                if (!mainDiv) return [];

                // Select all list items inside role="list"
                const items = Array.from(mainDiv.querySelectorAll('div[role="list"] > div'));

                return items.map(item => {
                    const profileLinkEl = item.querySelector('a[href*="/in/"]') as HTMLAnchorElement; // stable profile link
                    const nameEl = item.querySelector('p > a[data-view-name="search-result-lockup-title"]');
                    const imgEl = item.querySelector('figure img') as HTMLImageElement;

                    // find description and location 
                    const infoDivs = Array.from(item.querySelectorAll('div > p'));
                    let description = null;
                    let location = null;

                    if (infoDivs.length >= 2) {
                        description = infoDivs[1]?.textContent?.trim() || null;
                        location = infoDivs[2]?.textContent?.trim() || null;
                    }

                    return {
                        name: nameEl?.textContent?.trim() || null,
                        profileUrl: profileLinkEl?.href || null,
                        imageUrl: imgEl?.src || null,
                        description,
                        location
                    };
                }).filter(item => !Object.values(item).every(v => v === null || v === undefined));
            });



            console.log("The alter results are: ", results)
            socket.emit("size_of_result", results.length)


            for (const user of results) {

                const split_two_slash = user.profileUrl?.split("//").pop();
                const split_one_slash = split_two_slash?.split("/");
                const get_user_id = split_one_slash?.[split_one_slash.length - 2];

                if (user.profileUrl !== null) {
                    let response

                    try {
                        response = await page.goto(`https://www.linkedin.com/in/${get_user_id}/overlay/contact-info/`)


                        await page.waitForSelector('a')
                        // get the first link's href
                        const link = await page.$eval('a', el => el.href)
                        console.log("Link: ", link)

                        // get all links and filter 
                        const links = await page.$$eval('.pv-profile-section__section-info a', elements =>
                            elements.map(el => {
                                const href = el.href;
                                let link_type = 'other';

                                if (href.includes('linkedin.com')) {
                                    link_type = 'linkedin';
                                } else if (href.includes('twitter.com') || href.includes('x.com')) {
                                    link_type = 'twitter';
                                } else if (href.includes('github.com')) {
                                    link_type = 'github';
                                } else if (href.includes('instagram.com')) {
                                    link_type = 'instagram';
                                } else if (href.includes('facebook.com')) {
                                    link_type = 'facebook';
                                } else if (href.startsWith('mailto:')) {
                                    link_type = 'email';
                                } else if (href.startsWith('tel:')) {
                                    link_type = 'phone';
                                } else if (href.match(/^https?:\/\//)) {
                                    link_type = 'website';
                                }

                                return {
                                    href: href,
                                    text: el.textContent?.trim(),
                                    link_type: link_type
                                };
                            })
                        )
                        console.log("All links: ", links)
                        socket.emit("lead", {
                            name: user.name,
                            image: user.imageUrl,
                            profile_url: user.profileUrl,
                            description: user.description,
                            location: user.location,
                            contact: links
                        })
                        await new Promise((r) => setTimeout(r, 1000))
                    } catch (error) {
                        console.log("Error")

                        if (response?.status() === undefined && response?.status() !== 404) {
                            socket.emit("ln_scrap_connection_lost")
                            return
                        }

                        socket.emit("scrape_error")

                    }


                }
            }
        } catch (error) {
            socket.emit("linkedin_search_page_not_found")
            break;
        }

    }

    await browser.close()
    socket.emit("done")
    return

}