import { BaseService } from "./BaseService";
import type { AssetPriceMetaData, AssetPriceShort, AssetPricePayload, AssetPriceMetaDataWithMessage } from "../payloads/AssetPricesPayload";
import type { MessageResponse } from "../responses/ErrorResponse";

class AssetPricesService extends BaseService {
  private static instance: AssetPricesService;
  private readonly base_url_asset_prices = "/admin/asset-prices/";

  private constructor() {
    super();
  }

  public static getInstance(): AssetPricesService {
    if (!AssetPricesService.instance) {
      AssetPricesService.instance = new AssetPricesService();
    }
    return AssetPricesService.instance;
  }

  public async getAssetPrices(uuid: string, offset: number, size: number, from: string, to: string): Promise<AssetPriceMetaData> {
    return this.request<AssetPriceMetaData>(
      this.base_url_asset_prices + uuid + `?offset=${offset}&size=${size}&from=${from}&to=${to}`,
      { method: "GET" }
    );
  }

  public async updatePricesFromExternalApi(uuid: string, offset: number, size: number, from: string, to: string): Promise<AssetPriceMetaDataWithMessage> {
    return this.request<AssetPriceMetaDataWithMessage>(
      this.base_url_asset_prices + uuid + `/price?offset=${offset}&size=${size}&from=${from}&to=${to}`,
      { method: "PATCH" }
    );
  }

  public async postAssetPrice(payload: AssetPricePayload, uuid: string): Promise<AssetPriceShort> {
    return this.request<AssetPriceShort>(this.base_url_asset_prices + uuid, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async patchAssetPrice(payload: AssetPricePayload, uuid: string): Promise<AssetPriceShort> {
    return this.request<AssetPriceShort>(this.base_url_asset_prices + uuid, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async delete(uuid: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_asset_prices + uuid, {
      method: "DELETE",
    });
  }
}

export default AssetPricesService;
