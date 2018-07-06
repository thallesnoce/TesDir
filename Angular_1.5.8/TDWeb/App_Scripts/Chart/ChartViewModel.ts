module TesouroGraficosModule {
    export class ChartViewModel {
        public DateBuy: Date;
        public MinDate: Date = new Date(2016, 1, 1);
        public MaxDate: Date = new Date();
        public BondList: Array<Bond>;
        public IndicesList: Array<Indice>;
        public CompareMaturityBond: boolean = false;
        public HistoricalData: boolean = false;

        constructor() {
        }

        public CanShowComparation(): boolean {
            if (this.BondList) {
                var aux = this.BondList
                    .filter((item) => {
                        return item.Bond == "prefixado" && item.IsSelected() && !item.Cupom;
                    });
                return aux.length == 1;
            } else {
                return false;
            }
        }

        public SelectedBondNames(): string {
            if (this.BondList) {
                var bonds = this.BondList
                    .filter((item) => {
                        return item.IsSelected();
                    })
                    .map((item) => {
                        return item.ShortName
                    });
                return bonds.join(' - ');
            } else {
                return "";
            }
        }

        public OnlyWeekDays(date) {
            var day = date.getDay();
            return day !== 0 && day !== 6;
        }

        public LoadData() {
            var promisseCallBack = (resolve) => {
                var getIndice = () => {
                    return $.getJSON(DataServiceHelper.GetIndices(), (data) => {
                        this.IndicesList = data.map((item) => {
                            var indice = new Indice();
                            indice.Type = item.Type;
                            indice.IsSelected = item.IsSelected;
                            indice.File = item.File;
                            indice.Name = item.Name;
                            indice.DisplayName = item.DisplayName;

                            return indice;
                        });
                        resolve();
                    });
                };

                //var key = new Date().yyyymmdd() + "|bonds";
                //var sessionBondsList = sessionStorage.getItem(key);

                //if (sessionBondsList) {
                //    bondData = JSON.parse(sessionBondsList);
                //    resolve(bondData);
                //} else {
                //TODO: Colocar no sessionstorage
                var getBond = $.getJSON(DataServiceHelper.GetBondsList(), (data) => {
                    this.BondList = data.map((item) => {
                        var bond = new Bond();
                        bond.Id = item.Id;
                        bond.Bond = item.Bond;
                        bond.MaturityDate = moment(item.MaturityDate).toDate();
                        bond.Cupom = item.Cupom;
                        bond.File = item.File;
                        bond.Name = item.Name;
                        bond.ShortName = item.ShortName;
                        bond.IsPriceVisible = item.IsPriceVisible;
                        bond.IsPriceAvaregeVisible = item.IsPriceAvaregeVisible;
                        bond.IsTaxVisible = item.IsTaxVisible;
                        bond.IsTaxAvaregeVisible = item.IsTaxAvaregeVisible;
                        bond.Vencido = item.Vencido;
                        bond.StarDate = moment(item.StartDate).toDate();
                        return bond;
                    });
                });
                //}

                getBond.then(getIndice);
            };

            return new Promise(promisseCallBack);
        }
    }
}