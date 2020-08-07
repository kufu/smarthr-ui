export interface InteractionProperty {
    hover?: {
        feedbackOpacity?: string;
        animationDuration?: string;
        animationTiming?: string;
        animation?: string;
    };
}
export interface CreatedInteractionTheme {
    hover: {
        feedbackOpacity: string;
        animationDuration: string;
        animationTiming: string;
        animation: string;
    };
}
export declare const defaultInteraction: {
    hover: {
        feedbackOpacity: string;
        animationDuration: string;
        animationTiming: string;
        animation: string;
    };
};
export declare const createInteraction: (userInteraction?: InteractionProperty) => CreatedInteractionTheme;
