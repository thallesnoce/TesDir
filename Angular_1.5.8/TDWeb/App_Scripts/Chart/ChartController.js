/// <reference path="../routeconfig.ts" />
/// <reference path="../formatconfig.ts" />
/// <reference path="../interfaces.ts" />
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    var ChartAngularModule = (function () {
        function ChartAngularModule() {
        }
        ChartAngularModule.TesouroGragicosApp = angular.module('TesouroGragicosApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngRoute']);
        return ChartAngularModule;
    }());
    TesouroGraficosModule.ChartAngularModule = ChartAngularModule;
    var ChartController = (function () {
        function ChartController($scope, $routeParams) {
            this.$scope = $scope;
            this.$routeParams = $routeParams;
            this.vm = new TesouroGraficosModule.ChartViewModel();
            this.chartHandler = new TesouroGraficosModule.ChartHandler('chart-container', this.vm.BondList, this.vm.Indices);
            var argBondName = this.$routeParams.Bond;
            var argBondDate = this.$routeParams.Date;
            var argCupom = this.$routeParams.Cupom;
            var bond = this.chartHandler.GetBondById(5);
            if (argBondName != undefined && argBondDate != undefined) {
                //TODO: mudar URL passando os parametros
                var cupom = false;
                var bondAux = null;
                var bondDate = new Date(argBondDate);
                if (argCupom != null && argCupom.toLowerCase() === "cupom") {
                    cupom = true;
                }
                if (bondDate != null) {
                    bondAux = this.chartHandler.GetBondByNameMaturityDate(argBondName, bondDate, cupom);
                }
                if (bondAux != null) {
                    bond = bondAux;
                }
            }
            bond.IsTaxVisible = bond.IsTaxAvaregeVisible = bond.IsPriceVisible = bond.IsPriceAvaregeVisible = true;
            this.chartHandler.LoadBond(bond);
            $scope.$on('$viewContentLoaded', function () {
                $(".md-datepicker-input").mask('00/00/0000');
            });
        }
        /* Comparison */
        ChartController.prototype.OpenChart = function (bondId) {
            var activedBonds = this.chartHandler.GetActivedBonds();
            var bond = this.chartHandler.GetBondById(bondId);
            if (activedBonds.length >= 3 && !bond.IsSelected()) {
                return; //TODO: Colocar uma toast message aqui
            }
            bond.IsTaxVisible = bond.IsTaxAvaregeVisible = bond.IsPriceVisible = bond.IsPriceAvaregeVisible = !bond.IsSelected();
            if (activedBonds.length >= 1) {
                this.vm.CompareMaturityBond = false;
                this.vm.DateBuy = null;
            }
            this.chartHandler.LoadBond(bond);
        };
        ChartController.prototype.OpenIndice = function (indiceId, showIndice) {
            this.chartHandler.LoadIndice(TypeIndice.Selic, showIndice);
        };
        /* Comparison */
        ChartController.prototype.UpdateDateBuy = function () {
            debugger;
            this.chartHandler.SetLinearPrice(this.vm.DateBuy, this.vm.CompareMaturityBond);
        };
        ChartController.prototype.CompareWithMaturityBond = function () {
            this.vm.DateBuy = this.vm.MinDate = this.chartHandler.SetLinearPrice(this.vm.DateBuy, this.vm.CompareMaturityBond);
        };
        return ChartController;
    }());
    TesouroGraficosModule.ChartController = ChartController;
    ChartAngularModule.TesouroGragicosApp
        .controller('ChartController', ['$scope', '$routeParams', ChartController]);
    ChartAngularModule.TesouroGragicosApp
        .controller('AboutController', ['$scope', TesouroGraficosModule.AboutController]);
    ChartAngularModule.TesouroGragicosApp
        .controller('ContactController', ['$scope', TesouroGraficosModule.ContactController]);
    ChartAngularModule.TesouroGragicosApp
        .config(['$routeProvider', TesouroGraficosModule.RouteConfig]);
    ChartAngularModule.TesouroGragicosApp
        .config(['$mdDateLocaleProvider', TesouroGraficosModule.FormatConfig]);
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
//# sourceMappingURL=ChartController.js.map