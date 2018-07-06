/// <reference path="../interfaces/interfaces.ts" />
/// <reference path="../features/formatconfig.ts" />

module TesouroGraficosModule {
    export class IndiceController {
        public vm: IndiceViewModel = new IndiceViewModel();
        private chartHandler: ChartHandler;

        constructor(private $scope: ng.IScope, private $routeParams: IIndiceRouteParams) {
            this.vm.Title = "Histórico Taxa Juros Selic";
            this.vm.SubTitle = "Dados Diários desde 01/07/1996";
            this.vm.Text = "A taxa SELIC (Sistema Especial de Liquidação e de Custódia) é um índice pelo qual as taxas de juros cobradas pelos bancos no Brasil se balizam. A taxa é uma ferramenta de política monetária utilizada pelo Banco Central do Brasil para atingir a meta das taxas de juros estabelecida pelo Comitê de Política Monetária (Copom).";

            this.chartHandler = new ChartHandler('indice-container', 'Histórico Taxa Selic - Desde 1996');
            var indiceParam = this.$routeParams.Indice;
            if (indiceParam != undefined) {
                this.LoadData().then((data: any[][]) => {
                    this.CreatSerie(data);
                    $scope.$apply();
                });
            }
        }

        private CreatSerie(data: any[][]) {
            var serieIndice = {
                id: "selicFull",
                name: "Taxa Selic",
                type: 'spline',
                data: data,
                yAxis: 0,
                tooltip: {
                    valueSuffix: ' %',
                    shared: false
                }
            }

            this.chartHandler.AddSerie(serieIndice);                    

            //TODO: Escolher mudar o zoom ativo
            this.chartHandler.DisableAxi("axyPrice");

        }

        public LoadData() {
            var promisseCallBack = (resolve) => {
                var dataList: any[][];
                var today = new Date();
                var key = `${today.yyyymmdd()}|selicFull`;
                var localBond = sessionStorage.getItem(key);

                if (localBond) {
                    dataList = JSON.parse(localBond);
                    resolve(dataList);
                } else {
                    $.getJSON(DataServiceHelper.GetSelicFull(), (data) => {
                        dataList = data.map((item) => {
                            return [item.Date, item.Value];
                        });

                        //var indiceStringfied = JSON.stringify(dataList);
                        //sessionStorage.setItem(indice.IndiceKey(), indiceStringfied);
                        resolve(dataList);
                    });
                }
            };

            return new Promise(promisseCallBack);
        }
    }
}