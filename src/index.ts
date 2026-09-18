import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";
import { joinChannelHuddle } from "./components/huddles/join";
import { getAccount } from "./components/accounts/manager";
import type { ChimeJoinInfo } from "./types";

const channelId = process.env.CHANNEL_ID ?? "C0C2QT85MT4";

const clientBuild = await Bun.build({
    entrypoints: [`${import.meta.dir}/client.ts`],
    target: "browser",
    format: "iife",
});

if (!clientBuild.success || !clientBuild.outputs[0]) {
    throw new AggregateError(clientBuild.logs, "Failed to build the Chime browser client");
}

const clientJavaScript = await clientBuild.outputs[0].text();

const chromeCandidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter((path): path is string => Boolean(path));
const executablePath = chromeCandidates.find(existsSync);

if (!executablePath) {
    throw new Error("Chrome/Edge was not found. Set CHROME_PATH to a Chromium executable.");
}

const account = await getAccount();
const result = await joinChannelHuddle(channelId, account);
const joinInfo = result.call.free_willy;

const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
page.on("console", message => console.log(`[chime] ${message.text()}`));
page.on("pageerror", error => console.error("[chime]", error));

try {
    await page.setRequestInterception(true);
    page.on("request", request => {
        if (request.url() === "http://localhost/") {
            void request.respond({
                contentType: "text/html",
                body: "<!doctype html><html><body></body></html>",
            });
            return;
        }

        if (request.url().startsWith("http://localhost/")) {
            void request.respond({ status: 204 });
            return;
        }

        void request.continue();
    });
    await page.goto("http://localhost/");
    await page.evaluate(() => {
        (globalThis as typeof globalThis & { global: typeof globalThis }).global = globalThis;
    });
    await page.addScriptTag({ content: clientJavaScript });
    await page.evaluate(async (credentials: ChimeJoinInfo) => {
        await globalThis.joinChimeMeeting(credentials);
    }, joinInfo);
} catch (error) {
    await browser.close();
    throw error;
}

console.log(`Joined huddle ${result.call.call_id} as attendee ${joinInfo.attendee.AttendeeId}.`);
console.log("Leave this process running to stay in the huddle. Press Ctrl+C to leave.");

const shutdown = async () => {
    await browser.close();
    process.exit(0);
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
