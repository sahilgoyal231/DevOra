const puppeteer = require('puppeteer');

async function testVoteUI() {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Set a long timeout for navigation
    page.setDefaultNavigationTimeout(30000);
    
    try {
        console.log("Navigating to login...");
        await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
        
        // Wait for email input
        await page.waitForSelector('input[name="email"]');
        await page.type('input[name="email"]', 'test2@test.com');
        await page.type('input[name="password"]', '12345678');
        
        console.log("Submitting login form...");
        await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle0" }),
            page.click('button[type="submit"]')
        ]);
        console.log("Logged in!");
        
        console.log("Navigating to ask question...");
        await page.goto("http://localhost:3000/questions/ask", { waitUntil: "networkidle0" });
        
        // Fill question form
        await page.waitForSelector('input[name="title"]');
        await page.type('input[name="title"]', 'Test Question Title');
        await page.type('textarea[name="content"]', 'This is a test question content to verify voting.');
        
        // Wait a bit just in case and submit
        await new Promise(r => setTimeout(r, 1000));
        console.log("Submitting question...");
        await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle0" }),
            page.click('button[type="submit"]')
        ]);
        
        console.log("Question created! Testing voting...");
        
        // We are on the question page now. Let's find the vote buttons.
        // The first button in the vote section should be the upvote button.
        // Looking at VoteButtons.tsx: 
        //   It renders a div with flex-col. The upvote is the first button, downvote is the second.
        
        // Let's get the initial vote count from the top of the page.
        // It says "Votes 0"
        let topVoteText = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('span')).find(el => el.textContent.includes('Votes')).textContent;
        });
        console.log("Initial Global Score:", topVoteText);
        
        // Let's get the initial vote buttons score
        let buttonVoteText = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            // In VoteButtons.tsx, it renders: <button> (up), <span>{result}</span>, <button> (down)
            // So the span is between the two buttons.
            return document.querySelector('button + span').textContent;
        });
        console.log("Initial Button Score:", buttonVoteText);
        
        // Click Upvote
        console.log("Clicking Upvote...");
        await page.evaluate(() => document.querySelectorAll('button')[0].click());
        
        // Wait for state to update AND router.refresh() to complete
        await new Promise(r => setTimeout(r, 2000));
        
        topVoteText = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('span')).find(el => el.textContent.includes('Votes')).textContent;
        });
        console.log("After Upvote - Global Score:", topVoteText);
        
        buttonVoteText = await page.evaluate(() => {
            return document.querySelector('button + span').textContent;
        });
        console.log("After Upvote - Button Score:", buttonVoteText);
        
        // Click Upvote again to Revoke
        console.log("Revoking Upvote...");
        await page.evaluate(() => document.querySelectorAll('button')[0].click());
        
        await new Promise(r => setTimeout(r, 2000));
        
        topVoteText = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('span')).find(el => el.textContent.includes('Votes')).textContent;
        });
        console.log("After Revoke - Global Score:", topVoteText);
        
        buttonVoteText = await page.evaluate(() => {
            return document.querySelector('button + span').textContent;
        });
        console.log("After Revoke - Button Score:", buttonVoteText);
        
        console.log("Test successful!");
    } catch(e) {
        console.log("TEST FAILED:", e);
    } finally {
        await browser.close();
    }
}
testVoteUI();
