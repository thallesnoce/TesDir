module TesouroGraficosModule {
    export class RouteConfig {
        constructor($routeProvider: ng.route.IRouteProvider) {
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

    export class ThemeConfig {
        constructor($mdThemingProvider: ng.material.IThemingProvider) {
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
                .definePalette('customAccent',
                customAccent);

            //Available palettes: red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green, light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey,
            $mdThemingProvider.theme('default')
                .primaryPalette('blue-grey')
                .accentPalette('customAccent');


            //$mdThemingProvider.enableBrowserColor({
            //    theme: 'default',
            //    palette: 'primary',
            //    hue: '200'
            //});
        }
    }
}