export class WeatherModel {
    temperature: string; // 16.7 °C
    windSpeed: string; // 1.2 m/s
    windDirection: string; // 167° Süd
    chill: string; // not available
    provider: string; // Klimastation Ernst-Abbe-Hochschule
    code: string; // FAIR_DAY
    backgroundId: number; // 4
    iconId: number; // 9

    constructor(options: any) {
        this.temperature = options.temperature;
        this.windSpeed = options.windSpeed;
        this.windDirection = options.windDirection;
        this.provider = options.provider;
    }
}

