export const CameraId = {
    DEBUG: "DEBUG",
    MAIN: "MAIN",
} as const;

export type CameraId = typeof CameraId[keyof typeof CameraId];
