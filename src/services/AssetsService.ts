import { BaseService } from "./BaseService";
import { AssetType, type AssetDatabaseModel, type AssetPatch, type AssetShort, type MetaDataAssets, type MetaDataAssetShort } from "../payloads/AssetPayload";
import type { MessageResponse } from "../responses/ErrorResponse";

class AssetsService extends BaseService {
  private static instance: AssetsService;
  private readonly base_url_assets = "/admin/assets/";

  public static getInstance(): AssetsService {
    if (!AssetsService.instance) {
      AssetsService.instance = new AssetsService();
    }
    return AssetsService.instance;
  }

  public async getAssets(search : string, limit : number, offset : number): Promise<MetaDataAssets> {
    return this.request<MetaDataAssets>(this.base_url_assets + `?search=${search}&limit=${limit}&offset=${offset}&type=${AssetType.STOCKS}`, { method: "GET" });
  }

  public async postAsset(payload: AssetDatabaseModel): Promise<AssetShort> {
    return this.request<AssetShort>(this.base_url_assets, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async patchAsset(payload: AssetDatabaseModel, uuid: string): Promise<AssetShort> {
    return this.request<AssetShort>(this.base_url_assets + uuid, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async delete(uuid: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_assets + uuid, {
      method: "DELETE",
    });
  }
}

export default AssetsService;