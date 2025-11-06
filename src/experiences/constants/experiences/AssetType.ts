export const AssetType = {
    TEXTURE: "TEXTURE",
    HDR: "HDR",
    MODEL: "MODEL",
} as const;

export type AssetType = typeof AssetType[keyof typeof AssetType];
