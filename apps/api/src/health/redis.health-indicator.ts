import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from "@nestjs/terminus";
import Redis from "ioredis";

@Injectable()
export class RedisHealthIndicator extends HealthIndicator implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(configService: ConfigService) {
    super();
    this.client = new Redis(configService.get<string>("redis.url") as string, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      if (this.client.status !== "ready") {
        await this.client.connect();
      }
      await this.client.ping();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        "Redis check failed",
        this.getStatus(key, false, { message: (error as Error).message }),
      );
    }
  }

  onModuleDestroy(): void {
    this.client.disconnect();
  }
}
