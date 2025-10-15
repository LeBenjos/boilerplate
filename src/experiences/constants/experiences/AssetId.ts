export const AssetId = {
    TEMPLATE_TEXTURE: "TEMPLATE_TEXTURE",
    TEMPLATE_HDR: "TEMPLATE_HDR",
    TEMPLATE_MODEL: "TEMPLATE_MODEL",
} as const;

export type AssetId = typeof AssetId[keyof typeof AssetId];
