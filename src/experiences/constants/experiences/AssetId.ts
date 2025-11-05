export const AssetId = {
    TEXTURE_TEMPLATE: "TEXTURE_TEMPLATE",
    HDR_TEMPLATE: "HDR_TEMPLATE",
    MODEL_TEMPLATE: "MODEL_TEMPLATE",
} as const;

export type AssetId = typeof AssetId[keyof typeof AssetId];
