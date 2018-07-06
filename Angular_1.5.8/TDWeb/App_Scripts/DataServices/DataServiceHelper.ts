module TesouroGraficosModule {
    export class DataServiceHelper {
        static GetDefaultUrl(): string {
            return window.location.origin + "/";
        }

        static GetBondsList(): string {
            return DataServiceHelper.GetDefaultUrl() + "App_Repo/Bonds.json";
        }

        static GetIndices(): string {
            return DataServiceHelper.GetDefaultUrl() + "App_Repo/Indices.json";
        }

        static GetSelicFull(): string {
            return DataServiceHelper.GetDefaultUrl() + "App_Repo/Selic_full.json";
        }

        static GetFullUrl(bondFile: string): string {
            return DataServiceHelper.GetDefaultUrl() + bondFile;
        }
    }
}