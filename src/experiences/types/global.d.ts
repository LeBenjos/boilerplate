import type { Experience } from "./experience"; // adjust the path

declare global {
    interface Window {
        experience: Experience;
    }
}

export { };

