import axios, { AxiosRequestConfig } from 'axios';
import { decode, encode } from 'html-entities';
import { argv } from '../cli.js';
import { NLPTranslateResponse } from '../payload.js';
import { Translate } from '../translate.js';
import { addCustomCert } from '../util.js';

export class NLPRapidAPI extends Translate {
  private static readonly endpoint: string = 'nlp-translation.p.rapidapi.com';
  private static readonly axiosConfig: AxiosRequestConfig = {
    headers: {
      'X-RapidAPI-Host': NLPRapidAPI.endpoint,
      'X-RapidAPI-Key': argv.key,
      'Content-type': 'application/x-www-form-urlencoded',
    },
    responseType: 'json',
  };

  constructor() {
    super();
    if (argv.certificatePath) {
      NLPRapidAPI.axiosConfig.httpsAgent = addCustomCert(argv.certificatePath);
    }
  }

  protected callTranslateAPI = async (valuesForTranslation: string[]): Promise<string> => {
    const response = await axios.post(
      `https://${NLPRapidAPI.endpoint}/v1/translate`,
      {
        text: encode(valuesForTranslation.join(Translate.sentenceDelimiter)),
        to: argv.to,
        from: argv.from,
      },
      NLPRapidAPI.axiosConfig,
    );
    return decode((response as NLPTranslateResponse).data.translated_text[argv.to]);
  };
}
