var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    var ChartViewModel = (function () {
        function ChartViewModel() {
            this.MinDate = new Date(2016, 1, 1);
            this.MaxDate = new Date();
            this.CompareMaturityBond = false;
            this.loadData();
        }
        ChartViewModel.prototype.CanShowComparation = function () {
            var aux = this.BondList
                .filter(function (item) {
                return item.Bond == "prefixado" && item.IsSelected() && !item.Cupom;
            });
            return aux.length == 1;
        };
        ChartViewModel.prototype.SelectedBondNames = function () {
            var bonds = this.BondList
                .filter(function (item) {
                return item.IsSelected();
            })
                .map(function (item) {
                return item.ShortName;
            });
            return bonds.join(' - ');
        };
        ChartViewModel.prototype.OnlyWeekDays = function (date) {
            var day = date.getDay();
            return day !== 0 && day !== 6;
        };
        ChartViewModel.prototype.loadData = function () {
            var _this = this;
            $.ajaxSetup({
                async: false
            });
            $.getJSON(TesouroGraficosModule.DataServiceHelper.GetBondsList(), function (data) {
                _this.BondList = data.map(function (item) {
                    var bond = new TesouroGraficosModule.Bond();
                    bond.Id = item.Id;
                    bond.Bond = item.Bond;
                    bond.MaturityDate = new Date(item.MaturityDate);
                    bond.Cupom = item.Cupom;
                    bond.File = item.File;
                    bond.Name = item.Name;
                    bond.ShortName = item.ShortName;
                    bond.IsPriceVisible = item.IsPriceVisible;
                    bond.IsPriceAvaregeVisible = item.IsPriceAvaregeVisible;
                    bond.IsTaxVisible = item.IsTaxVisible;
                    bond.IsTaxAvaregeVisible = item.IsTaxAvaregeVisible;
                    return bond;
                });
            });
            $.getJSON(TesouroGraficosModule.DataServiceHelper.GetIndices(), function (data) {
                _this.Indices = data.map(function (item) {
                    var indice = new TesouroGraficosModule.Indice();
                    indice.Type = item.Type;
                    indice.IsSelected = item.IsSelected;
                    indice.File = item.File;
                    indice.Name = item.Name;
                    indice.DisplayName = item.DisplayName;
                    return indice;
                });
            });
        };
        return ChartViewModel;
    }());
    TesouroGraficosModule.ChartViewModel = ChartViewModel;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
//# sourceMappingURL=ChartViewModel.js.map