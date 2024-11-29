export interface DictionaryWordModel {
    word: string;                 // The word itself
    phonetics: PhoneticModel[];   // Array of phonetic information
    meanings: MeaningModel[];     // Array of meanings
}

export interface PhoneticModel {
    text?: string;   // Phonetic text, optional
    audio?: string;  // Audio URL for pronunciation, optional
}

export interface MeaningModel {
    partOfSpeech: string;             // Part of speech (e.g., noun, verb)
    definitions: DefinitionModel[];   // Array of definitions
}

export interface DefinitionModel {
    definition: string; // The definition text
    example?: string;   // Example sentence, optional
}
