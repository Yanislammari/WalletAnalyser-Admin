import type { CurrenciesResponse, CurrencyNameResponse, CurrencyPatchPayload } from "../payloads/CurrencyPayload";
import { BaseService } from "./BaseService";
import type { MessageResponse } from "../responses/ErrorResponse";

class CurrenciesService extends BaseService {
  private static instance: CurrenciesService;
  private readonly base_url_currency = "/admin/currencies/";

  private constructor() {
    super();
  }

  public static getInstance(): CurrenciesService {
    if (!CurrenciesService.instance) {
      CurrenciesService.instance = new CurrenciesService();
    }
    return CurrenciesService.instance;
  }

  public async getCurrencies(): Promise<CurrenciesResponse> {
    return this.request<CurrenciesResponse>(this.base_url_currency, {
      method: "GET",
    });
  }

  public async postCurrency(payload: CurrencyPatchPayload): Promise<CurrencyNameResponse> {
    return this.request<CurrencyNameResponse>(this.base_url_currency, {
      body: JSON.stringify(payload),
      method: "POST",
    });
  }

  public async patchCurrency(payload: CurrencyPatchPayload, currencyId: string): Promise<CurrencyNameResponse> {
    return this.request<CurrencyNameResponse>(this.base_url_currency + currencyId, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async delete(currencyId: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_currency + currencyId, {
      method: "DELETE",
    });
  }
}

export default CurrenciesService;
