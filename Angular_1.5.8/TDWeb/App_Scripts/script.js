var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class AboutController {
        constructor($scope) {
            this.$scope = $scope;
        }
    }
    TesouroGraficosModule.AboutController = AboutController;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class RouteConfig {
        constructor($routeProvider) {
            $routeProvider.caseInsensitiveMatch = true;
            $routeProvider
                .when('/home', {
                templateUrl: 'Pages/Chart.html',
                controller: 'ChartController',
                controllerAs: 'chartCtr'
            })
                .when('/titulo/:Bond/:Date', {
                templateUrl: 'Pages/Chart.html',
                controller: 'ChartController',
                controllerAs: 'chartCtr'
            })
                .when('/titulo/:Bond/:Date/:Cupom', {
                templateUrl: 'Pages/Chart.html',
                controller: 'ChartController',
                controllerAs: 'chartCtr'
            })
                .when('/titulo/vencido', {
                templateUrl: 'Pages/Chart.html',
                controller: 'ChartTitulosVencidoController',
                controllerAs: 'chartCtr'
            })
                .when('/titulo/vencido/:Bond/:Date', {
                templateUrl: 'Pages/Chart.html',
                controller: 'ChartTitulosVencidoController',
                controllerAs: 'chartCtr'
            })
                .when('/titulo/vencido/:Bond/:Date/:Cupom', {
                templateUrl: 'Pages/Chart.html',
                controller: 'ChartTitulosVencidoController',
                controllerAs: 'chartCtr'
            })
                .when('/sobre', {
                templateUrl: 'Pages/about.html',
                controller: 'AboutController'
            })
                .when('/contato', {
                templateUrl: 'Pages/contact.html',
                controller: 'ContactController'
            })
                .when('/indice/:Indice', {
                templateUrl: 'Pages/Indice.html',
                controller: 'IndiceController',
                controllerAs: 'IndiceCtr'
            })
                .otherwise({ redirectTo: '/home' });
        }
    }
    TesouroGraficosModule.RouteConfig = RouteConfig;
    class ThemeConfig {
        constructor($mdThemingProvider) {
            var customAccent = {
                '50': '#072d26',
                '100': '#0a4438',
                '200': '#0d5a4a',
                '300': '#10705d',
                '400': '#14866f',
                '500': '#179d82',
                '600': '#1dc9a6',
                '700': '#21dfb8',
                '800': '#37e2bf',
                '900': '#4ee5c7',
                'A100': '#1dc9a6',
                'A200': '#1AB394',
                'A400': '#179d82',
                'A700': '#64e8ce'
            };
            $mdThemingProvider
                .definePalette('customAccent', customAccent);
            $mdThemingProvider.theme('default')
                .primaryPalette('blue-grey')
                .accentPalette('customAccent');
        }
    }
    TesouroGraficosModule.ThemeConfig = ThemeConfig;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class FormatConfig {
        constructor($mdDateLocaleProvider) {
            $mdDateLocaleProvider.formatDate = function (date) {
                return date ? moment(date).format('DD/MM/YYYY') : '';
            };
            $mdDateLocaleProvider.parseDate = function (dateString) {
                if (dateString == null || dateString.length == 0) {
                    return null;
                }
                var m = moment(dateString, 'DD/MM/YYYY', true);
                return m.isValid() ? m.toDate() : new Date(NaN);
            };
        }
    }
    TesouroGraficosModule.FormatConfig = FormatConfig;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
var TypeIndice;
(function (TypeIndice) {
    TypeIndice[TypeIndice["Selic"] = 100] = "Selic";
})(TypeIndice || (TypeIndice = {}));
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class IndiceController {
        constructor($scope, $routeParams) {
            this.$scope = $scope;
            this.$routeParams = $routeParams;
            this.vm = new TesouroGraficosModule.IndiceViewModel();
            this.vm.Title = "Histórico Taxa Juros Selic";
            this.vm.SubTitle = "Dados Diários desde 01/07/1996";
            this.vm.Text = "A taxa SELIC (Sistema Especial de Liquidação e de Custódia) é um índice pelo qual as taxas de juros cobradas pelos bancos no Brasil se balizam. A taxa é uma ferramenta de política monetária utilizada pelo Banco Central do Brasil para atingir a meta das taxas de juros estabelecida pelo Comitê de Política Monetária (Copom).";
            this.chartHandler = new TesouroGraficosModule.ChartHandler('indice-container', 'Histórico Taxa Selic - Desde 1996');
            var indiceParam = this.$routeParams.Indice;
            if (indiceParam != undefined) {
                this.LoadData().then((data) => {
                    this.CreatSerie(data);
                    $scope.$apply();
                });
            }
        }
        CreatSerie(data) {
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
            };
            this.chartHandler.AddSerie(serieIndice);
            this.chartHandler.DisableAxi("axyPrice");
        }
        LoadData() {
            var promisseCallBack = (resolve) => {
                var dataList;
                var today = new Date();
                var key = `${today.yyyymmdd()}|selicFull`;
                var localBond = sessionStorage.getItem(key);
                if (localBond) {
                    dataList = JSON.parse(localBond);
                    resolve(dataList);
                }
                else {
                    $.getJSON(TesouroGraficosModule.DataServiceHelper.GetSelicFull(), (data) => {
                        dataList = data.map((item) => {
                            return [item.Date, item.Value];
                        });
                        resolve(dataList);
                    });
                }
            };
            return new Promise(promisseCallBack);
        }
    }
    TesouroGraficosModule.IndiceController = IndiceController;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class ChartTitulosVencidoController {
        constructor($scope, $routeParams) {
            this.$scope = $scope;
            this.$routeParams = $routeParams;
            this.vm = new TesouroGraficosModule.ChartViewModel();
            this.titlePage = "Gráfico de preços e taxas dos títulos vencidos do Tesouro Direto";
            this.chartHandler = new TesouroGraficosModule.ChartHandler('chart-container', 'Gráfico dos Títulos Vencidos do Tesouro Direto');
            var argBondName = this.$routeParams.Bond;
            var argBondDate = this.$routeParams.Date;
            var argCupom = this.$routeParams.Cupom;
            this.vm.LoadData().then(() => {
                var bonds = this.vm.BondList.filter(x => { return x.Vencido; }).sort((a, b) => a.Name < b.Name ? -1 : 1);
                this.vm.BondList = bonds;
                this.chartHandler.SetBondList(this.vm.BondList);
                this.chartHandler.SetIndiceList(this.vm.IndicesList);
                this.chartHandler.Init();
                var bond = this.chartHandler.GetBondByNameMaturityDate("prefixado", new Date("2010-01-01"), false);
                if (argBondName != undefined && argBondDate != undefined) {
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
                    this.chartHandler.LoadBond(bond).then(() => {
                        this.setStatus(bond);
                    });
                }
                else {
                    bond.IsTaxVisible = bond.IsTaxAvaregeVisible = bond.IsPriceVisible = bond.IsPriceAvaregeVisible = true;
                    this.chartHandler.LoadBond(bond);
                }
                $scope.$apply();
            });
            $("#boxes-chart").hide();
        }
        OpenChart(bondId) {
            var activedBonds = this.chartHandler.GetActivedBonds();
            var bond = this.chartHandler.GetBondById(bondId);
            if (activedBonds.length >= 3 && !bond.IsSelected()) {
                return;
            }
            bond.IsTaxVisible = bond.IsTaxAvaregeVisible = bond.IsPriceVisible = bond.IsPriceAvaregeVisible = !bond.IsSelected();
            if (activedBonds.length >= 1) {
                this.vm.CompareMaturityBond = false;
                this.vm.DateBuy = null;
            }
            this.chartHandler.LoadBond(bond);
        }
        setStatus(bond) {
            var bondNames = this.vm.SelectedBondNames().length > 0 ? `${this.vm.SelectedBondNames()} -` : "";
            document.title = `${bondNames} ${this.titlePage}`;
        }
        OpenIndice(indiceId, showIndice) {
            this.chartHandler.LoadIndice(TypeIndice.Selic, showIndice);
        }
        UpdateDateBuy() {
            this.chartHandler.SetLinearPrice(this.vm.DateBuy, this.vm.CompareMaturityBond);
        }
        CompareWithMaturityBond() {
            var linearPromise = this.chartHandler.SetLinearPrice(this.vm.DateBuy, this.vm.CompareMaturityBond);
            linearPromise.then((linearData) => {
                debugger;
                this.vm.DateBuy = this.vm.MinDate = linearData.StartDate;
            });
        }
    }
    TesouroGraficosModule.ChartTitulosVencidoController = ChartTitulosVencidoController;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class ChartAngularModule {
    }
    ChartAngularModule.TesouroGragicosApp = angular.module('TesouroGragicosApp', ['ngMaterial', 'ngMessages', 'ngRoute']);
    TesouroGraficosModule.ChartAngularModule = ChartAngularModule;
    class ChartController {
        constructor($scope, $routeParams) {
            this.$scope = $scope;
            this.$routeParams = $routeParams;
            this.vm = new TesouroGraficosModule.ChartViewModel();
            this.titlePage = "Gráfico de preços e taxas dos títulos do Tesouro Direto";
            this.chartHandler = new TesouroGraficosModule.ChartHandler('chart-container', 'Gráfico dos Títulos do Tesouro Direto');
            var argBondName = this.$routeParams.Bond;
            var argBondDate = this.$routeParams.Date;
            var argCupom = this.$routeParams.Cupom;
            this.vm.LoadData().then(() => {
                var bonds = this.vm.BondList.filter(x => { return !x.Vencido; }).sort((a, b) => a.Name < b.Name ? -1 : 1);
                this.vm.BondList = bonds;
                this.chartHandler.SetBondList(this.vm.BondList);
                this.chartHandler.SetIndiceList(this.vm.IndicesList);
                this.chartHandler.Init();
                var bond = this.chartHandler.GetBondByNameMaturityDate("prefixado", new Date("2023-01-01"), false);
                if (argBondName != undefined && argBondDate != undefined) {
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
                    this.chartHandler.LoadBond(bond).then(() => {
                        this.setStatus(bond);
                    });
                }
                else {
                    bond.IsTaxVisible = bond.IsTaxAvaregeVisible = bond.IsPriceVisible = bond.IsPriceAvaregeVisible = true;
                    this.chartHandler.LoadBond(bond);
                }
                $scope.$apply();
            });
            $scope.$on('$viewContentLoaded', function () {
                $(".md-datepicker-input").mask('00/00/0000');
            });
        }
        OpenChart(bondId) {
            var activedBonds = this.chartHandler.GetActivedBonds();
            var bond = this.chartHandler.GetBondById(bondId);
            if (activedBonds.length >= 3 && !bond.IsSelected()) {
                return;
            }
            bond.IsTaxVisible = bond.IsTaxAvaregeVisible = bond.IsPriceVisible = bond.IsPriceAvaregeVisible = !bond.IsSelected();
            if (activedBonds.length >= 1) {
                this.vm.CompareMaturityBond = false;
                this.vm.DateBuy = null;
            }
            this.chartHandler.LoadBond(bond);
        }
        setStatus(bond) {
            var bondNames = this.vm.SelectedBondNames().length > 0 ? `${this.vm.SelectedBondNames()} -` : "";
            document.title = `${bondNames} ${this.titlePage}`;
        }
        OpenIndice(indiceId, showIndice) {
            this.chartHandler.LoadIndice(TypeIndice.Selic, showIndice);
        }
        UpdateDateBuy() {
            this.chartHandler.SetLinearPrice(this.vm.DateBuy, this.vm.CompareMaturityBond);
        }
        CompareWithMaturityBond() {
            var linearPromise = this.chartHandler.SetLinearPrice(this.vm.DateBuy, this.vm.CompareMaturityBond);
            linearPromise.then((linearData) => {
                debugger;
                this.vm.DateBuy = this.vm.MinDate = linearData.StartDate;
            });
        }
    }
    TesouroGraficosModule.ChartController = ChartController;
    ChartAngularModule.TesouroGragicosApp
        .controller('ChartController', ['$scope', '$routeParams', ChartController]);
    ChartAngularModule.TesouroGragicosApp
        .controller('AboutController', ['$scope', TesouroGraficosModule.AboutController]);
    ChartAngularModule.TesouroGragicosApp
        .controller('ContactController', ['$scope', TesouroGraficosModule.ContactController]);
    ChartAngularModule.TesouroGragicosApp
        .controller('IndiceController', ['$scope', '$routeParams', TesouroGraficosModule.IndiceController]);
    ChartAngularModule.TesouroGragicosApp
        .controller('ChartTitulosVencidoController', ['$scope', '$routeParams', TesouroGraficosModule.ChartTitulosVencidoController]);
    ChartAngularModule.TesouroGragicosApp
        .config(['$routeProvider', TesouroGraficosModule.RouteConfig]);
    ChartAngularModule.TesouroGragicosApp
        .config(['$mdDateLocaleProvider', TesouroGraficosModule.FormatConfig]);
    ChartAngularModule.TesouroGragicosApp
        .config(["$mdThemingProvider", TesouroGraficosModule.ThemeConfig]);
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class ChartHandler {
        constructor(renderTo, titulo) {
            this.titulo = titulo;
            this.createChart = (renderTo) => {
                var highStockOption = {
                    chart: {
                        zoomType: 'x',
                        renderTo: ''
                    },
                    title: {
                        text: this.titulo
                    },
                    rangeSelector: {
                        selected: 4,
                        buttons: [{
                                type: 'month',
                                count: 1,
                                text: '1 mês'
                            },
                            {
                                type: 'month',
                                count: 3,
                                text: '3 meses'
                            },
                            {
                                type: 'month',
                                count: 6,
                                text: '6 meses'
                            }, {
                                type: 'ytd',
                                text: 'YTD'
                            }, {
                                type: 'year',
                                count: 1,
                                text: '1 ano'
                            }, {
                                type: 'all',
                                text: 'tudo'
                            }],
                        buttonTheme: {
                            width: 60
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: { day: '%d.%m.%y', week: '%d.%m.%y', month: '%d.%m.%y', year: '%d.%m.%y' }
                    },
                    yAxis: [{
                            id: "axyValue",
                            labels: {
                                format: '{value} %',
                                style: {
                                    color: Highcharts.getOptions().colors[2]
                                }
                            },
                            tickPixelInterval: 35,
                            title: {
                                text: 'Taxa',
                                style: {
                                    color: Highcharts.getOptions().colors[2]
                                }
                            },
                            opposite: false
                        }, {
                            id: "axyPrice",
                            tickPixelInterval: 35,
                            gridLineWidth: 0,
                            title: {
                                text: 'Preço',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: 'R$ {value}',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            }
                        }],
                    tooltip: {
                        shared: true,
                        valueDecimals: 2
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        x: 120,
                        verticalAlign: 'top',
                        y: 100,
                        floating: true,
                        backgroundColor: '#FFFFFF'
                    }
                };
                var container = $("#" + renderTo);
                container.highcharts('StockChart', highStockOption);
                this._chart = container.highcharts();
            };
            this.LoadBond = (bond) => {
                this.checkSelectedBonds();
                var bondPromisse = this.getBondData(bond);
                var startDate;
                return bondPromisse.then((bondData) => {
                    startDate = bondData.Taxs[0][0];
                    var taxSerie = this._chart.get(bond.TaxKey());
                    if (bond.IsTaxVisible && taxSerie == null) {
                        this.createTaxaSerie(bondData, bond.TaxKey(), bond.ShortName);
                    }
                    else {
                        this.SetSerieVisibility(bond.TaxKey(), bond.IsTaxVisible);
                    }
                    var priceSerie = this._chart.get(bond.PriceKey());
                    if (bond.IsPriceVisible && priceSerie == null) {
                        this.createPriceSerie(bondData, bond.PriceKey(), bond.ShortName);
                    }
                    else {
                        this.SetSerieVisibility(bond.PriceKey(), bond.IsPriceVisible);
                    }
                    if (bond.IsTaxAvaregeVisible) {
                        this._chart.addSeries({
                            name: 'Média Móvel 15-dias Taxa' + bond.ShortName,
                            id: bond.TaxKeyMm(),
                            linkedTo: bond.TaxKey(),
                            showInLegend: true,
                            type: 'trendline',
                            algorithm: 'SMA',
                            periods: 15,
                            yAxis: 0
                        }, false);
                    }
                    else {
                        this.SetSerieVisibility(bond.TaxKeyMm(), bond.IsTaxAvaregeVisible);
                    }
                    if (bond.IsPriceAvaregeVisible) {
                        this._chart.addSeries({
                            name: 'Média Móvel 15-dias Preço' + bond.ShortName,
                            id: bond.PriceKeyMm(),
                            linkedTo: bond.PriceKey(),
                            showInLegend: true,
                            type: 'trendline',
                            algorithm: 'SMA',
                            periods: 15,
                            yAxis: 1
                        }, false);
                        var aux = this._chart.series;
                    }
                    else {
                        this.SetSerieVisibility(bond.PriceKeyMm(), bond.IsPriceAvaregeVisible);
                    }
                }).then(() => {
                    this._indicesList.forEach((item) => {
                        if (item.IsSelected) {
                            var indice = this._chart.series.filter((indi) => {
                                return indi.options.id == item.IndiceKey();
                            })[0];
                            var promiseIndice = this.getIndiceData(item, startDate);
                            promiseIndice.then((data) => {
                                indice.setData(data);
                            });
                        }
                    });
                    this._chart.redraw();
                });
            };
            this.GetBondByNameMaturityDate = (bondName, maturityDate, cupom) => {
                var selectedBond = this._bondList.filter((item) => {
                    return item.Bond === bondName && item.MaturityDate.valueOf() === maturityDate.valueOf() && item.Cupom == cupom;
                })[0];
                return selectedBond;
            };
            this.GetBondById = (bondId) => {
                var selectedBond = this._bondList.filter((item) => {
                    return item.Id === bondId;
                })[0];
                return selectedBond;
            };
            this.createChart(renderTo);
            this.setLocalization();
        }
        Init() {
            this.checkVisibility();
        }
        SetBondList(bondList) {
            this._bondList = bondList;
        }
        SetIndiceList(indicesList) {
            this._indicesList = indicesList;
        }
        checkSelectedBonds() {
            var selectedBond = this._bondList.filter((item) => {
                return item.IsSelected();
            });
            if (selectedBond.length > 1) {
                this.SetSerieVisibility("linearserie", false);
                selectedBond.forEach((item) => {
                    item.IsPriceAvaregeVisible = false;
                    item.IsTaxAvaregeVisible = false;
                    this.SetSerieVisibility(item.PriceKeyMm(), item.IsPriceAvaregeVisible);
                    this.SetSerieVisibility(item.TaxKeyMm(), item.IsTaxAvaregeVisible);
                });
            }
        }
        createTaxaSerie(bondData, taxKey, shortName) {
            this._chart.addSeries({
                name: "Taxa " + shortName,
                type: 'spline',
                id: taxKey,
                data: bondData.Taxs,
                yAxis: 0,
                marker: {
                    enabled: true,
                    radius: 2
                },
                tooltip: {
                    valueSuffix: ' %'
                }
            }, false);
        }
        createPriceSerie(bondData, priceKey, shortName) {
            this._chart.addSeries({
                name: "Preço " + shortName,
                type: 'spline',
                id: priceKey,
                data: bondData.Prices,
                yAxis: 1,
                marker: {
                    enabled: true,
                    radius: 2
                },
                tooltip: {
                    valuePrefix: 'R$ '
                }
            }, false);
        }
        LoadIndice(indiceId, showIndice) {
            var indice = this._indicesList.filter((item) => { return item.Type == indiceId; })[0];
            var selectedBond = this._bondList.filter((item) => { return item.IsSelected(); })[0];
            var startDate = selectedBond ? selectedBond.StarDate.valueOf() : null;
            var promisseIndice = this.getIndiceData(indice, startDate);
            promisseIndice.then((data) => {
                indice.IsSelected = showIndice;
                var indiceSerie = this._chart.get(indice.IndiceKey());
                if (indice.IsSelected && indiceSerie == null) {
                    this._chart.addSeries({
                        id: indice.IndiceKey(),
                        name: indice.DisplayName,
                        type: 'spline',
                        data: data,
                        yAxis: 0,
                        tooltip: {
                            valueSuffix: ' %',
                            shared: false
                        }
                    }, false);
                }
                else {
                    this.SetSerieVisibility(indice.IndiceKey(), indice.IsSelected);
                }
                this._chart.redraw();
            });
        }
        getBondData(bond) {
            var promisseCallback = (resolve) => {
                var bondData = new TesouroGraficosModule.BondPrice();
                var key = bond.BondKey();
                var localBond = sessionStorage.getItem(key);
                if (localBond) {
                    bondData = JSON.parse(localBond);
                    resolve(bondData);
                }
                else {
                    debugger;
                    $.getJSON(TesouroGraficosModule.DataServiceHelper.GetFullUrl(bond.File), (data) => {
                        var taxs = data.map((item) => {
                            return [item.TimeStamp, item.TxCompra];
                        });
                        var bondPrices = data.map((item) => {
                            return [item.TimeStamp, item.PuCompra];
                        });
                        bondData.BondId = bond.Id;
                        bondData.Prices = bondPrices;
                        bondData.Taxs = taxs;
                        var bondStringfy = JSON.stringify(bondData);
                        sessionStorage.setItem(key, bondStringfy);
                        resolve(bondData);
                    });
                }
            };
            return new Promise(promisseCallback);
        }
        getIndiceData(indice, startDate = null) {
            var promisseCallBack = (resolve) => {
                var dataList;
                var key = indice.IndiceKey();
                var url = `${indice.File}.json`;
                var localBond = sessionStorage.getItem(key);
                if (localBond) {
                    dataList = JSON.parse(localBond);
                    dataList = this.filterData(dataList, startDate);
                    resolve(dataList);
                }
                else {
                    $.getJSON(TesouroGraficosModule.DataServiceHelper.GetFullUrl(url), (data) => {
                        dataList = data.map((item) => {
                            return [item.Date, item.Value];
                        });
                        var indiceStringfied = JSON.stringify(dataList);
                        sessionStorage.setItem(key, indiceStringfied);
                        dataList = this.filterData(dataList, startDate);
                        resolve(dataList);
                    });
                }
            };
            return new Promise(promisseCallBack);
        }
        filterData(data, startDate) {
            if (startDate) {
                return data.filter((item) => {
                    return item[0] >= startDate;
                });
            }
            else {
                return data;
            }
        }
        SetLinearPrice(bondBuyDate, showLinearPrice) {
            var linearSerieId = "linearserie";
            var serie = this._chart.series.filter((item) => {
                return item.options.id == linearSerieId;
            })[0];
            if (!showLinearPrice) {
                if (serie) {
                    serie.setVisible(showLinearPrice, false);
                }
            }
            else {
                var bond = this._bondList.filter((item) => {
                    return item.IsSelected();
                })[0];
                var bondPromisse = this.getBondData(bond);
                return bondPromisse.then((bondData) => {
                    var firstDateSerie = new Date(bondData.Prices[0][0]);
                    if (bondBuyDate == null || bondBuyDate.valueOf() < firstDateSerie.valueOf()) {
                        bondBuyDate = firstDateSerie;
                    }
                    bond.IsPriceAvaregeVisible = false;
                    bond.IsTaxAvaregeVisible = false;
                    this.SetSerieVisibility(bond.PriceKeyMm(), false);
                    this.SetSerieVisibility(bond.TaxKey(), false);
                    var priceList = bondData.Prices.filter((item) => {
                        return item[0] >= bondBuyDate.valueOf();
                    });
                    var firstPrecoCompra = priceList[0][1];
                    var diff = bond.MaturityDate.valueOf() - bondBuyDate.valueOf();
                    var mrDays = diff / 1000 / 60 / 60 / 24;
                    var weekendsDays = (mrDays / 7) * 2;
                    var workingDays = mrDays - weekendsDays;
                    var razao = (1000 - firstPrecoCompra) / workingDays;
                    var linearPriceList = new Array();
                    priceList.forEach((item, idx) => {
                        var precoLinearItem;
                        if (linearPriceList.length == 0) {
                            precoLinearItem = firstPrecoCompra;
                        }
                        else {
                            precoLinearItem = linearPriceList[idx - 1][1] + razao;
                        }
                        linearPriceList.push([item[0], precoLinearItem]);
                    });
                    if (serie == null || serie == undefined) {
                        this._chart.addSeries({
                            id: linearSerieId,
                            name: "Preço Linear",
                            type: 'spline',
                            data: linearPriceList,
                            yAxis: 1,
                            tooltip: {
                                valuePrefix: 'R$ ',
                                shared: false
                            }
                        }, false);
                    }
                    else {
                        serie.setData(linearPriceList, false);
                        serie.setVisible(showLinearPrice, false);
                    }
                    this._chart.redraw();
                    var linearCalc = new TesouroGraficosModule.LinearPrice();
                    linearCalc.StartDate = firstDateSerie;
                    return linearCalc;
                });
            }
        }
        GetActivedBonds() {
            var selectedBond = this._bondList.filter((item) => {
                return item.IsSelected();
            });
            return selectedBond;
        }
        AddSerie(serie) {
            this._chart.addSeries(serie, true);
            this._chart.xAxis[0].setExtremes(0);
        }
        DisableAxi(AxiId) {
            this._chart.get(AxiId).remove();
        }
        SetSerieVisibility(serieKey, show) {
            var serie = this._chart.series
                .filter((item) => {
                return item.options.id == serieKey;
            })[0];
            if (serie) {
                serie.setVisible(show, false);
            }
        }
        checkVisibility() {
            this._bondList.forEach((item) => {
                if (item.IsSelected()) {
                    this.LoadBond(item);
                }
                else {
                    var taxKey = `taxaserieid${item.Id}`;
                    var priceKey = `precoserieid${item.Id}`;
                    this.SetSerieVisibility(taxKey, false);
                    this.SetSerieVisibility(priceKey, false);
                }
            });
            this._indicesList.forEach((item) => {
                if (item.IsSelected) {
                    this.LoadIndice(item.Type, item.IsSelected);
                }
                else {
                    this.SetSerieVisibility(item.IndiceKey(), false);
                }
            });
        }
        setLocalization() {
            var langOptions = {
                decimalPoint: ',',
                thousandsSep: '.',
                contextButtonTitle: 'Imprimir/Baixar gráfico.',
                printChart: 'Imprimir',
                downloadPNG: 'Exportar para PNG',
                downloadJPEG: 'Exportar para JPEG',
                downloadPDF: 'Exportar para PDF',
                downloadSVG: 'Exportar para SVG',
                resetZoom: 'Reset Zoom',
                resetZoomTitle: '',
                months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                weekdays: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
            };
            Highcharts.setOptions({
                global: {
                    useUTC: false
                },
                lang: langOptions
            });
        }
    }
    TesouroGraficosModule.ChartHandler = ChartHandler;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class ChartViewModel {
        constructor() {
            this.MinDate = new Date(2016, 1, 1);
            this.MaxDate = new Date();
            this.CompareMaturityBond = false;
            this.HistoricalData = false;
        }
        CanShowComparation() {
            if (this.BondList) {
                var aux = this.BondList
                    .filter((item) => {
                    return item.Bond == "prefixado" && item.IsSelected() && !item.Cupom;
                });
                return aux.length == 1;
            }
            else {
                return false;
            }
        }
        SelectedBondNames() {
            if (this.BondList) {
                var bonds = this.BondList
                    .filter((item) => {
                    return item.IsSelected();
                })
                    .map((item) => {
                    return item.ShortName;
                });
                return bonds.join(' - ');
            }
            else {
                return "";
            }
        }
        OnlyWeekDays(date) {
            var day = date.getDay();
            return day !== 0 && day !== 6;
        }
        LoadData() {
            var promisseCallBack = (resolve) => {
                var getIndice = () => {
                    return $.getJSON(TesouroGraficosModule.DataServiceHelper.GetIndices(), (data) => {
                        this.IndicesList = data.map((item) => {
                            var indice = new TesouroGraficosModule.Indice();
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
                var getBond = $.getJSON(TesouroGraficosModule.DataServiceHelper.GetBondsList(), (data) => {
                    this.BondList = data.map((item) => {
                        var bond = new TesouroGraficosModule.Bond();
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
                getBond.then(getIndice);
            };
            return new Promise(promisseCallBack);
        }
    }
    TesouroGraficosModule.ChartViewModel = ChartViewModel;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class ContactController {
        constructor($scope) {
            this.$scope = $scope;
        }
    }
    TesouroGraficosModule.ContactController = ContactController;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class DataServiceHelper {
        static GetDefaultUrl() {
            return window.location.origin + "/";
        }
        static GetBondsList() {
            return DataServiceHelper.GetDefaultUrl() + "App_Repo/Bonds.json";
        }
        static GetIndices() {
            return DataServiceHelper.GetDefaultUrl() + "App_Repo/Indices.json";
        }
        static GetSelicFull() {
            return DataServiceHelper.GetDefaultUrl() + "App_Repo/Selic_full.json";
        }
        static GetFullUrl(bondFile) {
            return DataServiceHelper.GetDefaultUrl() + bondFile;
        }
    }
    TesouroGraficosModule.DataServiceHelper = DataServiceHelper;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class Bond {
        constructor() { }
        IsSelected() {
            var aux = this.IsPriceVisible || this.IsPriceAvaregeVisible || this.IsTaxVisible || this.IsTaxAvaregeVisible;
            return aux;
        }
        BondUrl() {
            var vencido = this.Vencido ? "/vencido" : "";
            if (!this.Cupom) {
                return `${TesouroGraficosModule.DataServiceHelper.GetDefaultUrl()}#/titulo${vencido}/${this.Bond}/${this.MaturityDate.ddmmyyyy()}`;
            }
            else {
                return `${TesouroGraficosModule.DataServiceHelper.GetDefaultUrl()}#/titulo${vencido}/${this.Bond}/${this.MaturityDate.ddmmyyyy()}/cupom-de-juros`;
            }
        }
        BondKey() { return `${new Date().yyyymmdd()}|${this.Id}`; }
        ;
        TaxKey() { return `taxaserieid${this.Id}`; }
        TaxKeyMm() { return `mmtaxaserieid${this.Id}`; }
        PriceKey() { return `precoserieid${this.Id}`; }
        PriceKeyMm() { return `mmprecoserieid${this.Id}`; }
    }
    TesouroGraficosModule.Bond = Bond;
    class BondPrice {
    }
    TesouroGraficosModule.BondPrice = BondPrice;
    class Indice {
        IndiceUrl() {
            return `${TesouroGraficosModule.DataServiceHelper.GetDefaultUrl()}#/indice/${this.Name}`;
        }
        IndiceKey() { return `${new Date().yyyymmdd()}|${this.Type}`; }
        ;
    }
    TesouroGraficosModule.Indice = Indice;
    class LinearPrice {
    }
    TesouroGraficosModule.LinearPrice = LinearPrice;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    class IndiceViewModel {
    }
    TesouroGraficosModule.IndiceViewModel = IndiceViewModel;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
Date.prototype.yyyymmdd = function () {
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return [this.getFullYear(), mm.length === 2 ? '' : '0', mm, dd.length === 2 ? '' : '0', dd].join('');
};
Date.prototype.ddmmyyyy = function () {
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return [dd.length === 2 ? '' : '0', dd, mm.length === 2 ? '' : '0', mm, this.getFullYear()].join('');
};
//# sourceMappingURL=script.js.map