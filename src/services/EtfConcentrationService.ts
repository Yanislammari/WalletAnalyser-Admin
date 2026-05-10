import { BaseService } from "./BaseService";
import type { EtfAssetMetaData, EtfconcentrationMetaData, EtfHoldingsAsset, EtfPatchAssetPayload } from "../payloads/EtfConcentrationPayload";

class EtfConcentrationService extends BaseService {
  private static instance: EtfConcentrationService;
  private readonly base_url_etf_concentrations = "/admin/assets/";

  private constructor() {
    super();
  }

  public static getInstance(): EtfConcentrationService {
    if (!EtfConcentrationService.instance) {
      EtfConcentrationService.instance = new EtfConcentrationService();
    }
    return EtfConcentrationService.instance;
  }

  public async getEtfDefault(uuid: string): Promise<EtfconcentrationMetaData> {
    return this.request<EtfconcentrationMetaData>(
      this.base_url_etf_concentrations+ "etf-holdings/" + uuid,
      { method: "GET" }
    );
  }

  public async getEtfOffset(uuid : string, search : string, offset : number, limit : number): Promise<EtfAssetMetaData>{
    return this.request<EtfAssetMetaData>(
      this.base_url_etf_concentrations+ "etf-assets/" + uuid + `?search=${search}&offset=${offset}&limit=${limit}`,
      { method: "GET" }
    );
  }

  /**public async postEtfConcentration(payload: EtfConcentrationPayload, uuid: string): Promise<EtfConcentrationShort> {
    return this.request<EtfConcentrationShort>(this.base_url_etf_concentrations + uuid, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }**/

  public async patchEtfConcentration(payload: EtfPatchAssetPayload, etf_uuid: string): Promise<EtfHoldingsAsset> {
    return this.request<EtfHoldingsAsset>(this.base_url_etf_concentrations + "etf-holdings/" + etf_uuid, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  /**public async delete(concentrationUuid: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_etf_concentrations + concentrationUuid, {
      method: "DELETE",
    });
  }**/
}

export default EtfConcentrationService;