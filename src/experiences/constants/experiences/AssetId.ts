export const AssetId = {
    TEXTURE_TEMPLATE: "TEXTURE_TEMPLATE",
    HDR_TEMPLATE: "HDR_TEMPLATE",
    GLTF_TEMPLATE: "GLTF_TEMPLATE",
} as const;

export type AssetId = typeof AssetId[keyof typeof AssetId];
