import { BaseService } from "./BaseService";
import type { ForexListMetaData, ForexMetaData, PatchForexPayload, PostForexPayload } from "../payloads/ForexPayload";

class ForexService extends BaseService {
  private static instance: ForexService;
  private readonly base_url_forex = "/admin/forex/";

  public static getInstance(): ForexService {
    if (!ForexService.instance) {
      ForexService.instance = new ForexService();
    }
    return ForexService.instance;
  }

  public async getExcelTemplate(): Promise<Blob> {
    return this.requestBlob(this.base_url_forex + "excel-template", { method: "GET" });
  }

  public async getForexItems(): Promise<ForexListMetaData> {
    return this.request<ForexListMetaData>(this.base_url_forex, { method: "GET" });
  }

  public async postForex(payload: PostForexPayload): Promise<ForexListMetaData> {
    const formData = new FormData();
    formData.append("file", payload.file);

    return this.request<ForexListMetaData>(this.base_url_forex, {
      method: "POST",
      body: formData,
    }, true);
  }

  public async patchForex(payload: PatchForexPayload, uuid: string): Promise<ForexMetaData> {
    return this.request<ForexMetaData>(this.base_url_forex + uuid, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async delete(uuid: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(this.base_url_forex + uuid, {
      method: "DELETE",
    });
  }
}

export default ForexService;
