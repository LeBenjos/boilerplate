const HTMLViewId = {
    HTML_LOADER: "HTML_LOADER",
} as const;

const ThreeViewId = {
    THREE_LOADER: "THREE_LOADER",
    THREE_WORLD: "THREE_WORLD",
} as const;

export const ViewId = {
    ...HTMLViewId,
    ...ThreeViewId,
} as const;

export type ViewId = typeof ViewId[keyof typeof ViewId];
