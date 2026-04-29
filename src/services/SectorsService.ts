import type { SectorsResponse, SectorNameResponse, SectorPayload } from "../payloads/SectorPayload";
import { BaseService } from "./BaseService";
import type { MessageResponse } from "../responses/ErrorResponse";

class SectorsService extends BaseService {
  private static instance: SectorsService;
  private readonly base_url_sector = "/admin/sector/"

  private constructor() {
    super();
  }

  public static getInstance(): SectorsService {
    if (!SectorsService.instance) {
      SectorsService.instance = new SectorsService();
    }
    return SectorsService.instance;
  }

  public async getSectors(): Promise<SectorsResponse> {
    return this.request<SectorsResponse>(this.base_url_sector, {
      method: "GET",
    });
  }

  public async postSectors(payload: SectorPayload): Promise<SectorNameResponse> {
    return this.request<SectorNameResponse>(this.base_url_sector, {
      body: JSON.stringify(payload),
      method: "POST",
    });
  }

  public async patchSector(payload: SectorPayload, sectorId : string): Promise<SectorNameResponse> {
    return this.request<SectorNameResponse>(this.base_url_sector + sectorId, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async delete(sectorId: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_sector + sectorId, {
      method: "DELETE",
    });
  }
}

export default SectorsService;