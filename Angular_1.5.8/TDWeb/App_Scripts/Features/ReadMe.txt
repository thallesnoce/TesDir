https://developers.google.com/closure/compiler/
http://stackoverflow.com/questions/34809989/minifying-with-google-closure-compiler-an-angularjs-app-written-in-typescript

https://scotch.io/tutorials/declaring-angularjs-modules-for-minification

PreBuild
$(ProjectDir)scripts\ClosureCompiler\closurecompile.bat


//http://www.highcharts.com/plugin-registry/single/16/technical-indicators


    <!--<script src="https://code.highcharts.com/modules/boost.js"></script>-->
    <!--https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-resource.min.js-->
    <!--https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-touch.min.js-->



    <!--
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-route.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-aria.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-animate.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-messages.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.1/angular-material.js"></script>
    <script src="https://rawgithub.com/laff/technical-indicators/master/technical-indicators.src.js"></script>
    <script src="https://code.highcharts.com/stock/highstock.js"></script>
    <script src="App_Scripts/script.js"></script>
    <script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-114/svg-assets-cache.js"></script>
    <script src="scripts/jquery.mask.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.2/moment.min.js"></script>
    <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
        -->





<!DOCTYPE html>
<!--TODO: ng-strict-di/ng-cloak-->
<html ng-app="TesouroGragicosApp">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Analise e compare preços e taxas dos títulos do Tesouro Direto com gráficos atualizados diariamente. Médias móveis e taxa Selic disponíveis.">
    <link rel="icon" href="/Content/Images/favicon.png">
    <link rel="alternate" href="tesdir.com.br" hreflang="pt-br" />
    <title>Gráfico de preços e taxas dos títulos do Tesouro Direto</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.1.1/angular-material.css">

    <link rel="preload" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic"></noscript>

    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></noscript>

    <link rel="stylesheet" href="Content/main.min.css" />
    <script>
        /*! loadCSS: load a CSS file asynchronously. [c]2016 @scottjehl, Filament Group, Inc. Licensed MIT */
        (function (n) { "use strict"; var t = function (t, i, r) { function l(n) { if (f.body) return n(); setTimeout(function () { l(n) }) } function c() { u.addEventListener && u.removeEventListener("load", c); u.media = r || "all" } var f = n.document, u = f.createElement("link"), e, s, h, o; return i ? e = i : (s = (f.body || f.getElementsByTagName("head")[0]).childNodes, e = s[s.length - 1]), h = f.styleSheets, u.rel = "stylesheet", u.href = t, u.media = "only x", l(function () { e.parentNode.insertBefore(u, i ? e : e.nextSibling) }), o = function (n) { for (var i = u.href, t = h.length; t--;) if (h[t].href === i) return n(); setTimeout(function () { o(n) }) }, u.addEventListener && u.addEventListener("load", c), u.onloadcssdefined = o, o(c), u }; typeof exports != "undefined" ? exports.loadCSS = t : n.loadCSS = t })(typeof global != "undefined" ? global : this);
    </script>
</head>
<body class="tesouro-graficos">
    <div id="page-container">
        <!--<nav class="navbar navbar-default no-margin">
            <div class="navbar-header fixed-brand">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" id="menu-toggle">
                    <span class="fa fa-bars" aria-hidden="true"></span>
                </button>
                <a class="navbar-brand" href="#">
                    <img src="/Content/Images/favicon.png" alt="TesDir Logo" />
                    <span>TesDir</span>
                </a>
            </div>
        </nav>
        <nav class="navbar navbar-default">
            <div class="container-fluid">

                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">Brand</a>
                </div>

                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>
                        <li><a href="#">Link</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a href="#">Action</a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something else here</a></li>
                                <li role="separator" class="divider"></li>
                                <li><a href="#">Separated link</a></li>
                                <li role="separator" class="divider"></li>
                                <li><a href="#">One more separated link</a></li>
                            </ul>
                        </li>
                    </ul>
                    <form class="navbar-form navbar-left">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Search">
                        </div>
                        <button type="submit" class="btn btn-default">Submit</button>
                    </form>
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="#">Link</a></li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a href="#">Action</a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something else here</a></li>
                                <li role="separator" class="divider"></li>
                                <li><a href="#">Separated link</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>-->
        <!--<div class="navbar-header fixed-brand">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" id="menu-toggle">
                <span class="fa fa-bars" aria-hidden="true"></span>
            </button>
            <a class="navbar-brand" href="#">
                <img src="/Content/Images/favicon.png" alt="TesDir Logo" />
                <span>TesDir</span>
            </a>
        </div>-->


        <nav class="navbar navbar-default" role="navigation">

            <div class="container-fluid">
                <div class="navbar-header logo">
                    <a class="navbar-brand" href="index.html"><img src="/Content/Images/favicon.png" class="img-responsive"><span>TesDir</span></a>
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#nav-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                </div>
                <div class="collapse navbar-collapse" id="nav-collapse">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="#">Home</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Sobre</a></li>
                    </ul>
                </div>
            </div> <!-- Container fluid-->
        </nav>
        <!--//TODo: Colocar progress bar
        <md-progress-linear md-mode="indeterminate"></md-progress-linear>-->
        <article>
            <div id="page-content-wrapper">
                <div class="container-fluid xyz" ng-view>
                    <md-content style="padding:10px">
                        <h1>Gráfico de preços e taxas dos títulos do Tesouro Direto</h1>
                        <p>
                            <span>Crie gráfico dos títulos do Tesouro Direto de maneira simples e intuitiva atualizados diariamente.</span>
                            <br />
                            <span>Compare preços e taxas dos títulos do Tesouro Direto, inclua médias móveis e índices de mercado financeiro como a taxa Selic. De forma gráfica fica muito mais fácil acompanhar a rentabilidade dos títulos do Tesouro Direto.</span>
                            <br />
                            <br />
                            <span>Para os títulos prefixados (LTN), há a possibilidade de comparação entre o Preço contratado e o Preço de mercado (marcação à mercado), ferramenta útil para quem deseja vender o título antes do vencimento e desja uma rentabilidade superior à taxa contratada.</span>
                        </p>
                    </md-content>
                </div>
            </div>
        </article>
        <!--<footer class="text-center">
            //TODO: Fazer o Footer
            <p>Direito de Uso</p>
        </footer>-->
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-route.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-aria.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-messages.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.1/angular-material.min.js"></script>
    <script src="https://code.highcharts.com/stock/highstock.js"></script>

    <script src="App_Scripts/Features/Technical-Indicator.js"></script>
    <script src="scripts/jquery.mask.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.2/moment.min.js"></script>
    <script src="App_Scripts/script.js"></script>

    <!--<script src="App_Scripts/geraljs.min.js"></script>-->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js" defer></script>
    <script src="https://code.highcharts.com/stock/modules/exporting.js" defer></script>
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-12796001-14', 'auto');
        ga('send', 'pageview');
    </script>
</body>
</html>