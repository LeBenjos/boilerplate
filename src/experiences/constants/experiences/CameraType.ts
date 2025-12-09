export const CameraType = {
    PERSPECTIVE: 'PERSPECTIVE',
    ORTHOGRAPHIC: 'ORTHOGRAPHIC',
} as const;

export type CameraType = (typeof CameraType)[keyof typeof CameraType];
