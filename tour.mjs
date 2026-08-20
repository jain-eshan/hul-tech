import { chromium } from "playwright-core";
const B="http://localhost:3260", S="/tmp/claude-0/-home-user-hul-tech/b918760a-5c9b-5c38-b247-bc00887ecdcc/scratchpad";
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium",args:["--no-proxy-server"]});
const p=await b.newPage({viewport:{width:1440,height:900}});
const errs=[]; p.on("pageerror",e=>errs.push(e.message));
await p.goto(`${B}/`,{waitUntil:"load"}); await p.waitForTimeout(800);
await p.click("button:has-text('Guided walkthrough')");
await p.waitForTimeout(900);

const shots = [1, 3, 4, 7, 10];
for (let step = 1; step <= 17; step++) {
  const counter = await p.locator("text=/^\\d+ \\/ 17$/").innerText().catch(()=>"?");
  const title = await p.locator("h2").first().innerText().catch(()=>"(no card)");
  const url = new URL(p.url()).pathname;
  console.log(`${counter.padEnd(8)} ${url.padEnd(16)} ${title.slice(0,62)}`);
  if (shots.includes(step)) await p.screenshot({path:`${S}/tour-${step}.png`});
  if (step < 17) {
    // Wait for the Next button to come out of its busy state.
    await p.waitForFunction(() => {
      const b = [...document.querySelectorAll("button")].find(x => /Next|Finish/.test(x.textContent||""));
      return b && !b.disabled;
    }, { timeout: 20000 }).catch(()=>{});
    await p.click("button:has-text('Next')").catch(()=>{});
    await p.waitForTimeout(600);
  }
}
console.log("\npage errors:", errs.length ? errs.slice(0,3).join(" | ") : "none");
await b.close();
