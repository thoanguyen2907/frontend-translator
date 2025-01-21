export type Translator = {
  id: string
  wordFirstLang: string
  sentenceFirstLang: string
  wordSecondLang: string
  sentenceSecondLang: string
}
export type TranslatorEdit = Omit<Translator, "id">;

export type TranslatorResponse = {
  code: number;
  success: boolean;
  details: {
    offset: number;
    limit: number;
    totalRecords: number;
    totalPage: number;
    records: Translator[]; 
  };
  timestamp: string;
}

export type UpdateTranslator = Partial<TranslatorEdit>; 