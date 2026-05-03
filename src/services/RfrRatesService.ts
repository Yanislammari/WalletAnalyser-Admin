import type { GetRfrRatePayload, RfrPayload, RfrRateMetaData, RiskFreeRateShort } from "../payloads/RfrRatesPayload";
import { BaseService } from "./BaseService";
import type { MessageResponse } from "../responses/ErrorResponse";

class RfrRatesService extends BaseService {
  private static instance: RfrRatesService;
  private readonly base_url_rfr_rates = "/admin/rfr-rates/"

  private constructor() {
    super();
  }

  public static getInstance(): RfrRatesService {
    if (!RfrRatesService.instance) {
      RfrRatesService.instance = new RfrRatesService();
    }
    return RfrRatesService.instance;
  }

  public async getRfrRates(uuid : string, offset : number, size : number, from : string, to : string ): Promise<RfrRateMetaData> {
    return this.request<RfrRateMetaData>(this.base_url_rfr_rates + uuid + `?offset=${offset}&size=${size}&to=${to}&from=${from}`, {
      method: "GET",
    });
  }

  public async postRfrRate(payload: RfrPayload, uuid : string): Promise<RiskFreeRateShort> {
    return this.request<RiskFreeRateShort>(this.base_url_rfr_rates + uuid, {
      body: JSON.stringify(payload),
      method: "POST",
    });
  }

  public async patchRfrRate(payload: RfrPayload, uuid: string): Promise<RiskFreeRateShort> {
    return this.request<RiskFreeRateShort>(this.base_url_rfr_rates + uuid, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async delete(uuid: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_rfr_rates + uuid, {
      method: "DELETE",
    });
  }
}

export default RfrRatesService;