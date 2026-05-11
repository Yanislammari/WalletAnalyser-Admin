import type { CountryAllias, CountryAlliasPayload, CountryAlliasResponse } from "../payloads/CountryPayload";
import { BaseService } from "./BaseService";
import type { MessageResponse } from "../responses/ErrorResponse";

class CountryAlliasesService extends BaseService {
  private static instance: CountryAlliasesService;
  private readonly base_url_country_allias = "/admin/country-allias/"

  private constructor() {
    super();
  }

  public static getInstance(): CountryAlliasesService {
    if (!CountryAlliasesService.instance) {
      CountryAlliasesService.instance = new CountryAlliasesService();
    }
    return CountryAlliasesService.instance;
  }

  public async getCountryAllias(country_uuid : string): Promise<CountryAlliasResponse> {
    return this.request<CountryAlliasResponse>(this.base_url_country_allias + country_uuid, {
      method: "GET",
    });
  }

  public async postCountryAllias(payload: CountryAlliasPayload, country_uuid : string): Promise<CountryAllias> {
    return this.request<CountryAllias>(this.base_url_country_allias + country_uuid, {
      body: JSON.stringify(payload),
      method: "POST",
    });
  }

  public async patchCountryAllias(payload: CountryAlliasPayload, uuid : string): Promise<CountryAllias> {
    return this.request<CountryAllias>(this.base_url_country_allias + uuid, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async delete(uuid: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_country_allias + uuid, {
      method: "DELETE",
    });
  }
}

export default CountryAlliasesService;