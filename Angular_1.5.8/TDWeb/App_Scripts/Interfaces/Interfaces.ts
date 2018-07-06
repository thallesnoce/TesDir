interface IBondRouteParams extends ng.route.IRouteParamsService {
    Bond: string;
    Date: string;
    Cupom: string;
}

interface IIndiceRouteParams extends ng.route.IRouteParamsService {
    Indice: string;
}

//interface IBond {
//    Id: number;
//    Type: TypeBond;
//    Bond: string;
//    MaturityDate: Date;
//    Name: string;
//    ShortName: string;
//    File: string;
//    Cupom: boolean;//TODO: translate this
//    IsSelected: boolean;
//    IsPriceVisible: boolean;
//    //IsTaxVisible: boolean;
//    //IsPriveAvaregeVisible: boolean;
//    //IsTaxAvaregeVisible: boolean;
//}

interface UserSettings {
}

enum TypeIndice {
    Selic = 100
}