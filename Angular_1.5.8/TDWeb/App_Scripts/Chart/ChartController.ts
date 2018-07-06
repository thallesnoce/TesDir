/// <reference path="../Features/routeconfig.ts" />
/// <reference path="../Features/formatconfig.ts" />
/// <reference path="../Interfaces/interfaces.ts" />
/// <reference path="../indice/indicecontroller.ts" />
/// <reference path="charttitulosvencidocontroller.ts" />

module TesouroGraficosModule {
    export class ChartAngularModule {
        static TesouroGragicosApp = angular.module('TesouroGragicosApp', ['ngMaterial', 'ngMessages', 'ngRoute']);
    }

    export class ChartController {
        public vm: ChartViewModel = new ChartViewModel();
        private chartHandler: ChartHandler;
        private titlePage: string = "Gráfico de preços e taxas dos títulos do Tesouro Direto";

        constructor(private $scope: ng.IScope, private $routeParams: IBondRouteParams) {
            this.chartHandler = new ChartHandler('chart-container', 'Gráfico dos Títulos do Tesouro Direto');
            var argBondName = this.$routeParams.Bond;
            var argBondDate = this.$routeParams.Date;
            var argCupom = this.$routeParams.Cupom;

            this.vm.LoadData().then(() => {
                var bonds = this.vm.BondList.filter(x => { return !x.Vencido }).sort((a, b) => a.Name < b.Name ? -1 : 1);

                this.vm.BondList = bonds;
                this.chartHandler.SetBondList(this.vm.BondList);
                this.chartHandler.SetIndiceList(this.vm.IndicesList);
                this.chartHandler.Init();
                var bond = this.chartHandler.GetBondByNameMaturityDate("prefixado", new Date("2023-01-01"), false);

                if (argBondName != undefined && argBondDate != undefined) {
                    //TODO: mudar URL passando os parametros
                    var cupom = false;
                    var bondAux = null;
                    var bondDate2 = new Date(argBondDate);
                    var bondDate = moment(argBondDate, "DDMMYYYY");

                    if (argCupom != null && argCupom.toLowerCase() === "cupom-de-juros") {
                        cupom = true;
                    }

                    if (bondDate != null && !isNaN(bondDate.valueOf())) {
                        bondAux = this.chartHandler.GetBondByNameMaturityDate(argBondName, bondDate.toDate(), cupom);
                    }

                    if (bondAux != null) {
                        bond = bondAux;
                    }

                    bond.IsTaxVisible = bond.IsTaxAvaregeVisible = bond.IsPriceVisible = bond.IsPriceAvaregeVisible = true;
                    this.chartHandler.LoadBond(bond).then(
                        () => {
                            this.setStatus(bond);
                        });
                } else {
                    bond.IsTaxVisible = bond.IsTaxAvaregeVisible = bond.IsPriceVisible = bond.IsPriceAvaregeVisible = true;
                    this.chartHandler.LoadBond(bond);
                }
                $scope.$apply();
            });

            $scope.$on('$viewContentLoaded', function () {
                $(".md-datepicker-input").mask('00/00/0000');
            });
        }

        /* Comparison */
        public OpenChart(bondId) {
            var activedBonds = this.chartHandler.GetActivedBonds();
            var bond = this.chartHandler.GetBondById(bondId);

            if (activedBonds.length >= 3 && !bond.IsSelected()) {
                return;//TODO: Colocar uma toast message aqui
            }
            bond.IsTaxVisible = bond.IsTaxAvaregeVisible = bond.IsPriceVisible = bond.IsPriceAvaregeVisible = !bond.IsSelected();

            if (activedBonds.length >= 1) {
                this.vm.CompareMaturityBond = false;
                this.vm.DateBuy = null;
            }

            this.chartHandler.LoadBond(bond);
        }

        private setStatus(bond: Bond) {
            //history.pushState(null, null, bond.BondUrl());
            var bondNames = this.vm.SelectedBondNames().length > 0 ? `${this.vm.SelectedBondNames()} -` : "";
            document.title = `${bondNames} ${this.titlePage}`;
        }

        public OpenIndice(indiceId, showIndice) {
            this.chartHandler.LoadIndice(TypeIndice.Selic, showIndice);
        }

        /* Comparison */
        public UpdateDateBuy() {
            this.chartHandler.SetLinearPrice(this.vm.DateBuy, this.vm.CompareMaturityBond);
        }

        public CompareWithMaturityBond() {
            var linearPromise = this.chartHandler.SetLinearPrice(this.vm.DateBuy, this.vm.CompareMaturityBond);
            linearPromise.then((linearData: LinearPrice) => {
                debugger;
                this.vm.DateBuy = this.vm.MinDate = linearData.StartDate;
            });
        }

        ///* Historical Data */
        //public HistoricalDataChange() {
        //    this.chartHandler.SetHistoricalData(this.vm.HistoricalData);
        //}
    }

    ChartAngularModule.TesouroGragicosApp
        .controller('ChartController', ['$scope', '$routeParams', ChartController]);

    ChartAngularModule.TesouroGragicosApp
        .controller('AboutController', ['$scope', AboutController]);

    ChartAngularModule.TesouroGragicosApp
        .controller('ContactController', ['$scope', ContactController]);

    ChartAngularModule.TesouroGragicosApp
        .controller('IndiceController', ['$scope', '$routeParams', IndiceController]);

    ChartAngularModule.TesouroGragicosApp
        .controller('ChartTitulosVencidoController', ['$scope', '$routeParams', ChartTitulosVencidoController]);

    ChartAngularModule.TesouroGragicosApp
        .config(['$routeProvider', RouteConfig]);

    ChartAngularModule.TesouroGragicosApp
        .config(['$mdDateLocaleProvider', FormatConfig]);

    ChartAngularModule.TesouroGragicosApp
        .config(["$mdThemingProvider", ThemeConfig]);
}