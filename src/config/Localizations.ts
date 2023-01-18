import { Languages, Locales } from "../engine/Constants/Locales";
import { ENGINE_DEBUG_MODE } from "../engine/Constants/Constants";
import isMobile from "is-mobile";

let _CURRENT_LOCALIZATION_LANGUAGE = Languages.English;

const TAP_CLICK_STR = isMobile() ? "Tap" : "Click";

export enum LOCALIZATION_KEYS {
    "PLACEHOLDER",
    "BIOGRAPHY",
    "WORK HISTORY",
    "SCP: CONTAINMENT BREACH",
    "MODULAR PATHFINDING",
    "MARCH22 ENGINE",
    "RPY-EBOOK",
    "MARCH22-VITA",
    "TSTHREE",
    "GITHUB",
    "TWITTER",
    "LINKEDIN",
    "SCPCB_contents",
    "WORK HISTORY_contents",
    "BIOGRAPHY_contents",
    "MODULAR PATHFINDING_contents",
    "MARCH22 ENGINE_contents",
    "RPY-EBOOK_contents",
    "MARCH22-VITA_contents",
    "TSTHREE_contents",
    "GITHUB_contents",
    "TWITTER_contents",
    "LINKEDIN_contents",
    "PERSONAL",
    "PROJECTS\n1/2",
    "PROJECTS\n2/2",
    "CONTACT",
    "OLD_WEBSITE",
    "OLD_WEBSITE_contents",
}

export const LOCALIZATIONS: { [key in Languages]: { [key in LOCALIZATION_KEYS]: string } } = {
    [Languages.English]: {
        [LOCALIZATION_KEYS.PLACEHOLDER]: "PLACEHOLDER",
        [LOCALIZATION_KEYS["BIOGRAPHY"]]: "BIOGRAPHY",
        [LOCALIZATION_KEYS["OLD_WEBSITE"]]: "OLD WEBSITE",
        [LOCALIZATION_KEYS["OLD_WEBSITE_contents"]]: "Click here to go to the old, less-interesting website.",
        [LOCALIZATION_KEYS["WORK HISTORY"]]: "WORK HISTORY",
        [LOCALIZATION_KEYS["SCP: CONTAINMENT BREACH"]]: "SCP: CONTAINMENT BREACH",
        [LOCALIZATION_KEYS["MODULAR PATHFINDING"]]: "MODULAR PATHFINDING",
        [LOCALIZATION_KEYS["MARCH22 ENGINE"]]: "MARCH22 ENGINE",
        [LOCALIZATION_KEYS["RPY-EBOOK"]]: "RPY-EBOOK",
        [LOCALIZATION_KEYS["MARCH22-VITA"]]: "MARCH22-VITA",
        [LOCALIZATION_KEYS["TSTHREE"]]: "TSTHREE",
        [LOCALIZATION_KEYS["GITHUB"]]: "GITHUB",
        [LOCALIZATION_KEYS["TWITTER"]]: "TWITTER",
        [LOCALIZATION_KEYS["LINKEDIN"]]: "LINKEDIN",
        [LOCALIZATION_KEYS["PERSONAL"]]: "PERSONAL",
        [LOCALIZATION_KEYS["PROJECTS\n1/2"]]: "PROJECTS\n1/2",
        [LOCALIZATION_KEYS["PROJECTS\n2/2"]]: "PROJECTS\n2/2",
        [LOCALIZATION_KEYS["CONTACT"]]: "CONTACT",
        [LOCALIZATION_KEYS["LINKEDIN_contents"]]: `${TAP_CLICK_STR} here to open my LinkedIn profile in another window.`,
        [LOCALIZATION_KEYS["TWITTER_contents"]]: `${TAP_CLICK_STR} here to open my Twitter profile in another window.`,
        [LOCALIZATION_KEYS["GITHUB_contents"]]: `${TAP_CLICK_STR} here to open my Github profile in another window.`,
        [LOCALIZATION_KEYS["TSTHREE_contents"]]: `A custom entity-component game engine for HTML5 games (it powers this website!), designed primarily for ease-of-use when porting Unity projects to HTML5 Instant Games. Utilises three-js for three-dimensions, and PIXIv6 for two-dimensions.\n\n${TAP_CLICK_STR} here to go to the Github page for the project.`,
        [LOCALIZATION_KEYS["MARCH22-VITA_contents"]]: `A port of the March22 engine to the PSVita, using lpp-vita (a Lua engine). Utilizes Ren'Py (python) game script as source, and compiles into Lua via a C++ algorithm, for multi-platform usage.\n\n${TAP_CLICK_STR} here to go to the Github page for the project.`,
        [LOCALIZATION_KEYS["MARCH22 ENGINE_contents"]]: `An open-source engine/framework for adding interactive narrative to games, or making visual novel games. Originally written in C++, the latest version leverages the Unity game engine (C#). Closes the gap between author and programmer by utilising a custom-built, extensible, lightweight scripting language.\n\n${TAP_CLICK_STR} here to go to the Github page for the project.`,
        [LOCALIZATION_KEYS["MODULAR PATHFINDING_contents"]]: `A library of modular, plug-and-play AI algorithms in C++, currently supporting the basic bruteforce algorithms, as well as A* and its variants, in grid-based node maps.\n\nThe example shown is an implementation of said library, using A* Epsilon for agents and Breadth-First for random level generation.\n\n${TAP_CLICK_STR} here to go to the Github page.`,
        [LOCALIZATION_KEYS["BIOGRAPHY_contents"]]: "My name is Sam, and I'm a games/software developer with primary experience in TypeScript/HTML5, as well as experience in a number of other languages (such as C/C++, C#, and Lua). I take great pride in my professional and personal projects; placing a great deal of effort into them all. I can speak Japanese, am learning to play guitar, and of course I play a lot of games!\n\nI graduated from Bournemouth University in 2019 with a first-class w/ honours in Games Programming.\n\nCurrently working for Popcore GmbH in Berlin, Germany as a Principal HTML5 Game Developer, porting mobile Unity games to HTML5 platforms such as Facebook Instant.",
        [LOCALIZATION_KEYS["SCPCB_contents"]]: `SCP: Containment Breach is a free survival horror game based on the SCP Foundation works of fiction, played by thousands of people.\n\nOriginally a modder working on the Box of Horrors mod, it was very well-received, enough to be merged into the main game.\n\n${TAP_CLICK_STR} here to go to the SCP: Containment Breach website.`,
        [LOCALIZATION_KEYS["WORK HISTORY_contents"]]: "Popcore GmbH.\nPrincipal HTML5 Game Developer\nOctober 2021 - Present\nBerlin, Germany\n\nSoftgames GmbH.\nSenior HTML5 Game Developer\nOctober 2020 - September 2021\nBerlin, Germany\n\nSoftgames GmbH.\nTechnical Project Manager\nApril 2019 - October 2020\nTokyo, Japan / Berlin, Germany\n\nSoftgames GmbH.\nHTML5 Game Developer\nJune 2018 - April 2019\nBerlin, Germany\n\nCoolGames B.V.\nGame Developer Intern\nSeptember 2017 - May 2018\nAmsterdam, Netherlands\n\nBournemouth University\nStudent Research Assistant\nJanuary 2017 - March 2017\nBournemouth, England",
        [LOCALIZATION_KEYS["RPY-EBOOK_contents"]]: `A small project, RPY-eBook is an algorithm that parses .rpy game script (Ren’Py visual novel scripts) and output an eBook-friendly file that allows the "game" to be read on tablet or ebook devices, such as a Kindle.\n\n${TAP_CLICK_STR} here to go to the Github page for the project.`,
    },
    [Languages.Japanese]: {
        [LOCALIZATION_KEYS.PLACEHOLDER]: "PLACEHOLDER",
        [LOCALIZATION_KEYS["OLD_WEBSITE"]]: "OLD WEBSITE",
        [LOCALIZATION_KEYS["OLD_WEBSITE_contents"]]: "Click here to go to the old, less-interesting website.",
        [LOCALIZATION_KEYS["BIOGRAPHY"]]: "BIOGRAPHY",
        [LOCALIZATION_KEYS["WORK HISTORY"]]: "WORK HISTORY",
        [LOCALIZATION_KEYS["SCP: CONTAINMENT BREACH"]]: "SCP: CONTAINMENT BREACH",
        [LOCALIZATION_KEYS["MODULAR PATHFINDING"]]: "MODULAR PATHFINDING",
        [LOCALIZATION_KEYS["MARCH22 ENGINE"]]: "MARCH22 ENGINE",
        [LOCALIZATION_KEYS["RPY-EBOOK"]]: "RPY-EBOOK",
        [LOCALIZATION_KEYS["MARCH22-VITA"]]: "MARCH22-VITA",
        [LOCALIZATION_KEYS["TSTHREE"]]: "TSTHREE",
        [LOCALIZATION_KEYS["GITHUB"]]: "GITHUB",
        [LOCALIZATION_KEYS["TWITTER"]]: "TWITTER",
        [LOCALIZATION_KEYS["LINKEDIN"]]: "LINKEDIN",
        [LOCALIZATION_KEYS["PERSONAL"]]: "パーソナル",
        [LOCALIZATION_KEYS["PROJECTS\n1/2"]]: "プロジェクト\n1/2",
        [LOCALIZATION_KEYS["PROJECTS\n2/2"]]: "プロジェクト\n2/2",
        [LOCALIZATION_KEYS["CONTACT"]]: "お問い合わせ",
        [LOCALIZATION_KEYS["LINKEDIN_contents"]]: "",
        [LOCALIZATION_KEYS["TWITTER_contents"]]: "",
        [LOCALIZATION_KEYS["SCPCB_contents"]]: "",
        [LOCALIZATION_KEYS["WORK HISTORY_contents"]]: "",
        [LOCALIZATION_KEYS["BIOGRAPHY_contents"]]: "",
        [LOCALIZATION_KEYS["TSTHREE_contents"]]: "",
        [LOCALIZATION_KEYS["MODULAR PATHFINDING_contents"]]: "",
        [LOCALIZATION_KEYS["MARCH22 ENGINE_contents"]]: "",
        [LOCALIZATION_KEYS["RPY-EBOOK_contents"]]: "",
        [LOCALIZATION_KEYS["MARCH22-VITA_contents"]]: "",
        [LOCALIZATION_KEYS["GITHUB_contents"]]: "",
    },
};

export function setLanguageFromLocale(_localeStr: string): void {
    const localeStr = _localeStr.toLowerCase();
    const languageKeys = Object.keys(Locales);
    for (let i = 0; i < languageKeys.length; i++) {
        const languageKey: Languages = languageKeys[i] as unknown as Languages;
        for (let v = 0; v < Locales[languageKey].length; v++) {
            const key = Locales[languageKey][v];
            if (key.toLowerCase() === localeStr) {
                _CURRENT_LOCALIZATION_LANGUAGE = parseInt(languageKeys[i]) as unknown as Languages;
                if (ENGINE_DEBUG_MODE) {
                    console.log("Setting locale to " + _localeStr);
                }
                return;
            }
        }
    }
    console.warn("Failed to set locale to " + _localeStr);
}

export function getCurrentLanguage(): Languages {
    return _CURRENT_LOCALIZATION_LANGUAGE;
}

export function getLText(key: LOCALIZATION_KEYS): string {
    return LOCALIZATIONS[_CURRENT_LOCALIZATION_LANGUAGE][key];
}
