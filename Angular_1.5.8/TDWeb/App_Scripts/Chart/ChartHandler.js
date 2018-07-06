var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    var ChartHandler = (function () {
        function ChartHandler(renderTo, _bondList, _indicesList) {
            var _this = this;
            this._bondList = _bondList;
            this._indicesList = _indicesList;
            this.createChart = function (renderTo) {
                var highStockOption = {
                    chart: {
                        zoomType: 'x',
                        renderTo: ''
                    },
                    title: {
                        text: 'Gráficos Títulos Tesouro Direto'
                    },
                    rangeSelector: {
                        selected: 4
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: { day: '%d.%m.%y', week: '%d.%m.%y', month: '%d.%m.%y', year: '%d.%m.%y' }
                    },
                    yAxis: [{
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
                _this._chart = container.highcharts();
            };
            this.LoadBond = function (bond) {
                //TODO: Mais de uma serie, desabilitar as medias moveis e comparação da taxa contratada.
                _this.checkSelectedBonds();
                var bondData = _this.getBondData(bond);
                var taxSerie = _this._chart.get(bond.TaxKey());
                if (bond.IsTaxVisible && taxSerie == null) {
                    _this.createTaxaSerie(bondData, bond.TaxKey(), bond.ShortName);
                }
                else {
                    _this.SetSerieVisibility(bond.TaxKey(), bond.IsTaxVisible);
                }
                var priceSerie = _this._chart.get(bond.PriceKey());
                if (bond.IsPriceVisible && priceSerie == null) {
                    _this.createPriceSerie(bondData, bond.PriceKey(), bond.ShortName);
                }
                else {
                    _this.SetSerieVisibility(bond.PriceKey(), bond.IsPriceVisible);
                }
                var taxAvarege = _this._chart.get(bond.TaxKeyMm());
                if (bond.IsTaxAvaregeVisible && taxAvarege == null) {
                    _this._chart.addSeries({
                        name: '15-day Taxa',
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
                    _this.SetSerieVisibility(bond.TaxKeyMm(), bond.IsTaxAvaregeVisible);
                }
                var priceAvarege = _this._chart.get(bond.PriceKeyMm());
                if (bond.IsPriceAvaregeVisible && priceAvarege == null) {
                    _this._chart.addSeries({
                        name: '15-day Preço',
                        id: bond.PriceKeyMm(),
                        linkedTo: bond.PriceKey(),
                        showInLegend: true,
                        type: 'trendline',
                        algorithm: 'SMA',
                        periods: 15,
                        yAxis: 1
                    }, false);
                    var aux = _this._chart.series;
                }
                else {
                    _this.SetSerieVisibility(bond.PriceKeyMm(), bond.IsPriceAvaregeVisible);
                }
                _this._chart.redraw();
            };
            this.GetBondByNameMaturityDate = function (bondName, maturityDate, cupom) {
                var selectedBond = _this._bondList.filter(function (item) {
                    return item.Bond === bondName && item.MaturityDate.valueOf() === maturityDate.valueOf() && item.Cupom == cupom;
                })[0];
                return selectedBond;
            };
            this.GetBondById = function (bondId) {
                var selectedBond = _this._bondList.filter(function (item) {
                    return item.Id === bondId;
                })[0];
                return selectedBond;
            };
            this.createChart(renderTo);
            this.init();
            this.setLocalization();
        }
        ChartHandler.prototype.init = function () {
            this.checkVisibility();
        };
        ChartHandler.prototype.checkSelectedBonds = function () {
            var _this = this;
            var selectedBond = this._bondList.filter(function (item) {
                return item.IsSelected();
            });
            if (selectedBond.length > 1) {
                this.SetSerieVisibility("linearserie", false);
                selectedBond.forEach(function (item) {
                    item.IsPriceAvaregeVisible = false;
                    item.IsTaxAvaregeVisible = false;
                    _this.SetSerieVisibility(item.PriceKeyMm(), item.IsPriceAvaregeVisible);
                    _this.SetSerieVisibility(item.TaxKeyMm(), item.IsTaxAvaregeVisible);
                });
            }
        };
        ChartHandler.prototype.createTaxaSerie = function (bondData, taxKey, shortName) {
            //TODO: fixar cores Series
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
        };
        ChartHandler.prototype.createPriceSerie = function (bondData, priceKey, shortName) {
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
        };
        ChartHandler.prototype.LoadIndice = function (indiceId, showIndice) {
            var indice = this._indicesList.filter(function (item) { return item.Type == indiceId; })[0];
            var data = this.getIndiceData(indice);
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
        };
        ChartHandler.prototype.getBondData = function (bond) {
            var bondData = new TesouroGraficosModule.BondPrice();
            var localBond = sessionStorage.getItem(bond.BondKey());
            if (localBond) {
                bondData = JSON.parse(localBond);
            }
            else {
                //TODO:Check This
                $.ajaxSetup({
                    async: false
                });
                $.getJSON(TesouroGraficosModule.DataServiceHelper.GetFullUrl(bond.File), function (data) {
                    var taxs = data.map(function (item) {
                        return [item.TimeStamp, item.TxCompra];
                    });
                    var bondPrices = data.map(function (item) {
                        return [item.TimeStamp, item.PuCompra];
                    });
                    bondData.BondId = bond.Id;
                    bondData.Prices = bondPrices;
                    bondData.Taxs = taxs;
                    var bondStringfy = JSON.stringify(bondData);
                    sessionStorage.setItem(bond.BondKey(), bondStringfy);
                });
            }
            return bondData;
        };
        ChartHandler.prototype.getIndiceData = function (indice) {
            var dataList;
            var localBond = sessionStorage.getItem(indice.IndiceKey());
            if (localBond) {
                dataList = JSON.parse(localBond);
            }
            else {
                $.ajaxSetup({
                    async: false
                });
                $.getJSON(TesouroGraficosModule.DataServiceHelper.GetFullUrl(indice.File), function (data) {
                    dataList = data.map(function (item) {
                        return [item.Date, item.Value];
                    });
                    var indiceStringfied = JSON.stringify(dataList);
                    sessionStorage.setItem(indice.IndiceKey(), indiceStringfied);
                });
            }
            return dataList;
        };
        ChartHandler.prototype.SetLinearPrice = function (bondBuyDate, showLinearPrice) {
            debugger;
            var linearSerieId = "linearserie";
            var bond = this._bondList.filter(function (item) {
                return item.IsSelected();
            })[0];
            var firstDateSerie = this.GetFirstDateBond(bond.Id);
            if (bondBuyDate == null || bondBuyDate.valueOf() < firstDateSerie.valueOf()) {
                bondBuyDate = firstDateSerie;
            }
            //TODO:Criar propriedade na classe bonde. alterar para false e depois 
            //chamar um metodo para verificar e desabilitar tudo oque estiver falso
            //desabilitar o datepicker quando a comparacao nao estiver ativa.
            this.SetSerieVisibility(bond.PriceKeyMm(), false);
            this.SetSerieVisibility(bond.TaxKey(), false);
            var linearSerie = this._chart.series
                .filter(function (item) {
                return item.options.id == linearSerieId;
            })[0];
            if (linearSerie) {
                linearSerie.setVisible(showLinearPrice, false);
            }
            var bondData = new TesouroGraficosModule.BondPrice();
            var localBond = sessionStorage.getItem(bond.BondKey());
            if (localBond) {
                bondData = JSON.parse(localBond);
            }
            var priceList = bondData.Prices.filter(function (item) {
                return item[0] >= bondBuyDate.valueOf();
            });
            var firstPrecoCompra = priceList[0][1];
            var diff = bond.MaturityDate.valueOf() - bondBuyDate.valueOf();
            var mrDays = diff / 1000 / 60 / 60 / 24;
            var weekendsDays = (mrDays / 7) * 2;
            var workingDays = mrDays - weekendsDays;
            //TODO: Exibir estas configurações quando a comparação for selecionada
            //TODO: Fazer um arrendondamento para 4 casas decimais
            var razao = (1000 - firstPrecoCompra) / workingDays;
            var linearPriceList = new Array();
            priceList.forEach(function (item, idx) {
                var precoLinearItem;
                if (linearPriceList.length == 0) {
                    precoLinearItem = firstPrecoCompra;
                }
                else {
                    precoLinearItem = linearPriceList[idx - 1][1] + razao;
                }
                linearPriceList.push([item[0], precoLinearItem]);
            });
            var serie = this._chart.series.filter(function (item) {
                return item.options.id == linearSerieId;
            })[0];
            if (serie == null || serie == undefined) {
                this._chart.addSeries({
                    id: linearSerieId,
                    name: "Preco Linear",
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
            }
            this._chart.redraw();
            return firstDateSerie;
        };
        ChartHandler.prototype.GetActivedBonds = function () {
            var selectedBond = this._bondList.filter(function (item) {
                return item.IsSelected();
            });
            return selectedBond;
        };
        ChartHandler.prototype.GetFirstDateBond = function (bondId) {
            var today = new Date();
            var bondKey = today.yyyymmdd() + "|" + bondId;
            var bondData = new TesouroGraficosModule.BondPrice();
            var localBond = sessionStorage.getItem(bondKey);
            if (localBond) {
                bondData = JSON.parse(localBond);
            }
            var aux = new Date(bondData.Prices[0][0]);
            return aux;
        };
        ChartHandler.prototype.SetSerieVisibility = function (serieKey, show) {
            var serie = this._chart.series
                .filter(function (item) {
                return item.options.id == serieKey;
            })[0];
            if (serie) {
                serie.setVisible(show, false);
            }
        };
        ChartHandler.prototype.checkVisibility = function () {
            var _this = this;
            this._bondList.forEach(function (item) {
                if (item.IsSelected()) {
                    _this.LoadBond(item);
                }
                else {
                    var taxKey = "taxaserieid" + item.Id;
                    var priceKey = "precoserieid" + item.Id;
                    _this.SetSerieVisibility(taxKey, false);
                    _this.SetSerieVisibility(priceKey, false);
                }
            });
            this._indicesList.forEach(function (item) {
                if (item.IsSelected) {
                    _this.LoadIndice(item.Type, item.IsSelected);
                }
                else {
                    _this.SetSerieVisibility(item.IndiceKey(), false);
                }
            });
        };
        ChartHandler.prototype.setLocalization = function () {
            //TODO: Check the localization and set the correct language
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
        };
        return ChartHandler;
    }());
    TesouroGraficosModule.ChartHandler = ChartHandler;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
//# sourceMappingURL=ChartHandler.js.map