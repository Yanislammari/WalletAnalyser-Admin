import { BaseService } from "./BaseService";
import type { ForexRateMetaData, ForexRateShort, ForexRatePayload } from "../payloads/ForexRatesPayload";
import type { MessageResponse } from "../responses/ErrorResponse";

class ForexRatesService extends BaseService {
  private static instance: ForexRatesService;
  private readonly base_url_forex_rates = "/admin/forex-rates/";

  private constructor() {
    super();
  }

  public static getInstance(): ForexRatesService {
    if (!ForexRatesService.instance) {
      ForexRatesService.instance = new ForexRatesService();
    }
    return ForexRatesService.instance;
  }

  public async getForexRates(uuid: string, offset: number, size: number, from: string, to: string): Promise<ForexRateMetaData> {
    return this.request<ForexRateMetaData>(
      this.base_url_forex_rates + uuid + `?offset=${offset}&size=${size}&to=${to}&from=${from}`,
      {
        method: "GET",
      }
    );
  }

  public async postForexRate(payload: ForexRatePayload, uuid: string): Promise<ForexRateShort> {
    return this.request<ForexRateShort>(this.base_url_forex_rates + uuid, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async patchForexRate(payload: ForexRatePayload, uuid: string): Promise<ForexRateShort> {
    return this.request<ForexRateShort>(this.base_url_forex_rates + uuid, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async delete(uuid: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_forex_rates + uuid, {
      method: "DELETE",
    });
  }
}

export default ForexRatesService;
