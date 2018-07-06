/// <reference path="../Interfaces/interfaces.ts" />

module TesouroGraficosModule {
    export class Bond {
        constructor() { }

        Id: number;
        Bond: string;
        MaturityDate: Date;
        Name: string;
        ShortName: string;
        File: string;
        Cupom: boolean;
        Vencido: boolean;
        StarDate: Date;

        IsPriceVisible: boolean;
        IsPriceAvaregeVisible: boolean;
        IsTaxVisible: boolean;
        IsTaxAvaregeVisible: boolean;
        IsSelected() {
            var aux = this.IsPriceVisible || this.IsPriceAvaregeVisible || this.IsTaxVisible || this.IsTaxAvaregeVisible;
            return aux;
        }

        BondUrl() {
            var vencido = this.Vencido ? "/vencido" : "";

            if (!this.Cupom) {
                return `${DataServiceHelper.GetDefaultUrl()}#/titulo${vencido}/${this.Bond}/${this.MaturityDate.ddmmyyyy()}`;
            } else {
                return `${DataServiceHelper.GetDefaultUrl()}#/titulo${vencido}/${this.Bond}/${this.MaturityDate.ddmmyyyy()}/cupom-de-juros`;
            }
        }

        BondKey() { return `${new Date().yyyymmdd()}|${this.Id}` };

        TaxKey() { return `taxaserieid${this.Id}`; }
        TaxKeyMm() { return `mmtaxaserieid${this.Id}`; }
        PriceKey() { return `precoserieid${this.Id}`; }
        PriceKeyMm() { return `mmprecoserieid${this.Id}`; }
    }

    export class BondPrice {
        BondId: Number;
        Prices: any[][];
        Taxs: any[][];
    }

    export class Indice {
        Name: string;
        DisplayName: string;
        File: string;
        IsSelected: boolean;
        Type: TypeIndice;

        IndiceUrl() {
            return `${DataServiceHelper.GetDefaultUrl()}#/indice/${this.Name}`;
        }

        IndiceKey() { return `${new Date().yyyymmdd()}|${this.Type}` };
    }

    export class LinearPrice {
        StartDate: Date;
        WorkingDays: number;
    }
}