import type { CountriesResponse, CountryNameResponse, CountryPayload } from "../payloads/CountryPayload";
import { BaseService } from "./BaseService";
import type { MessageResponse } from "../responses/ErrorResponse";

class CountriesService extends BaseService {
  private static instance: CountriesService;
  private readonly base_url_country = "/admin/country/"

  private constructor() {
    super();
  }

  public static getInstance(): CountriesService {
    if (!CountriesService.instance) {
      CountriesService.instance = new CountriesService();
    }
    return CountriesService.instance;
  }

  public async getCountries(): Promise<CountriesResponse> {
    return this.request<CountriesResponse>(this.base_url_country, {
      method: "GET",
    });
  }

  public async postCountries(payload: CountryPayload): Promise<CountryNameResponse> {
    return this.request<CountryNameResponse>(this.base_url_country, {
      body: JSON.stringify(payload),
      method: "POST",
    });
  }

  public async patchCountry(payload: CountryPayload, countryId : string): Promise<CountryNameResponse> {
    return this.request<CountryNameResponse>(this.base_url_country + countryId, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async delete(countryId: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_country + countryId, {
      method: "DELETE",
    });
  }
}

export default CountriesService;