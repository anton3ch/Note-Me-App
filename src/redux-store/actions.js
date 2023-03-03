import { THEME_CHANGE } from "./constants";

export const switchMode = () => {
    return {
        type: THEME_CHANGE,
    };
};