import type { PatchRfrCountryPayload, PostRfrCountryPayload, RfrCountriesResponse, RfrCountry, RfrCountryItemMetaData } from "../payloads/RfrCountryPayload";
import type { MessageResponse } from "../responses/ErrorResponse";
import { BaseService } from "./BaseService";
//import type { MessageResponse } from "../responses/ErrorResponse";

class RfrCountryService extends BaseService {
  private static instance: RfrCountryService;
  private readonly base_url_rfr_country = "/admin/rfr-country/";

  private constructor() {
    super();
  }

  public static getInstance(): RfrCountryService {
    if (!RfrCountryService.instance) {
      RfrCountryService.instance = new RfrCountryService();
    }
    return RfrCountryService.instance;
  }

  public async getExcelTemplate(): Promise<Blob> {
    return this.requestBlob(this.base_url_rfr_country + "excel-template",{ method : "GET"})
  }

  public async getRfrCountries(): Promise<RfrCountriesResponse> {
    return this.request<RfrCountriesResponse>(this.base_url_rfr_country, {
      method: "GET",
    });
  }

  public async postRfrCountry(payload: PostRfrCountryPayload): Promise<RfrCountryItemMetaData> {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("country_uuid", payload.country_uuid);

    return this.request<RfrCountryItemMetaData>(this.base_url_rfr_country, {
      method: "POST",
      body: formData,
    },true);
  }

  public async patchRfrCountry(payload: PatchRfrCountryPayload, uuid: string): Promise<RfrCountry> {
    return this.request<RfrCountry>(this.base_url_rfr_country + uuid, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async delete(uuid: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_rfr_country + uuid, {
      method: "DELETE",
    });
  }
}

export default RfrCountryService;