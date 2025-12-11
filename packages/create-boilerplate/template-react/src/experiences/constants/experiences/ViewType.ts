export const ViewType = {
    REACT: 'react',
    THREE: 'three',
    VUE: 'vue',
    HTML: 'html',
} as const;

export type ViewType = (typeof ViewType)[keyof typeof ViewType];
