import { Engine, HelperFunctions, IVector2, State } from "../../tsthree";
import {
    BaseTexture,
    Container,
    Graphics,
    InteractionEvent as PIXIInteractionEvent,
    Rectangle,
    Sprite,
    Spritesheet,
    Text,
    TextStyle,
    Texture
} from "pixi.js";
import { tsthreeConfig } from "../../config/tsthreeConfig";
import { BloomFilter, BulgePinchFilter, CRTFilter, OldFilmFilter } from "pixi-filters";
import { BootAssets, LoaderType } from "../../config/BootAssets";
import isMobile from "is-mobile";
import { getCurrentLanguage, getLText, LOCALIZATION_KEYS, setLanguageFromLocale } from "../../config/Localizations";
import { Languages } from "../../engine/Constants/Locales";

const COL_DARK_GREEN = "#0a1f0a";
const COL_LIGHT_GREEN = "#00ff00";

const SCROLL_BAR_WIDTH: number = isMobile() ? 5 : 20;
const WORD_WRAP_WIDTH: number = tsthreeConfig.width * 0.6 - 30 - SCROLL_BAR_WIDTH;
const FOLDER_TEXT_BOX_WIDTH: number = tsthreeConfig.width * 0.6;

const isPortrait = tsthreeConfig.height > tsthreeConfig.width;

const CACHED_TEXTBOX_IMAGE_TEXTURES: Record<string, Texture> = {};

type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};
const STRING_TO_ICON: PartialRecord<LOCALIZATION_KEYS, string> = {
    [LOCALIZATION_KEYS["PERSONAL"]]: "Docs_2",
    [LOCALIZATION_KEYS["PROJECTS\n1/2"]]: "CPU",
    [LOCALIZATION_KEYS["PROJECTS\n2/2"]]: "Laptop",
    [LOCALIZATION_KEYS["CONTACT"]]: "Docs",
};

const BOX_NAMES = [
    LOCALIZATION_KEYS["PERSONAL"],
    LOCALIZATION_KEYS["PROJECTS\n1/2"],
    LOCALIZATION_KEYS["PROJECTS\n2/2"],
    LOCALIZATION_KEYS["CONTACT"],
];

const _BOX_FONT_STYLE = new TextStyle({
    fontFamily: "Sevastopol",
    fill: "#fafafa",
    align: isPortrait ? "center" : "left",
    fontSize: 54,
});

const _FOLDER_FONT_STYLE = new TextStyle({
    fontFamily: "Sevastopol",
    fill: "#fafafa",
    align: isPortrait ? "center" : "left",
    fontSize: 62,
});

const FOLDER_SCROLL_ANIMS = [
    {
        progress: 0,
    },
    {
        progress: 0,
    },
    {
        progress: 0,
    },
];

const ALIEN_CONFIG: Array<{title: LOCALIZATION_KEYS, contents: LOCALIZATION_KEYS, url?: string, images?: [string, string, string]}>[] = [
    [
        {
            title: LOCALIZATION_KEYS.BIOGRAPHY,
            contents: LOCALIZATION_KEYS["BIOGRAPHY_contents"],
        },
        {
            title: LOCALIZATION_KEYS["WORK HISTORY"],
            contents: LOCALIZATION_KEYS["WORK HISTORY_contents"]
        },
        {
            title: LOCALIZATION_KEYS["OLD_WEBSITE"],
            contents: LOCALIZATION_KEYS["OLD_WEBSITE_contents"],
            images: [
                "assets/sprites/oldsite.PNG",
                null,
                null,
            ],
            url: "https://slynch.dev/legacy"
        },
    ],
    [
        {
            title: LOCALIZATION_KEYS["SCP: CONTAINMENT BREACH"],
            contents: LOCALIZATION_KEYS["SCPCB_contents"],
            images: [
                "assets/sprites/scpcb.png",
                null,
                null,
            ],
            url: "https://www.scpcbgame.com/"
        },
        {
            title: LOCALIZATION_KEYS["MODULAR PATHFINDING"],
            contents: LOCALIZATION_KEYS["MODULAR PATHFINDING_contents"],
            images: [
                "assets/sprites/pathfind.png",
                null,
                null,
            ],
            url: "https://github.com/Slynchy/ModularPathFinding"
        },
        {
            title: LOCALIZATION_KEYS["MARCH22 ENGINE"],
            contents: LOCALIZATION_KEYS["MARCH22 ENGINE_contents"],
            images: [
                "assets/sprites/march22.jpg",
                null,
                null,
            ],
            url: "https://github.com/Slynchy/March22-Unity"
        },
    ],
    [
        {
            title: LOCALIZATION_KEYS["RPY-EBOOK"],
            contents: LOCALIZATION_KEYS["RPY-EBOOK_contents"],
            images: [
                "assets/sprites/rpyebook.jpg",
                null,
                null,
            ],
            url: "http://slynch.ovh/Blog/index.php/2016/06/01/rpy-ebook/"
        },
        {
            title: LOCALIZATION_KEYS["MARCH22-VITA"],
            contents: LOCALIZATION_KEYS["MARCH22-VITA_contents"],
            images: [
                "assets/sprites/march22lua.jpg",
                null,
                null,
            ],
            url: "https://github.com/Slynchy/March22-Lua"
        },
        {
            title: LOCALIZATION_KEYS["TSTHREE"],
            contents: LOCALIZATION_KEYS["TSTHREE_contents"],
            images: [
                "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
                null,
                null
            ],
            url: "https://github.com/Slynchy/tsthree"
        },
    ],
    [
        {
            title: LOCALIZATION_KEYS["GITHUB"],
            contents: LOCALIZATION_KEYS["GITHUB_contents"],
            url: "https://github.com/Slynchy",
            images: [
                "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
                null,
                null
            ],
        },
        {
            title: LOCALIZATION_KEYS["TWITTER"],
            contents: LOCALIZATION_KEYS["TWITTER_contents"],
            url: "https://twitter.com/Slynch2203",
            images: [
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAoAAANTCAMAAAAQXA+vAAAAM1BMVEUAAAD///////////////////////////////////////////////////////////////+3leKCAAAAEHRSTlMAEPCAQMDQMGCg4CCQsFBwobJ5sAAAH+BJREFUeNrs3Q1y4yAMhmHAGAP+0/1Pu81mO4nbpE1nmyDgfU7g6Uxl6UM4BgAAAAAAAAAAAACARljv4zAM44l8NJ4MwxC9twZAg7w//f87eZw7VYXNGwAtmP2QPpeAH5WENGyTAVAp6/c0ym8JaWBqAGrj95Tl9+V1Z2IA6mC3ZZRnCstGewCoZrclyCvkRDkAlPJDkFcKC8MCoIyNq5MC1jgbADrMe5BywsBJI1DetAQpLS9UA6Ckec+iA9UAKMXu5fuBa2EnNwBebltFnzUaAK8zL050colBAXiROIpmITa1feR3Ayg0D1obggu3NJMa2CQMPVDIJ6nD2sYm4qnuNtXjoA3KJ4OjXP/bdMsishpAl6hlh+BReaj6hTqN8ob5ALrYCiKCz1y9xcAmOWE+gCp1FoKKi8G/PzjzAVSptxDUWgyik3ebAXSouxDUWAy2fPXsBtAh1l4IaisGfpQryQAaVHdqcI+rJIifRjlgjRoa+Jr2CL6TK1g6mpMcBQMUN2u8e/g/RuWv2DnJR9w/QHH1p4U3LIojg2MhYKkASmythARHTutr9lIICA2hyNxSSHAUNEYGc5KbND4rejJIy9RNCfcKgWQDFOTbnA0unKoNvtuFgJtIKM0u0r5VzadNfJK7nLb2BT1pNC5UGh9+vbixGKAQ29oqwX1j+cYgjvKl8k+IXvkGVwm0riLbmOWCk0Qo0kVKcG21ppTjx2IVnSTu5BOY+kgJNBwlTEm+N5oCrOPWQ/fa3iXQlMxtozyiSJlKzCW9s+2uF34tTOal7J7lSNN60cQVqN51lRcWTA8/Twa61otGvqHWuT6Hg3fJmteIQd4obgq8/OWUX+bGAcNBZUPC+RdndTcFQc4yxwhdmvodDl5wknDYJlLeFEQ+ntS1KBAZzBNN54ZAfVOQWW/qWS0/h3pbBetG9pwQVNUUcIzQHxsEzwwMtiQntTUFXJDuTYcLhvc5b37ZtGR5U2NTwDFCXzYCw+e9COc96HiQR2U5clyM7MYueNJdQPuzEwMNP34Q5aPAkWInCAyfFB7a+Ie9e1tqHYahMKycHedQvf/TbmYYoLS0NG3YXnb+7wG46ixiWZIXv0dzJDGKDERhE5aU/JW++uMcUB1JDGxMOCiuDm7ohwQ5IPBMYrzRboHCTSTBLfXwfA5oFSy2CEoFTDyAXuNrElmw9b5Abc1xJ1W3wC0kwf8VbJt2jpm0QN/S+hfaC46DJNgxC6ow1v6jjLqLbFH7SsEdzB/dkSgL2qb3x+muMZv8C+0Fh0ES7JMFU1hqv5LlRaLNThYcD0mwQxZUYYy+C4lm36oWvNPABZIglWA/q9a59+8yrxlakLzfxDckQTrBrkzhOgbyrxlaFI0onCEJEgp2bjg9cijIcPjAWtVZSXwiCdIKn2eCpqv9pqzfZ3kzys5N44+0js1Z0J6W6L/Ius/QKuUvFnygsyit3n+VeUvB5doK2g7LRxKIWyyN6GTBoZAE4lI1+A7uZMGRsJ9A3WppjH6OtsPSkQTqZkukdrLgSNheJi5WlkZwJwsOhI2m6lpLZHGy4EDYcq6usUSqLBazgybDg+jtQQK/DUaT8sU1orp6slS6TNawYgcVSaButVSmbFYy43VcI6qbbZP0VSSyIEtcHqjrbaP0l8xkQYa4PFBXT5ZMldWzLXjF4BC32kYSd0tkQWYoGcprbBOJ8wFZkJ/OoW2xlLJ72hFPahza0vbxrvk98woWmBUp8QaAOcMnn0GhoEStJRVzfP4dFArKEyypyZ0sOAIKBepGe4JWz8lokEdHgbrFniBylUgW5KOKDmnpl4DUJXza4DezQ1pMngRtGccc3Lc6pAksEm8KKXmAe8SMCSSBdeUcdcCC41ytll5JZQ9wPMiTwrPEbVElUHA8yJFCEtiprOsQcHuQH4kk2PkQ2QsUP8AUUl5mk1CXVwjFBZqLpI22p/DCAAJZUDhmD6SNtp+qibNOabluDUomh7DRdjOM7rFSKihpFEHAaHIGRttL6PzNoPU7IQuE0FKgrLF9TE39/vcUGoxklraCgcRcBNvFuvi7Xm+GnYEEFdQMhYV9PgiifxgEvx5Hmo0kUDMUFvb5IPhykvyfQeOhBMaQZNWrvWqao5/pRKvLZIEA+gxlvdyAU4Xu8q1F1T40mo3S4yJRVRzsJetY+4VVZEKZLBAUHJpe+2Ye5uhXRunvRxoMnsLwQen+sXc3yInDMBiGbcdxID+g+592p4Uy3S0hdpaCLL/PDTrT+ZAl2Vm82206J7lj9Lp/Nc4OBSgK2nD8jwZBkvsG7UNnFgz24MES0w67c2CRNZ3+UVPPIKEI20XWhbg7B9b1NTSYGSpmoyhoQBp29Qd6eSR4PU+cMkhQh6JAox0Nw+Gcfv0DzF5eIjBIyEFR0IDOFYrzKJu6enbRGCRkoCgwL8TS9kCQDH1NV9kZJGyjKLAuTS7f0CXJE3xVPxw0D7dQFFg3u1zTpRzIFCv7dxlpHmZQ+5I1XnUR0Z/mUUp01V1WCRq+CtcMFg2V6ae8GEhSqK/x3hrNw4e4fWBYlxcD5YKvsoikebiKosCycdjqDcxJ9hm0fUSZ5qEuvFOgyezdunhexvdX2pKJzcPK8HiRImN0K4bD3Ouos6Pke/utLBQ4CrSY/VoKKKqyo5Qw9tlYy3jmWI0x3jkRzL08RZgqLyO5tnwX60UG/V0SDKeuH+V5onuWsxRg26gerBfpkKK78PHQ9Uk+6BzOd1KAhkE1mCSqELpLBiy9fKNzNN9JLtV/BpgkarTcqwOUDuY7eZ80OXyhaYhSwZsZOYXo8CtmgX2DpUKSL6/f0DREmYOtM+XCVPGCpiHKzM5WFDBV/MK3k1Hi6KxFAfeWP9E0RJHkDUYBh4Sr6vfGsEHr8EBNFHBIeLIksO3zdq/FKOCQ8FSDwLiTuzL46BWHBJYKsG+MWO3LJRwSfrIZ7/hG8xhRWRRwSOB8gJIxouEo4BEDzgfYltyF5SjgTgLnA5QtFNhdVuelM84HyF4osDhMvEl0DzkfIGuhwHgUSKB7yH4RcpLAehSwYsD9A2StFtmPAj6yyv0DZKwWNRAFIjOFAfeTsZEETUQBu4c2psOQesZrSqOAp852OgmMOrp/tVJPMlZklIjNJLDx+DmFwRWrhnh7EqiOAun5UAKjRHxY3E8tRQH7Rjx1jNWLB01FAYVBTV+4wU2FSeCiKEdhQKugdStJ0FoUUBjQKmjcWhK0FwUSGCXQKmhX8u4lvNSAHQNaBa3aSoLmFlUpDGgVNCkjCYw+Y7Rq5LEzIyUedCaB3ksIXFfkAkLzHidBs1HAOwa1L4lAcxLUdX9lYa5oJNahLgkq+yVh4chC3wcak6C6UXSifciCURP+sHe2Oa0DUQzNS5U+EhEx+18toP6pBBEBKuGPc7bQypNr+86cU4KyjhH2Ia5hHeuJv3n9UTI/TWA/68FD7ico7BixloBrWMR5Jah/QuPClEDXMJezSsBZ8sZGyYCuYSrnczImzHcWdpTMDWB4yHsHPKdDlhDzQ4KCElgfJmQJCZ93cM/8reIMIyaNoxjTB373VjJ1VfYSCBAC+e4lPZwm98wEi7YFEXhA2bh0NxHL4Ij/A9zZf6IExQtJWAZx9i/8qFjEf4guMgFCIgIL+CODtdsyQArMUZhyPbcQ8A+z3N9yZonubM7t+ZuCsp4FKQCREDGysdq7pWReD+nmKvI9mxVDLaVhwgBb/jw6SP0XVa4sGt5GBTrRQeyYufYlixmRcCNSz3sE5lB1YoAUmLJJfcNGXpVbVjNI8n6bWLT+pt57ytQMQr/sGniexEgpGRWLAVJgiOAenf9yYr0Y7APc0LIJgs2CLjGIS4HyEbMJks2CKjFACtyQswmizYIiMUAKvJBqE1SZTvE9A1YQrBBZP+osqISLwQAjlEsvDYfKKqvESEEXQksHrVlU8NbiABcUM8Swu07PsOiVOpCCLnbh4aBrxzX0pqMBHkgPBwVxYny2GN0MCUI3OSiKE++Z4+KEgggoAeXkIPRWs6/ZsxxEpMABk9m07vXNq8kPgxTEYHL8xG4nHrPlmAZIgQMmUtA2IWTVjpACB0ykoG9CSGoaIAUOuEhB4YRwY7v45wlIgQMup07nhHBjddFrpMCZy2RC6YRwY3uxthCRAgdspKCqZfSR2dlCbP6k88FGCnr2EI6rBrafBgP0sZGCpj2EI2ZX12CAPj5S0LKpnOgaDNDHRwr+NdxldIZd9Q5KpMAaHymY1gE3tmezrsEAfUTvOyeSivIQB+izTD5UVwusBwUsXwOcpICnuV3LBjyJYoCTFHAvlqttgBQY4CQFGIefcn2RVwOkwAArKaDAamoilrfGPbCSAk6XY3ZlNUAKDPCSAhqHnmqAFBjwyt6d5SgOQ1EATWEnKaAC2f9qW11SD2r1BzO+8TlrQBfnDXZWFOgnZqbBaaV5YVHg7yWyimg6LEBYFFhEuCwNGps3UO8NEBYF/d5xePW8QVP7zCvNS4sCN5hcbLc/NVM4WGleWhQYM7rK2EjhwBJC++KiwLHg6k+FBtaWDIS0Ly4KHAtusNxwOFDi6UxeFDgW3Hg4uKFyoAnckbwocCy42VjqcDkzRn0JjALHgjvslitmDswY9SQwChwL8uLAVRPtS4wCx4L7HS6IA4MFXUmMAseCvNOBbmLzIqPAsSCulCi9mxcZBdrUjzV9fR6H/9FN7EjQOwgWFJ9pt5T67+CBFkJPgl5H8ifzdNP+XIfffNN1JTQKPlxn9EdEHqw0LjQK3HL4ZNP++3tBC6EfqVHgp/UCh7GcZpXeTsRGgTrUq0xLqUev3G1ebBToVL/WuJTTLLo3LDcKNBTf4DCWcz2qG25RbhQ4cr7PNJZSZ3eabUpwFPhxvdtuXMq5zuqGm9DUFdlu1w81jl/ls1bt32TJUeCPpjmHn6FQap0Fd5zoKDBz2LLxOxbO9VcwKPO2LToKXJkXZBIFbcuOgmFZAVFguAAepJlX9XwiwDsN6XwigCjwiQCiwJ4LiAKDRvBI05Dvwy4C9Hn3uZFWEAXWlWEVBTqK8Az7YRPsJUG/N5coF4AoUC4AUaBcAA92GrbCdAH0u6P8t9kyAogC+8pwj3nYEC+tQ8fbSN5OA1GgdAiiwD0mYAVBGwFEgTYCiILB03ywmjt2vxmIAi1FeIbzsEWyADqeOzZeAD/YuxfcBmEgCMMDtgvhufc/bRWqqk3iRHmAhNn/O8Qq2RkvjAJmAfCJXsfELAA8lw2ZBQCjgFkA0DBiFgCHHQVpqPSBhlkAHOIrCMnqUPG7AMhyVDZMZta1zALgmsNRcB4GzALglqOGUbIfXcssAP5zOgrOw4BZAGyo0p4l+9O9u0CseJsEFN4wSvZfHXreKQKb6LRrya6cGj6PAPxy0zDSyW6kiRtnwMJPw0jBMt5aGkTuIAPF1goULO8U9aqmMwD3tNq1YPd0oSdUBJzUChTsgdRWhIqAixtGwR6qT5NeMRuAAmsFirZYbRpMLA+BAmsFyyhYdRr0LAyA8moFivakse1ZGABHrRWosed9DZGFAXDIWoFkL6nHuaFhALxu0s7ZYuVxUI0GoKBagVTbW1KYKj0wkyQABWWJUrK3dWOIPbeQgSfU2rtkn6nTMMdKGYMBKCRLXO3oSBpDGxtdiGwPgUKyRCnYmuqUhhCmGHsqBkBJWaJm205KLA+BMrJERQOQ4ytLVGMAslxliZIByPPzLvGMv/NAjrMsUUoGYGOD9o/AD9jcrP3jYyZAjrMAQZoMQI6bT6dSLADu8/UYiTQRuMdZgCDxaAjI8BYgkCYCWd4CBCIEIMddgECEAGT4CxB4kATc8hggECEAOe4CBPaGQIa/AIF7pMDGWpWhNQCXHAYI7A2BHF8njLheAmzuS6VgbwhsaFQp6BsCV3x9A4F3ykCey60hJSPghr/a8YKvHgNXfB0+p2QEfLN3L8kJAzEQQIdU5UMoKrr/aTMYCHbspb2w+71TzEgtaUFq1dBwIkyFVg1bOxUwFnU5VbEAanuXtiOSBfASuaxAsgD+i60aGkOAkdyqYXct4Ck0a2hnAUyFZg1vLgU8pGYNtRNhJLpqqJ0II3GHkWw1g7nkqqErqvASudfQdCLM5F1D8UOABXnXUPwQYC51LNEPASZSxxL9EGAkOmDkhwBP0QEjPwT4kxwwMocAW/hsu2QOASo8YGRSGW7iA0YWH8MgeYPRy7mA5Fkk205hoFQgWgBVSgUPPwUkzyIpHMJd+CySwiHc5S47VjiETXy0PZM4BKUCiUNQKnA9EZQKHESAKqUC/UTolAr0E6EzgGCDCXQGEDwLoDOA4FkAnV0FU+8FZK41lD6GVb21I/AsgMgLCJ4FsLKvdgieBZB3LNGzAAbxxxJlC6CTOpYtgIEBZc8CqDKgvOBibwEkp47tLYDUY+rLTp4FkJw6tuUQtBItP4YVnNuhyBlBeivx7lpA5AIjDUUwlaihCFqJy74L+GXvDnIQBGIogA6imYUIvf9p3RkCqLD+7x2iSWd+29CpRC+HEH0LxSgCmEqUOQRRw1/mAoKjhnabgaihcAGIGm4tBYQdQNAigP5AiwAOIPhFAFsNjSiCUaQTBrMIoD8wiwD6A+PKoD+w6BDiVxX4UQSrCvwoglUFX0wFpPcHAsigP7DGBPQHK72A+P7AGUXQH9h6CvJFkkZg/sBgEpg/2Ou+EUB/YEgR9Ae+EUB/IIEMsftNfSmC+wemEcD9gz8G8QLQH6gFkHI/2ZQiuJ8sagSXjS2VWgCRQ4lqAVhaohaA0LFaAELHagEIFagFIHSsFoBQgVoA502N1q04I15wqMA8Anw8GmoBhIcKVoZXQa5beKjAXiMQKthaClKFbiqwBxlMIgkYQOz55LOePhKI5NHQRwJ4NDw0FqS5N/ZmDwaEMYl0rHswIItHQw8GIGkobQQeDY0tw5u9e8txEwbDAEpkW5BCjPe/2lbqwzy0MzIhBOOcswjz8V9sk4Z+EsCkYbVVJ4GPYD1ZJwE+9CF140bgTsNnRNVDeudOwyq3pUDPHgOCAVg/EAzA+oFWAugkPiOYMaBL1g+2mg0f0iOdROVD0En0lwA6iTvMXk2hLzqJz4qpQDfsJO6QlQzohk7iLpPDgD4YL9rppn5IF8KAwwCMFzkMwO2mDgMwXqSACELBESZzBlyV8aLXiiYQuaQ08GKzogEXJBT85T+Bz2a86CDjIhpwJWaOjzO53YTLEAoONa+6i1yDUHC0cXEa0D4zx//hNODzWER6k3FxXToNEwreaF41GGmVUPBet3z3q0CDhIITzNPdwAGN8fjBScZJOqAltpNPNOegdkAbbCefKjoKaIRQUMsxQM+EglOMkxED2iIUVFjz+NJTQBigOUJBjUcpJd1DHIddxhwesgBtEgpqTF87nGkJOd6GTeaYw5I0DmmYUFDl9u9ad0pLCDnGOHwjxphDWFIySsQFCAV17uVnv9IXn3+uRyiolAv0TCioJeXTM6GgmlcN6JlQUC0W6JZQsIFaIN1yT8EWoUCnXF60xVygT0LBNvYG6JRQsM1UoEdCgdEC+GMd2GYp0B+vJCocglcSFQ5BKLCTBL/ZuxechoEYCoAbBA2Ctvj+p0WpVESiNk36TdYzp/Daz96j94LEIXwUrvATUBdFwVUa80TqsiuYJ4LlZPNEsJzsggmIHN+oDaiGPSQxI4j4UhQ4bAYix8oC6GwKygKQLlIWgHSRsgCki5QFYJCoLADpImUBGCSWInIIBokHNhHAILFjQREMEv/4QBEi3gwSnTMCg8TiyiG4d95x/Bgi9oUiZ0R67p3f1y5glfQM7+tb55BV0jM8MFAkOVfMOjqHpKdn2NE5JDs5wyOrCGQmZ/ifzCFp6Rk+xj5gTeQMe4QLyMpuco9wAUn5LXXAWhIpuWfY54lAUu4ZDpgikJI1pCFTBFISKThB0Ih0RAoerbGLwAo4d36GbxHIpS2cZF2ZVLaFs/ycRhquFIwxUSQNieMRTheQhsTxCO0C0pA4vkgAmQwcMRsnXUAOjpg9Vat1yDJ5HjzZZ8ASeR5MoHVI9TwPptA6pHaeBy/QbAIWxvNgIqlDquZ5MJ0xAvXyPJjFTSNqZfdgDiNFamU1+YW2AQthNXk2tw6p0S9795bcIAxDAdQkaSElDex/ta07/UiaJwwNYJ2zCM1YV5I9DwYzXkCBHDYdxXgBhXHYdHZqAUvgsOn81ALm1yXmpxYwim/RiqMWMJwxwxJZR2AMW0jlqV04YyBjhmXyRmA2754HS6IWMIAcsWBqAQPIEQumFvAkOWLh1AKeIkcsnz1FnmAfMQC1gIfsI4bgewQe0CgIwo0zXmfTJhZrZwiZ+wwcB2EImXsMHMchVOQ2h4siqQQJXKNREE/XwyWNgniOmodcMFEQUathwB8mCmLSMOCc1YOwNAw4ZfUgLhMGnHCjILDKN2r8h8/E2nSSBH45ZhhbLUlgYhvHDNfp0IPZIlLa6R5iCQkjBvRmizCHzLQ+tAzXrdIxQMsQHQMm0iRWr3ICFeuIZPVbD6YMSanRPsSUIdqHaBnilYDFZM4cZQkID8i2WgYMtU8USLCIeWN+tPYSEB6gGCA8QDFAeIBigPAAxQDHSrilFS0iRiSrOkNHCA/IGuPIOFtEVmsaIEbEO4HrVIKYdnstRMSIfKsa3ynhm1SyduuhgBiRrD6oBqgEqAZ8sXcvuQ3CUABFITaBlAS8/9U2s1RVFaXgiZ/PWcSVP89goICXOTk36JgS8MO6PNwp9OmiBPyS7xYH/TFaxF/GTQ76ogS8yUHyUKEb2wDvzPvN8qADhgz5RF7uk8PEyJSAz415T5MVQki+WsSRImwpTRYJkRgy5JQ55yU9TdMkDS1TAurxv+Z2KQHVjC4d22XcmGpmu4N2KQHV7IVmKQG1jI9Cs5SAWmYfOWiYEmBzgD8eYHOAx4hUlN0ctEwJqCQVGqYE1LF6mdQ0JaCOxeagaUqA80KUgEqyYYK2KQGeIaIE1DE7L2ycEuAKESXAkgAlwJIAJcCSACXAkoCX6zqAJUH3fJ8ASwKUAOOFKAEVjMYLI1ACTto8QozgoQScsvrdSQj+gcQ5yZIgBCXAcSFKwDmrD5QEsQxgb4ASYG9AuSgB7g3wAIkTRmPGYSgBPmyOp4ickD1BjMOwMQ4JMGzMYeOtEIfBIo4ZTRKEsg9wxC4EoRgn4JDFSFEolzyA2cLufRkn4IDs2iAYl4gIAaXclAAhoNwHEAJcHSAEuDpACHi6ujrgfzYhiOibvTvMTRwGwgDaYLtJSEi4/2m3ZVUtqhQIK0oTz3sH4A+SNfN5PCkCQwwU4dUBD2kcBJUSGOLREQJDHjF4hlwrC4tYL/uyQbWsKWG1zqqyeqU3WGUQEVTsML3BGllEUDNzRazS6AzqJiZgjaHXGdRNTMAKnfniyokJuK8dFQS1M02AhAD7irgrSwgC8L10bhuS90YRWGuMxgB3iNzUeWUQhe+gsWgSEIShOcA5gOYA5wCaA5wDaA5Y0HTOgWg0B3w3zO4LwjFWxDftaH4gIKsJ0Bbgy6hcy0k5EJT15nxp55NyICx5IRdD13tlFNjBMAGOAewo4bMpcAyEZ4FhbE1ORTaA+cLQ2rl3U8DFKC8Mqu1Gi4r5cnSFGFGenQLYZBpaOyXxID5zENnnISAWwFRRXG1OY1EJoCTYovYFx/CQu9Q7A1ASbFn7fj6WU0pTbp/+03lKqRgUwMXBPqTDv3+jlD6lLufc/O+MUM5zSn1RA2CWYHeGsjAFXj6kizkvmNNF+SAJREmwd5Mint+UlARb0YxneIilZZXK6nseYC9BxZIugdc72UuwPYPV4rzY0VDRNmVXgNzhBjEIXQIvU8SFW6ZL4BafPQpEl8Aiawli0SXww95NF+5D05/hmlGCqLI1Y1xzbxBXJzLgL/cGwTUiAy7MFIU3iAx4qoMniHslMuCJeu8NdmwSGfAcxQXizs0iA4QEf9i7F9wGYSAIoDW/gCHQ+5+2UlWpVVolIYEU2+8dYoRn1wb9IRuo/Bk5D/pDPFiGW0poCzFMQFuIMMC9Iywj87ToTYJsCQMEAcIA80O+9dYMcNsAO0cIAoQBggBhgCDgt6BARBBgmoAgQBggCLjQ+xs7ggB3E/gUe0HA21vjCnPZrBjjcRPeW0HAD6NFgzJ5j4BLYTFOKI4XijBOoKoFARrE4hkacN04KQ0K0PqvAUoDBr9D5j6ztaN8RXuFOCdgi4C1gnlCfpwMeEhjCTEncXEyQIVYvLO1QqwaFC/aJmIDo0+DtJ0tEaA1KF5cfBCwpbAYKCRo0BCwvZNdg7R0rhmwl16HmIo4ORiwp9FBIQWDppD9nSYThUNrHQx4lXlQGxxUZ2LATWqD3MXJJQNeL0iDQ6nkACsoEfNUKQpZRxpkSA5wDNJgBTlA1sZFb/Af4mSzmKPRIt5mXkAZgn2Da+wPUJLGLuLuqrN9QlJwWjyevp84qQlJR+gdFfbQOhaQnlNtxrilOMyOBSTKx8Fm7YDPAVKnOXhWV1seIBPN5KzwmG5yKiAvYRYHK8XBzJA8iYO7dUOvHCBr4sChAL6EuVYl/q2tGzFAWZr6bND4UxwW14s+2rmj3AZhIAjDSmYWbLDx/W9beOhDVamq0iYB+//uwNizC2BQa6ItHO4hOgGG51ZH/oIpCgNC4NPNGjAPoiQqATByHhyNgBQAfuKWu14vTJklAfBb66ba3UBxqlwFgEfMvQQCIQD83WzluOgrCEuUZhYEwD9yulIiTCGZiwDwNLZKnLc1TJGVGAsCL2NLNc6ye1yiSiYCgLe52U0l3hIKU4SUzD+GgFOZ7SbVeGZ/uEdEkZIZBgKXMNtO2sVhefjc32XtbE5/oBerv9j0zeYdjz0AAAAAAAAAAAAAAAAAAAC68QGwJgsnAWd/fwAAAABJRU5ErkJggg==",
                null,
                null
            ],
        },
        {
            title: LOCALIZATION_KEYS["LINKEDIN"],
            contents: LOCALIZATION_KEYS["LINKEDIN_contents"],
            url: "https://www.linkedin.com/in/sam-lynch/",
            images: [
                "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png",
                null,
                null
            ]
        },
    ],
];

function colourStrToNumber(str: string) {
    return Number(`0x${str.substring(1)}`);
}

export class Sevastapol extends State {

    private _selectedBox: number = 0;
    private _selectedFolder: number = 0;
    private _scrollBarClicked: boolean = false;

    private _crtFilter: CRTFilter;
    private _oldFilmFilter: OldFilmFilter;

    private _textBoxImages: Sprite[] = [];

    private _mainText: Text;
    private _scrollBar: Graphics;
    private _boxNameTexts: Text[] = [];
    private _folderTexts: Text[] = [];
    private _folderHeadingText: Text;
    private _personalTerminalText: Text;

    private _selectedFolderGraphic: Graphics;
    private _highlightedFolderGraphic: Graphics;
    private _verticalConnector: Graphics;
    private _horizontalConnector: Graphics;

    onAwake(_engine: Engine, _params?: unknown): void {
        ENGINE.recordLoadtime("Sevastapol.onAwake() start", true);

        setLanguageFromLocale("en_GB");

        const crtFilter = this._crtFilter =  new CRTFilter();
        crtFilter.vignetting = 0.25;
        crtFilter.vignettingBlur = 0.3;
        crtFilter.vignettingAlpha = 0.8;
        crtFilter.noise = 0;
        crtFilter.noiseSize = 0;
        crtFilter.curvature = 0;
        crtFilter.lineWidth = 8;
        crtFilter.lineContrast = 0.2;
        // const pixelFilter = new PixelateFilter();
        // pixelFilter.size = 6;
        const oldFilmFilter = this._oldFilmFilter = new OldFilmFilter();
        oldFilmFilter.sepia = 0;
        oldFilmFilter.vignetting = 0;
        oldFilmFilter.scratch = 0;
        oldFilmFilter.noise = 0.1;
        oldFilmFilter.noiseSize = 6;
        const bulgePinchFilter = new BulgePinchFilter();
        bulgePinchFilter.radius = tsthreeConfig.width * 0.69;
        bulgePinchFilter.strength = 0.03;

        const bloomFilter = new BloomFilter();
        bloomFilter.blur = 2.6;
        // @ts-ignore
        // bloomFilter.quality = 3;
        // bloomFilter.blurX = 10;
        // bloomFilter.blurY = 10;

        this.scene.getStage().filters = [
            // @ts-ignore
            crtFilter,
            // @ts-ignore
            bloomFilter,
            // @ts-ignore
            bulgePinchFilter,
        ];
        if(!isMobile()) {
            this.scene.getStage().filters.push(
                // @ts-ignore
                oldFilmFilter
            );
        }

        const bg = new Graphics();
        bg.beginFill(colourStrToNumber(COL_DARK_GREEN));
        bg.drawRect(0, 0, tsthreeConfig.width, tsthreeConfig.height);
        bg.endFill();
        this.scene.addObject(bg);

        const headerElements = this.createHeader();
        this._personalTerminalText = headerElements.personalTerminalText;

        const textboxElements = this.createTextBox();
        this._mainText = textboxElements.textBoxText;
        this._scrollBar = textboxElements.scrollBar;
        this._textBoxImages = textboxElements.images;

        const sidebarElements = this.createSideBar();
        this._boxNameTexts = sidebarElements.boxNames;

        const folderElements = this.createFolderElements();
        this._folderTexts = folderElements.folderTexts;
        this._highlightedFolderGraphic = folderElements.highlightedFolderGraphic;
        this._selectedFolderGraphic = folderElements.selectedFolderGraphic;

        const connectorStuff = this.createSelectedFolderConnector();
        this._verticalConnector = connectorStuff.upConnector;
        this._horizontalConnector = connectorStuff.rightConnector;

        this.scene.getStage().on("pointermove", (e: PointerEvent) => {
            if(this._scrollBarClicked) {
                this._scrollBar.y = e.movementY;
            }
        });

        this.updateTextboxImages();

        ENGINE.getTicker().start();
    }

    private updateConnector(): void {
        this._horizontalConnector.position.set(
            this._horizontalConnector.position.x,
            ((tsthreeConfig.height * 0.09) + 35) + (((70) + 35) * this._selectedFolder)
        );
        this._verticalConnector.position.set(
            this._verticalConnector.x,
            this._horizontalConnector.y
        );
        this._verticalConnector.scale.set(5,
            Sevastapol.calculateSelectedFolderConnectorHeight(
                this._selectedBox,
                this._selectedFolder
            )
        );
    }

    private createFolderElements(): {
        selectedFolderGraphic: Graphics,
        folderTexts: Text[],
        highlightedFolderGraphic: Graphics
    } {

        const posX = tsthreeConfig.width - (tsthreeConfig.width * 0.6) - 25;
        const basePosY = tsthreeConfig.height * 0.09;

        const selectedFolderGraphic = new Graphics();
        let highlightedFolder: Graphics;

        const folderTexts: Text[] = [];
        let pointerOverAny = 0;

        const height = 70;
        for(let i = 0; i < 3; i++) {
            const bg = new Graphics();
            bg.lineStyle(3, colourStrToNumber(COL_LIGHT_GREEN), 0.1);
            bg.drawRect(0, 0, FOLDER_TEXT_BOX_WIDTH, height);
            bg.position.set(
                posX,
                basePosY + (((height) + 35) * i)
            );
            bg.hitArea = new Rectangle(0, 0, FOLDER_TEXT_BOX_WIDTH, height);
            this.scene.addObject(bg);

            HelperFunctions.makeInteractive(bg);
            bg.on("pointerover", (e) => {
                pointerOverAny += 1;
                highlightedFolder.position.set(
                    posX,
                    basePosY + (((height) + 35) * i),
                );
                highlightedFolder.visible = true;
            });
            bg.on("pointerout", (e) => {
                pointerOverAny -= 1;
                if(pointerOverAny === 0) {
                    highlightedFolder.visible = false;
                }
            });
            bg.on("pointerup", (e) => {
                if(
                    !ALIEN_CONFIG[this._selectedBox][i]
                ) return;

                this._selectedFolder = i;
                this.updateConnector();
                this._mainText.position.set(
                    this._mainText.position.x,
                    -(tsthreeConfig.height * 0.65) + 45,
                );
                selectedFolderGraphic.visible = true;
                selectedFolderGraphic.position.set(
                    posX,
                    basePosY + (((height) + 35) * i)
                );
                this.updateTextboxContents();
            });

            const textContainer = new Container();
            const textMask = new Graphics();
            textMask.beginFill(0xff0000);
            textMask.drawRect(0, 0, FOLDER_TEXT_BOX_WIDTH, height);
            textMask.endFill();
            textContainer.mask = textMask;
            textContainer.addChild(textMask);

            const folderText = new Text(
                (getLText(
                    ALIEN_CONFIG[0][i]?.title
                ) || (ALIEN_CONFIG[0][i]?.title || "") + ""),
                _FOLDER_FONT_STYLE
            );
            folderText.anchor.set(0, 0.5);
            folderText.position.set(
                15,
                33
            );
            textContainer.addChild(folderText);
            bg.addChild(textContainer);
            folderTexts.push(folderText);
        }


        selectedFolderGraphic.beginFill(0xfafafa, 0.05);
        selectedFolderGraphic.lineStyle(3, 0xfafafa);
        selectedFolderGraphic.drawRect(0, 0, FOLDER_TEXT_BOX_WIDTH, height);
        selectedFolderGraphic.endFill();
        selectedFolderGraphic.position.set(
            posX,
            basePosY
        );
        this.scene.addObject(selectedFolderGraphic);

        highlightedFolder = selectedFolderGraphic.clone();
        highlightedFolder.alpha = 0.4;
        highlightedFolder.visible = false;
        this.scene.addObject(highlightedFolder);

        return {
            selectedFolderGraphic,
            folderTexts,
            highlightedFolderGraphic: highlightedFolder
        };
    }

    private createSelectedFolderConnector(): {
        upConnector: Graphics,
        rightConnector: Graphics,
    } {
        const posX = (((isPortrait ? 75 : 400) + 80) - 15) + (0.5 * (tsthreeConfig.width - (((isPortrait ? 75 : 400) + 80) + ((tsthreeConfig.width * 0.6) + 25))));
        const lineStartPoint = (tsthreeConfig.height * 0.09) + 35;

        const line = new Graphics();
        line.beginFill(0xfafafa);
        line.drawRect(0,0, 1, 1);
        line.endFill();
        line.scale.set(5,
            Sevastapol.calculateSelectedFolderConnectorHeight(
                this._selectedBox,
                this._selectedFolder
            )
        );
        line.position.set(
            posX,
            lineStartPoint
        );
        this.scene.addObject(line);

        const rightConnector = new Graphics();
        rightConnector.beginFill(0xfafafa);
        rightConnector.drawRect(0, 0,
            15 + (0.5 * (tsthreeConfig.width - (((isPortrait ? 75 : 400) + 80) + ((tsthreeConfig.width * 0.6) + 25)))),
            5
        );
        rightConnector.endFill();
        rightConnector.position.set(
            posX,
            lineStartPoint
        );
        this.scene.addObject(rightConnector);

        return {
            upConnector: line,
            rightConnector: rightConnector,
        };
    }

    private static calculateSelectedFolderConnectorHeight(
        _selectedBox: number,
        _selectedFolder: number,
    ): number {
        const lineStartPoint = (tsthreeConfig.height * 0.09) + 35;

        return (
            (
                ((tsthreeConfig.height * 0.25) + 45 - 5) + ((isPortrait ? 75 : 188) * 0.5)
            ) - lineStartPoint
        ) - (((70) + 35) * _selectedFolder) + (_selectedBox * (188 + 20));
    }

    private createSideBar(): {
        folderHeadingText: Text,
        boxNames: Text[],
    } {
        const foldersText = new Text("FOLDERS", new TextStyle({
            fill: COL_LIGHT_GREEN,
            fontSize: 48,
            align: "left",
            fontFamily: "Sevastopol",
        }));
        foldersText.anchor.set(0, 0.5);
        foldersText.position.set(
            50,
            tsthreeConfig.height * 0.25
        );
        this.scene.addObject(foldersText);

        const boxDimensions: IVector2 = {
            x: isPortrait ? 75 : 400,
            y: isPortrait ? 75 : 188
        };

        const selectedBoxPos: IVector2 = {
            x: foldersText.position.x - 60,
            y: foldersText.position.y + 45 - 5,
        };

        const selectedBox = new Graphics();
        selectedBox.beginFill(0xfafafa);
        selectedBox.drawRect(0, 0, boxDimensions.x + 80, boxDimensions.y + 10);
        selectedBox.drawRect(boxDimensions.x + 80, boxDimensions.y * 0.5,
            // tsthreeConfig.width - ((width of the selectedbox graphic) + (textbox width + x offset from right))
            // ^ then half
            0.5 * (tsthreeConfig.width - ((boxDimensions.x + 80) + ((tsthreeConfig.width * 0.6) + 25))),
            5
        );
        selectedBox.endFill();
        selectedBox.position.set(
            selectedBoxPos.x,
            selectedBoxPos.y,
        );
        this.scene.addObject(selectedBox);

        const highlightedBox = new Graphics();
        highlightedBox.beginFill(0xfafafa);
        highlightedBox.drawRect(0, 0, boxDimensions.x + 80, boxDimensions.y + 10);
        selectedBox.endFill();
        highlightedBox.alpha = 0.6;
        highlightedBox.position.set(
            selectedBoxPos.x,
            selectedBoxPos.y + (1 * (188 + 20)),
        );
        highlightedBox.visible = false;
        this.scene.addObject(highlightedBox);

        const boxes = [];
        const boxFont = _BOX_FONT_STYLE;

        // const keys = Object.keys(ALIEN_CONFIG);
        const folderTexts = [];
        for(let i = 0; i < 4; i++) {
            const bg = new Graphics();
            bg.beginFill(colourStrToNumber(COL_LIGHT_GREEN));
            bg.drawRect( 0, 0, boxDimensions.x, boxDimensions.y);
            bg.endFill();
            bg.beginFill(colourStrToNumber(COL_DARK_GREEN));
            bg.drawRect( 3, 3, boxDimensions.x - 6, boxDimensions.y - 6);
            bg.endFill();
            this.scene.addObject(bg);

            if(isPortrait) {
                const sprite = new Sprite(
                    ENGINE.getPIXIResource(
                        STRING_TO_ICON[BOX_NAMES[i]]
                    ) as Texture
                );
                sprite.anchor.set(0.5);
                sprite.scale.set(3.5);
                bg.addChild(sprite);
                sprite.position.set(boxDimensions.x * 0.5, boxDimensions.y * 0.5);
                // const text = new Text(
                //     STRING_TO_ICON[BOX_NAMES[i]],
                //     boxFont
                // );
                // text.anchor.set(0.5);
                // bg.addChild(text);
                // text.position.set(boxDimensions.x * 0.5, boxDimensions.y * 0.5);
            } else {
                const text = new Text(
                    getLText(BOX_NAMES[i]),
                    boxFont
                );
                folderTexts.push(text);
                bg.addChild(text);
                text.position.set(25, 10);
            }

            bg.position.set(
                foldersText.position.x,
                foldersText.position.y + 45 + (i * (188 + 20)),
            );

            boxes.push(bg);
        }

        let pointerOverAny: number = 0;
        boxes.forEach((b, i) => {
            HelperFunctions.makeInteractive(b, false);
            b.on("pointerover", (e) => {
                pointerOverAny += 1;
                highlightedBox.position.set(
                    selectedBoxPos.x,
                    selectedBoxPos.y + (i * (188 + 20)),
                );
                highlightedBox.visible = true;
            });
            b.on("pointerout", (e) => {
                pointerOverAny -= 1;
                highlightedBox.position.set(
                    selectedBoxPos.x,
                    selectedBoxPos.y + (i * (188 + 20)),
                );
                if(pointerOverAny === 0) {
                    highlightedBox.visible = false;
                }
            });
            b.on("pointerup", (e) => {
                if(this._selectedBox === i) {
                    return;
                }
                this.resetFolderScrollAnims();
                this._scrollBar.y = 0;
                highlightedBox.visible = false;
                selectedBox.position.set(
                    selectedBoxPos.x,
                    selectedBoxPos.y + (i * (188 + 20)),
                );
                this._selectedFolderGraphic.position.set(
                    this._selectedFolderGraphic.position.x,
                    (tsthreeConfig.height * 0.09)
                );
                this._mainText.position.set(
                    this._mainText.position.x,
                    -(tsthreeConfig.height * 0.65) + 45,
                );
                // this._selectedFolderGraphic.visible = false;
                this._selectedBox = i;
                this._selectedFolder = 0;
                this.updateConnector();
                this._folderTexts.forEach((e,i) => {
                    if(ALIEN_CONFIG[this._selectedBox][i]?.title) {
                        e.text = getLText(
                            ALIEN_CONFIG[this._selectedBox][i]?.title
                        ) || ALIEN_CONFIG[this._selectedBox][i]?.title + "";
                    } else {
                        e.text = "";
                    }
                });
                this.updateTextboxContents();
            });
        });

        ENGINE.recordLoadtime("Sevastapol.onAwake() end").then(() => {
            console.log(ENGINE.exportLoadtimeAsString());
        });

        return {
            folderHeadingText: foldersText,
            boxNames: folderTexts,
        };
    }

    private createTextBox(): {
        textBoxText: Text,
        scrollBar: Graphics,
        images: Sprite[]
    } {
        const textAreaWidth = (tsthreeConfig.width * 0.6) - 10;

        const scrollBarContainer = new Container();
        const scrollBarBg = new Graphics();
        scrollBarBg.lineStyle(2, 0xfafafa, 0.8);
        scrollBarBg.drawRect(0, 0, SCROLL_BAR_WIDTH, (tsthreeConfig.height * 0.65) - 40);
        scrollBarContainer.addChild(scrollBarBg);

        const scrollBar = new Graphics();
        scrollBar.beginFill(0xfafafa, 0.8);
        scrollBar.drawRect(0, 0, SCROLL_BAR_WIDTH, 200);
        scrollBar.endFill();
        if(!isMobile()) {
            HelperFunctions.makeInteractive(scrollBar);
            HelperFunctions.makeInteractive(scrollBarBg);
            scrollBar.hitArea = new Rectangle(0, 0, scrollBar.width + 8, scrollBar.height);
            scrollBar.on("pointerdown", () => {
                this._scrollBarClicked = true;
                this._scrollBar.alpha = 0.6;
            });
            const scrollBarPointerUp = () => {
                this._scrollBarClicked = false;
                this._scrollBar.alpha = 1;
            };
            scrollBar.on("pointerup", scrollBarPointerUp);
            scrollBar.on("pointerupoutside", scrollBarPointerUp);
        }

        const textboxBg = new Graphics();
        textboxBg.beginFill(colourStrToNumber(COL_LIGHT_GREEN));
        textboxBg.drawRect(
            -(tsthreeConfig.width * 0.6),
            -(tsthreeConfig.height * 0.65),
            tsthreeConfig.width * 0.6,
            tsthreeConfig.height * 0.65
        );
        textboxBg.endFill();
        textboxBg.beginFill(colourStrToNumber(COL_DARK_GREEN));
        textboxBg.drawRect(
            -(tsthreeConfig.width * 0.6) + 5,
            -(tsthreeConfig.height * 0.65) + 35,
            textAreaWidth,
            (tsthreeConfig.height * 0.65) - 40
        );
        textboxBg.endFill();
        this.scene.addObject(textboxBg);
        textboxBg.position.set(
            tsthreeConfig.width - 25,
            tsthreeConfig.height - 25,
        );
        textboxBg.addChild(scrollBarContainer);

        const text = new Text(
            getLText(ALIEN_CONFIG[this._selectedBox][this._selectedFolder].contents),
            new TextStyle({
                fontFamily: "Sevastopol",
                fontSize: isPortrait ? 42 : 48,
                fill: "#fafafa",
                wordWrap: true,
                breakWords: false,
                wordWrapWidth: WORD_WRAP_WIDTH
            })
        );
        const initialY = -(tsthreeConfig.height * 0.65) + 45;
        text.position.set(
            -(tsthreeConfig.width * 0.6) + 20,
            initialY,
        );
        textboxBg.addChild(text);
        const textboxMask = new Graphics();
        textboxMask.beginFill(0xff0000);
        textboxMask.drawRect(
            -(tsthreeConfig.width * 0.6) + 5,
            -(tsthreeConfig.height * 0.65) + 35,
            textAreaWidth,
            (tsthreeConfig.height * 0.65) - 40
        );

        const textboxInteractiveTarget = textboxBg;
        HelperFunctions.makeInteractive(textboxInteractiveTarget, true);
        let pointerover = false;
        let pointerdown = false;
        let inputPointY: number = null;
        let textPosY: number = null;
        let scrollBarPosY: number = null;
        textboxInteractiveTarget.on("pointerover", () => {
            pointerover = true;
        });
        textboxInteractiveTarget.on("pointerout", () => {
            if(this._scrollBarClicked) return;
            pointerover = false;
            pointerdown = false;
            inputPointY = null;
            textPosY = null;
            scrollBarPosY = null;
        });
        textboxInteractiveTarget.on("pointerdown", (e) => {
            const pos = HelperFunctions.parseInteractionEvent(e);
            pointerover = true;
            pointerdown = true;
            inputPointY = pos.y;
            textPosY = text.y;
            scrollBarPosY = scrollBar.y;
        });
        textboxInteractiveTarget.on("pointerup", () => {
            pointerdown = false;
            inputPointY = null;
            textPosY = null;
            scrollBarPosY = null;
        });

        const tMaxY = initialY;
        textboxInteractiveTarget.on("pointermove", (e: PointerEvent) => {
            if(this._scrollBarClicked) {
                if(!pointerdown || !pointerover) return;
                const pos = HelperFunctions.parseInteractionEvent(e as unknown as PIXIInteractionEvent);
                const delta = ((pos.y) - inputPointY);
                const maxY = scrollBarBg.height - scrollBar.height - 1;
                scrollBar.y = Math.min(
                    maxY,
                    Math.max(
                        // todo: fix hardcode
                        0,
                        scrollBarPosY + delta
                    )
                );
                const percent = ((scrollBar.y - maxY)) / (0 - maxY);
                text.y = Math.min(
                    tMaxY,
                    Math.max(
                        // todo: fix hardcode
                        initialY - (text.height - 200),
                        initialY + (((initialY - (text.height - 200)) - tMaxY) * (1 - percent))
                    )
                );
                // const tMinY = initialY - (text.height - 200);
                // scrollBar.y = maxY * percent;
            } else if(isMobile()) {
                if(!pointerdown || !pointerover) return;
                const pos = HelperFunctions.parseInteractionEvent(e as unknown as PIXIInteractionEvent);
                text.y = Math.min(
                    initialY,
                    Math.max(
                        // todo: fix hardcode
                        initialY - (text.height - 200),
                        textPosY + (pos.y - inputPointY)
                    )
                );
                const maxY = scrollBarBg.height - scrollBar.height - 1;
                const tMinY = initialY - (text.height - 200);
                const percent = ((text.y - tMaxY)) / (tMinY - tMaxY);
                scrollBar.y = maxY * percent;
            }
        });

        document.addEventListener("wheel", (e) => {
            if(!pointerover) return;

            const maxY = scrollBarBg.height - scrollBar.height - 1;
            const tMinY = initialY - (text.height - 200);
            text.y = Math.min(
                tMaxY,
                Math.max(
                    tMinY,
                    text.y + -e.deltaY
                )
            );
            const percent = ((text.y - tMaxY)) / (tMinY - tMaxY);
            scrollBar.y = maxY * percent;

        });
        textboxMask.endFill();
        text.mask = textboxMask;
        textboxBg.addChild(textboxMask);

        scrollBarContainer.position.set(-SCROLL_BAR_WIDTH - 6, initialY - 10);
        scrollBarBg.addChild(scrollBar);

        const imageSprites: Sprite[] = [];
        for(let i = 0; i < 3; i++) {
            const imageSprite = new Sprite();
            text.addChild(imageSprite);
            imageSprite.anchor.set(0.5);
            imageSprite.position.set((textAreaWidth - SCROLL_BAR_WIDTH) / 2, 0);
            HelperFunctions.makeInteractive(imageSprite);

            let pointerdown = false;
            imageSprite.on("pointerdown", () => {
                pointerdown = true;
            });
            imageSprite.on("pointerout", () => {
                pointerdown = false;
            });
            imageSprite.on("pointerup", () => {
                if(!pointerdown) return;
                pointerdown = false;
                window.open(
                    ALIEN_CONFIG[this._selectedBox][this._selectedFolder].url
                );
            });
            imageSprites.push(imageSprite);
        }

        return {
            textBoxText: text,
            scrollBar: scrollBar,
            images: imageSprites
        };
    }

    private createHeader(): {
        personalTerminalText: Text,
    } {
        const personalTerminalBg = new Graphics();
        personalTerminalBg.beginFill(colourStrToNumber(COL_LIGHT_GREEN));
        personalTerminalBg.drawRect(
            (tsthreeConfig.width - 50) * -0.5,
            (tsthreeConfig.height * 0.04) * -0.5,
            tsthreeConfig.width - 50,
            tsthreeConfig.height * 0.04
        );
        personalTerminalBg.endFill();
        personalTerminalBg.beginFill(0x0a1f0a);
        personalTerminalBg.drawRect(
            ((tsthreeConfig.width - 50) * 0.5) - (tsthreeConfig.height * 0.03) - 15,
            tsthreeConfig.height * 0.03 * -0.5,
            tsthreeConfig.height * 0.03,
            tsthreeConfig.height * 0.03
        );
        personalTerminalBg.endFill();
        personalTerminalBg.position.set(
            tsthreeConfig.width * 0.5,
            ((tsthreeConfig.height * 0.04) * 0.4) + 25
        );
        this.scene.addObject(personalTerminalBg);

        const personalTerminalText = new Text("PERSONAL TERMINAL", new TextStyle({
            fill: COL_DARK_GREEN,
            fontFamily: "Sevastopol",
            align: "left",
            fontSize: 48,
        }));
        personalTerminalText.anchor.set(0, 0.5);
        personalTerminalText.position.set(
            ((tsthreeConfig.width - 50) * -0.5) + 25,
            0
        );
        personalTerminalBg.addChild(personalTerminalText);

        // const localizationTextButton = new Text("EN", new TextStyle({
        //     fill: COL_LIGHT_GREEN,
        //     fontFamily: "Sevastopol",
        //     align: "center",
        //     fontWeight: "bold",
        //     fontSize: 38,
        // }));
        // localizationTextButton.anchor.set(0.5, 0.5);
        // localizationTextButton.position.set(
        //     ((tsthreeConfig.width - 50) * 0.5) - (tsthreeConfig.height * 0.03 * 0.5) - 15,
        //     0
        // );
        // personalTerminalBg.addChild(localizationTextButton);
        //
        // HelperFunctions.makeInteractive(localizationTextButton);
        // localizationTextButton.on("pointerup", () => {
        //     if(getCurrentLanguage() === Languages.English) {
        //         setLanguageFromLocale("ja_JP");
        //         localizationTextButton.text = "JA";
        //     } else {
        //         setLanguageFromLocale("en_GB");
        //         localizationTextButton.text = "EN";
        //     }
        //     this.updateAllTexts();
        // });

        return {
            personalTerminalText,
        };
    }

    private updateAllTexts(): void {
        this._boxNameTexts.forEach(
            (e, i) => {
                e.text = getLText(
                    BOX_NAMES[i]
                );
            }
        );

        this._folderTexts.forEach((e,i) => {
            if(ALIEN_CONFIG[this._selectedBox][i]?.title) {
                e.text = getLText(
                    ALIEN_CONFIG[this._selectedBox][i]?.title
                ) || ALIEN_CONFIG[this._selectedBox][i]?.title + "";
            } else {
                e.text = "";
            }
        });
        this.updateTextboxContents();
    }

    preload(_engine: Engine): Promise<void> {
        ENGINE.recordLoadtime("Sevastapol.preload() start", true);

        const assets: typeof BootAssets = [];
        if(isPortrait) {
            assets.push({
                key: "Icons_spritesheet",
                path: "sprites/Icons.json",
                type: LoaderType.PIXI,
            });
        }

        const promises: Promise<unknown>[] = [
            document.fonts.ready,
            ENGINE.loadAssets(assets).then(() => {
                if(isPortrait)
                    return ENGINE.processSpritesheet(
                        ENGINE.getPIXIResource("Icons_spritesheet") as Spritesheet
                    );
            }),
            HelperFunctions.waitForTruth((): boolean => {
                return document.fonts.check("36px Sevastopol");
            }).then(() => {
                const fontPreloadElement: HTMLElement =
                    document.getElementById("_fontPreload");
                if(fontPreloadElement) {
                    fontPreloadElement.remove();
                }
            })
        ];

        return (
            Promise.allSettled(promises) as unknown as Promise<void>
        ).then(() =>
            ENGINE.recordLoadtime("Sevastapol.preload() end")
        );
    }

    private updateTextboxImages(): void {
        this._textBoxImages.forEach((e, i) => {
            if(!ALIEN_CONFIG[this._selectedBox][this._selectedFolder].images) {
                e.visible = false;
                return;
            }
            const key = ALIEN_CONFIG[this._selectedBox][this._selectedFolder].images[i];
            if(
                key &&
                !CACHED_TEXTBOX_IMAGE_TEXTURES[key]
            ){
                CACHED_TEXTBOX_IMAGE_TEXTURES[key] = new Texture(new BaseTexture(key));
                update(this._mainText);
            } else if(key) {
                update(this._mainText);
            }

            async function update(textEle: Text) {
                await HelperFunctions.waitForTruth(() => CACHED_TEXTBOX_IMAGE_TEXTURES[key].valid);
                e.visible = true;
                e.texture =
                    CACHED_TEXTBOX_IMAGE_TEXTURES[key];
                HelperFunctions.smartScale2D(
                    {
                        x: Math.min(textEle.parent.width * 0.8, Math.max(
                            CACHED_TEXTBOX_IMAGE_TEXTURES[key].width,
                            180
                        )),
                        y: undefined,
                    },
                    e,
                );
                e.position.set( e.position.x, textEle.height + (e.height * e.anchor.y) + 30 );
            }
        });
    }

    private resetFolderScrollAnims() {
        FOLDER_SCROLL_ANIMS.forEach((e, i) => {
            e.progress = 0;
            this._folderTexts[i].x = 15;
        });
    }

    private updateTextboxContents(): void {
        this._mainText.text =
            getLText(ALIEN_CONFIG[this._selectedBox][this._selectedFolder].contents);
        this.updateTextboxImages();
    }

    onStep(_engine: Engine) {
        super.onStep(_engine);
        if(this._crtFilter) {
            this._crtFilter.time += 0.25 * _engine.deltaTime;
            this._crtFilter.seed += 0.001 * _engine.deltaTime;
        }
        if(this._oldFilmFilter) {
            this._oldFilmFilter.seed += 0.00001;
        }
        FOLDER_SCROLL_ANIMS?.forEach((e, i) => {
            if(!this._folderTexts[i]) return;

            if(this._folderTexts[i].width > FOLDER_TEXT_BOX_WIDTH) {
                e.progress += 0.33 * _engine.deltaTime;
            }

            if(e.progress > 15) {
                this._folderTexts[i].x = Math.max(
                    FOLDER_TEXT_BOX_WIDTH - this._folderTexts[i].width - 15,
                    15 - (e.progress - 15)
                );
            }
            if(
                (e.progress - 15) > (Math.abs(FOLDER_TEXT_BOX_WIDTH - this._folderTexts[i].width) + 55)
            ) {
                this._folderTexts[i].x = 15;
                e.progress = 0;
            }
        });
    }
}
