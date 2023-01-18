import { IData } from "../game/Types/IData";
import { ENGINE_DEBUG_MODE } from "../engine/Constants/Constants";
import isMobile from "is-mobile";
import { isWebPSupported } from "../engine/HelperFunctions/isWebPSupported";
import { SCALE_MODES } from "pixi.js";
import { State } from "../engine/State";

export const tsthreeConfig: {
  width: number;
  height: number;
  showFPSTracker: boolean;
  backgroundColor: number;
  backgroundAlpha: number;
  antialias: boolean;
  sharedTicker: boolean;
  sharedLoader: boolean;
  autoStart: boolean;
  defaultCameraType?: "perspective" | "orthographic";
  devicePixelRatio: number;
  autoResize: "either" | "width" | "height" | "none";
  maintainResolution: boolean; // if true, continue using config resolution even if canvas size changes
  gamePlatform: "none" | "facebook",
  autoSave: number | 0, // if >0, then save every specified milliseconds
  getLatestData: (e: IData[]) => IData,
  logErrors: "none" | "firebase" | "sentry", // sentry not yet supported
  autoInitFirebase: boolean,
  adjustHeightForBannerAd: boolean,
  enableWebP: boolean,
  scaleMode: SCALE_MODES,
  printFatalErrorsToHTML: boolean,
  pauseOnFocusLoss: boolean,
  // autoLoadState: State | null,

  // DEPRECATED
  // transparent: boolean; // deprecated since pixi v6
  scale3D?: {
    mobile: number,
    desktop: number,
  }; // how much to scale the width/height for the 3D renderer
} = {
  width: Math.max(window.innerWidth, 640),
  height: Math.max(window.innerHeight, 1280),
  scale3D: {
    mobile: 0.35,
    desktop: 0.75
  },
  showFPSTracker: ENGINE_DEBUG_MODE,
  backgroundAlpha: 1,
  backgroundColor: 0x111111,
  antialias: false,
  scaleMode: SCALE_MODES.NEAREST,
  sharedTicker: true,
  sharedLoader: false,
  autoStart: false,
  defaultCameraType: "perspective",
  devicePixelRatio: window.devicePixelRatio || 1,
  autoResize: "either",
  adjustHeightForBannerAd: false,
  maintainResolution: true,
  gamePlatform: "none",
  autoSave: 0,
  logErrors: "none",
  autoInitFirebase: false,
  printFatalErrorsToHTML: !__PRODUCTION,
  // disabled because of 200mb bundle size limit on FBInstant :shrug:
  enableWebP: false, // isWebPSupported(),
  pauseOnFocusLoss: __PRODUCTION,
  // autoLoadState: new Sevastapol(),

  getLatestData: e => {
    return e[0];
  }
};
