import { SAVE_KEYS } from "../Constants/SaveKeys";
import { ENGINE_DEBUG_MODE, GAME_DEBUG_MODE } from "../../engine/Constants/Constants";

const UNLOCK_ALL_LEVELS = !__PRODUCTION;

class PlayerDataSingletonClass {
    // Properties
    private _initialized: boolean = false;

    private _dirty: Array<SAVE_KEYS> = [];

    constructor() {}

    public isInitialized(): boolean {
        return this._initialized;
    }

    public dirtify(key: string | SAVE_KEYS): void {
        this._dirty.push(key as SAVE_KEYS);
    }

    public isDirty(): boolean {
        return this._dirty.length > 0;
    }

    initialize(_data: Record<string, unknown>): void {
        const data = _data || {} as Record<string, unknown>;
        if (this.isInitialized()) {
            console.warn("PlayerDataSingleton being initialized multiple times");
        }

        this._initialized = true;
    }

    public export(_exportAll: boolean = false): { [key: string]: unknown } {
        const retVal: { [key: string]: unknown } = {};

        if(_exportAll || this._dirty.length > 0) {
            retVal[SAVE_KEYS.LastUpdatedTimestamp] = Date.now();
        }

        this._dirty = [];

        return retVal;
    }
}

export const PlayerDataSingleton = new PlayerDataSingletonClass();

if(GAME_DEBUG_MODE || ENGINE_DEBUG_MODE) {
    // @ts-ignore
    window["PlayerDataSingleton"] = PlayerDataSingleton;
}
