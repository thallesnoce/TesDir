module TesouroGraficosModule {
    export class FormatConfig {
        constructor($mdDateLocaleProvider: ng.material.IDateLocaleProvider) {
            //TODO:Implement the localization
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
}