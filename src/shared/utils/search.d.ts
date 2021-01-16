export interface PredictionSubstring {
    length: number;
    offset: number;
}
export interface Splits {
    text: string;
    match: boolean;
}
export declare function splitString(title: string, matched: readonly PredictionSubstring[]): Splits[];
