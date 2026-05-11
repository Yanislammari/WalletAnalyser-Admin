import { BaseService } from "./BaseService";
import type { EtfAssetMetaData, EtfconcentrationMetaData, EtfPatchAssetPayload, EtfPatchHoldingApi, EtfUpdateHolding } from "../payloads/EtfConcentrationPayload";
import type { MessageResponse } from "../responses/ErrorResponse";

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

  
  public async getExcelTemplate(): Promise<Blob> {
    return this.requestBlob(this.base_url_etf_concentrations + "excel-template", { method: "GET" });
  }

  public async postEtfConcentration(payload: EtfPatchHoldingApi, uuid: string): Promise<EtfUpdateHolding> {
    return this.request<EtfUpdateHolding>(this.base_url_etf_concentrations + "etf-assets/" + uuid, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async patchEtfConcentration(payload: EtfPatchAssetPayload, etf_uuid: string): Promise<EtfUpdateHolding> {
    return this.request<EtfUpdateHolding>(this.base_url_etf_concentrations + "etf-holdings/" + etf_uuid, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async patchAllEtfConcentration(payload : string, etf_uuid : string): Promise<EtfconcentrationMetaData> {
    return this.request<EtfconcentrationMetaData>(this.base_url_etf_concentrations + "etf-concentration/" + etf_uuid, {
      method: "PATCH",
      body: payload,
    });
  }

  public async delete(etf_holding_uuid : string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_etf_concentrations + `etf-assets/${etf_holding_uuid}`, {
      method: "DELETE",
    });
  }
}

export default EtfConcentrationService;