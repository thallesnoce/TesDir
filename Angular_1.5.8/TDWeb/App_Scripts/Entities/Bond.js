/// <reference path="../interfaces.ts" />
var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    var Bond = (function () {
        function Bond() {
        }
        Bond.prototype.IsSelected = function () {
            var aux = this.IsPriceVisible || this.IsPriceAvaregeVisible || this.IsTaxVisible || this.IsTaxAvaregeVisible;
            return aux;
        };
        Bond.prototype.BondKey = function () { return new Date().yyyymmdd() + "|" + this.Id; };
        ;
        Bond.prototype.TaxKey = function () { return "taxaserieid" + this.Id; };
        Bond.prototype.TaxKeyMm = function () { return "mmtaxaserieid" + this.Id; };
        Bond.prototype.PriceKey = function () { return "precoserieid" + this.Id; };
        Bond.prototype.PriceKeyMm = function () { return "mmprecoserieid" + this.Id; };
        return Bond;
    }());
    TesouroGraficosModule.Bond = Bond;
    var BondPrice = (function () {
        function BondPrice() {
        }
        return BondPrice;
    }());
    TesouroGraficosModule.BondPrice = BondPrice;
    var Indice = (function () {
        function Indice() {
        }
        Indice.prototype.IndiceKey = function () { return new Date().yyyymmdd() + "|" + this.Type; };
        ;
        return Indice;
    }());
    TesouroGraficosModule.Indice = Indice;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
//# sourceMappingURL=Bond.js.map