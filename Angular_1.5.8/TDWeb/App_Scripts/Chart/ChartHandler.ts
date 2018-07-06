module TesouroGraficosModule {
    export class ChartHandler {
        private _chart: HighchartsChartObject;
        private _bondList: Array<Bond>;
        private _indicesList: Array<Indice>;

        public constructor(renderTo: string, private titulo: string) {
            this.createChart(renderTo);
            this.setLocalization();
        }

        public Init() {
            this.checkVisibility();
        }

        public SetBondList(bondList: Array<Bond>) {
            this._bondList = bondList;
        }

        public SetIndiceList(indicesList: Array<Indice>) {
            this._indicesList = indicesList;
        }

        private createChart = (renderTo: string) => {
            //TODO: mudar label para o zoom
            var highStockOption: HighchartsOptions = {
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
                yAxis: [{ // Primary yAxis
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
                }, { // Secondary yAxis  
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
        }

        private checkSelectedBonds() {
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

        private createTaxaSerie(bondData, taxKey, shortName) {
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
        }

        private createPriceSerie(bondData, priceKey, shortName) {
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

        public LoadBond = (bond: Bond) => {
            this.checkSelectedBonds();
            var bondPromisse = this.getBondData(bond);

            var startDate;
            return bondPromisse.then((bondData: BondPrice) => {
                startDate = bondData.Taxs[0][0];

                var taxSerie = this._chart.get(bond.TaxKey());
                if (bond.IsTaxVisible && taxSerie == null) {
                    this.createTaxaSerie(bondData, bond.TaxKey(), bond.ShortName);
                } else {
                    this.SetSerieVisibility(bond.TaxKey(), bond.IsTaxVisible);
                }

                var priceSerie = this._chart.get(bond.PriceKey());
                if (bond.IsPriceVisible && priceSerie == null) {
                    this.createPriceSerie(bondData, bond.PriceKey(), bond.ShortName);
                } else {
                    this.SetSerieVisibility(bond.PriceKey(), bond.IsPriceVisible);
                }

                //var taxAvarege = this._chart.get(bond.TaxKeyMm());
                if (bond.IsTaxAvaregeVisible) {// && taxAvarege == null
                    this._chart.addSeries({
                        name: 'Média Móvel 15-dias Taxa' + bond.ShortName,//TODO: alterar e colocar dimanico . alterar nome para media movel.
                        id: bond.TaxKeyMm(),
                        linkedTo: bond.TaxKey(),
                        showInLegend: true,
                        type: 'trendline',
                        algorithm: 'SMA',
                        periods: 15,
                        yAxis: 0
                    }, false);
                } else {
                    this.SetSerieVisibility(bond.TaxKeyMm(), bond.IsTaxAvaregeVisible);
                }

                //var priceAvarege = this._chart.get(bond.PriceKeyMm());
                if (bond.IsPriceAvaregeVisible) {// && priceAvarege == null
                    this._chart.addSeries({
                        name: 'Média Móvel 15-dias Preço' + bond.ShortName,
                        id: bond.PriceKeyMm(),
                        linkedTo: bond.PriceKey(),
                        showInLegend: true,
                        type: 'trendline',
                        algorithm: 'SMA',//SMA, signalLine, //TODO: implementar possibilidade de trocar tipo da media;
                        periods: 15,//TODO: implementar possibilidade de troca de periodo das medias moveis
                        yAxis: 1
                    }, false);

                    var aux = this._chart.series;
                } else {
                    this.SetSerieVisibility(bond.PriceKeyMm(), bond.IsPriceAvaregeVisible);
                }

            }).then(() => {
                this._indicesList.forEach((item) => {
                    if (item.IsSelected) {
                        var indice = this._chart.series.filter((indi) => {
                            return indi.options.id == item.IndiceKey();
                        })[0];
                        var promiseIndice = this.getIndiceData(item, startDate);
                        promiseIndice.then((data: any[][]) => {
                            indice.setData(data);
                        });
                    }
                });

                this._chart.redraw();
            });
        }

        public LoadIndice(indiceId: TypeIndice, showIndice) {
            var indice = this._indicesList.filter((item) => { return item.Type == indiceId })[0];
            var selectedBond = this._bondList.filter((item) => { return item.IsSelected() })[0];
            var startDate = selectedBond ? selectedBond.StarDate.valueOf() : null;
            var promisseIndice = this.getIndiceData(indice, startDate);

            promisseIndice.then((data: any[][]) => {
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
                } else {
                    this.SetSerieVisibility(indice.IndiceKey(), indice.IsSelected);
                }
                this._chart.redraw();
            });
        }

        private getBondData(bond: Bond) {
            var promisseCallback = (resolve) => {
                var bondData = new BondPrice();
                var key = bond.BondKey();
                var localBond = sessionStorage.getItem(key);

                if (localBond) {
                    bondData = JSON.parse(localBond);
                    resolve(bondData);
                } else {
                    debugger;
                    $.getJSON(DataServiceHelper.GetFullUrl(bond.File), (data) => {
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
            }

            return new Promise(promisseCallback);
        }

        private getIndiceData(indice: Indice, startDate: number = null) {
            var promisseCallBack = (resolve) => {

                var dataList: any[][];
                var key = indice.IndiceKey();
                var url = `${indice.File}.json`;
                var localBond = sessionStorage.getItem(key);

                if (localBond) {
                    dataList = JSON.parse(localBond);
                    dataList = this.filterData(dataList, startDate);
                    resolve(dataList);
                } else {
                    $.getJSON(DataServiceHelper.GetFullUrl(url), (data) => {
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

        private filterData(data: any[][], startDate: number) {
            if (startDate) {
                return data.filter((item) => {
                    return item[0] >= startDate;
                });
            }
            else {
                return data;
            }
        }

        public SetLinearPrice(bondBuyDate: Date, showLinearPrice: boolean): Promise<{}> {
            var linearSerieId = "linearserie";

            var serie = this._chart.series.filter((item) => {
                return item.options.id == linearSerieId;
            })[0];

            if (!showLinearPrice) {
                if (serie) {
                    serie.setVisible(showLinearPrice, false);
                }
            } else {
                var bond = this._bondList.filter((item) => {
                    return item.IsSelected();
                })[0];

                var bondPromisse = this.getBondData(bond);

                return bondPromisse.then((bondData: BondPrice) => {
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
                    //TODO:1 Exibir estas configurações quando a comparação for selecionada
                    //TODO: Fazer um arrendondamento para 4 casas decimais

                    var razao = (1000 - firstPrecoCompra) / workingDays;
                    var linearPriceList: Array<any> = new Array<any>();

                    priceList.forEach((item, idx) => {
                        var precoLinearItem: number;

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
                    } else {
                        serie.setData(linearPriceList, false);
                        serie.setVisible(showLinearPrice, false);
                    }

                    this._chart.redraw();

                    var linearCalc = new LinearPrice();
                    linearCalc.StartDate = firstDateSerie;

                    return linearCalc;
                });
            }
        }

        public GetActivedBonds() {
            var selectedBond = this._bondList.filter((item) => {
                return item.IsSelected();
            });
            return selectedBond;
        }

        public AddSerie(serie: HighchartsSeriesOptions) {
            this._chart.addSeries(serie, true);
            this._chart.xAxis[0].setExtremes(0);
        }

        public DisableAxi(AxiId) {
            this._chart.get(AxiId).remove();
        }

        public GetBondByNameMaturityDate = (bondName: string, maturityDate: Date, cupom: boolean): Bond => {
            var selectedBond = this._bondList.filter((item) => {
                return item.Bond === bondName && item.MaturityDate.valueOf() === maturityDate.valueOf() && item.Cupom == cupom
            })[0];
            return selectedBond;
        }

        public GetBondById = (bondId): Bond => {
            var selectedBond = this._bondList.filter((item) => {
                return item.Id === bondId;
            })[0];
            return selectedBond;
        }

        public SetSerieVisibility(serieKey: string, show: boolean) {
            var serie = this._chart.series
                .filter((item) => {
                    return item.options.id == serieKey
                })[0];

            if (serie) {
                serie.setVisible(show, false);
            }
        }

        //public SetHistoricalData(useHistoricalData: boolean) {
        //    this._historicalData = useHistoricalData;

        //    var linearSerieId = "linearserie";
        //    var serie = this._chart.series.filter((item) => {
        //        return item.options.id == linearSerieId;
        //    })[0];
        //    if (serie) {
        //        serie.setVisible(false, false);
        //    }

        //    this._bondList.forEach((item) => {
        //        if (item.IsSelected()) {
        //            var serieTax = this._chart.series.filter((bond) => {
        //                return bond.options.id == item.TaxKey();
        //            })[0];

        //            var seriePrice = this._chart.series.filter((bond) => {
        //                return bond.options.id == item.PriceKey();
        //            })[0];

        //            item.IsPriceAvaregeVisible = false;
        //            item.IsTaxAvaregeVisible = false;
        //            this.SetSerieVisibility(item.PriceKeyMm(), false);
        //            this.SetSerieVisibility(item.TaxKeyMm(), false);
        //            var startDate;
        //            var bondIndice = this.getBondData(item);
        //            bondIndice.then((data: BondPrice) => {
        //                startDate = data.Taxs[0][0];
        //                serieTax.setData(data.Taxs, false);
        //                seriePrice.setData(data.Prices, false);
        //                this._chart.redraw();
        //            }).then(() => {
        //                this._indicesList.forEach((item) => {
        //                    if (item.IsSelected) {
        //                        var indice = this._chart.series.filter((indi) => {
        //                            return indi.options.id == item.IndiceKey();
        //                        })[0];
        //                        var promiseIndice = this.getIndiceData(item, startDate);
        //                        promiseIndice.then((data: any[][]) => {
        //                            this._chart.xAxis[0].setExtremes(0);
        //                            indice.setData(data);
        //                        });
        //                    }
        //                });
        //            });
        //        }
        //    });
        //}

        private checkVisibility() {
            this._bondList.forEach((item) => {
                if (item.IsSelected()) {
                    this.LoadBond(item);
                } else {
                    var taxKey = `taxaserieid${item.Id}`;
                    var priceKey = `precoserieid${item.Id}`;
                    this.SetSerieVisibility(taxKey, false);
                    this.SetSerieVisibility(priceKey, false);
                }
            });

            this._indicesList.forEach((item) => {
                if (item.IsSelected) {
                    this.LoadIndice(item.Type, item.IsSelected);
                } else {
                    this.SetSerieVisibility(item.IndiceKey(), false);
                }
            });
        }

        private setLocalization() {
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
        }
    }
}