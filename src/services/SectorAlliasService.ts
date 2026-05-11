import type { SectorAllias, SectorAlliasPayload, SectorAlliasResponse } from "../payloads/SectorPayload";
import { BaseService } from "./BaseService";
import type { MessageResponse } from "../responses/ErrorResponse";

class SectorAlliasesService extends BaseService {
  private static instance: SectorAlliasesService;
  private readonly base_url_sector_allias = "/admin/sector-allias/"

  private constructor() {
    super();
  }

  public static getInstance(): SectorAlliasesService {
    if (!SectorAlliasesService.instance) {
      SectorAlliasesService.instance = new SectorAlliasesService();
    }
    return SectorAlliasesService.instance;
  }

  public async getSectorAllias(sector_uuid : string): Promise<SectorAlliasResponse> {
    return this.request<SectorAlliasResponse>(this.base_url_sector_allias + sector_uuid, {
      method: "GET",
    });
  }

  public async postSectorAllias(payload: SectorAlliasPayload, sector_uuid : string): Promise<SectorAllias> {
    return this.request<SectorAllias>(this.base_url_sector_allias + sector_uuid, {
      body: JSON.stringify(payload),
      method: "POST",
    });
  }

  public async patchSectorAllias(payload: SectorAlliasPayload, uuid : string): Promise<SectorAllias> {
    return this.request<SectorAllias>(this.base_url_sector_allias + uuid, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  public async delete(uuid: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(this.base_url_sector_allias + uuid, {
      method: "DELETE",
    });
  }
}

export default SectorAlliasesService;