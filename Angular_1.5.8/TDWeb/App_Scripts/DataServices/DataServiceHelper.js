var TesouroGraficosModule;
(function (TesouroGraficosModule) {
    var DataServiceHelper = (function () {
        function DataServiceHelper() {
        }
        DataServiceHelper.GetDefaultUrl = function () {
            return window.location.origin + "/";
        };
        DataServiceHelper.GetBondsList = function () {
            return DataServiceHelper.GetDefaultUrl() + "App_Repo/Bonds.json";
        };
        DataServiceHelper.GetIndices = function () {
            return DataServiceHelper.GetDefaultUrl() + "App_Repo/Indices.json";
        };
        DataServiceHelper.GetFullUrl = function (bondFile) {
            return DataServiceHelper.GetDefaultUrl() + bondFile;
        };
        return DataServiceHelper;
    }());
    TesouroGraficosModule.DataServiceHelper = DataServiceHelper;
})(TesouroGraficosModule || (TesouroGraficosModule = {}));
//# sourceMappingURL=DataServiceHelper.js.map