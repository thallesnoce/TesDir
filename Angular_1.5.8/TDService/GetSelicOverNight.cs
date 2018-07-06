using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TesouroDiretoService
{
    class GetSelicOverNight
    {
        //public void GetTaxaSelicOverDiario()
        //{
        //    Logger.Info("## Selic : Starting get information ##");
        //    using (var client = new WebClient())
        //    {
        //        var reqparm = new System.Collections.Specialized.NameValueCollection();

        //        reqparm.Add("method", "listarTaxaDiaria");
        //        reqparm.Add("idioma", "P");
        //        reqparm.Add("dataInicial", "01/01/2010");
        //        reqparm.Add("dataFinal", DateTime.Now.ToString("dd/MM/yyyy"));
        //        reqparm.Add("tipoApresentacao", "arquivo");
        //        byte[] responsebytes = client.UploadValues(@"http://www3.bcb.gov.br/selic/consulta/taxaSelic.do", reqparm);

        //        File.WriteAllBytes(@"D:\TesouroDiretoData\selic.txt", responsebytes);
        //    }
        //    Logger.Info("## Selic : Finished with success ##");

        //    ConvertFile();
        //}

        //public void ConvertFile()
        //{
        //    Logger.Info("## Selic JSON : Starting Reading information in txt ##");
        //    var selicText = File.ReadAllLines(@"D:\TesouroDiretoData\selic.txt");

        //    var selicRateList = new List<SelicJson>();
        //    for (int i = 0; i < selicText.Length; i++)
        //    {
        //        //Data; Taxa(% a.a.); Fator diário; Base de cálculo(R$); Média; Mediana; Moda; Desvio padrão; Índice de curtose;
        //        if (i < 2 || string.IsNullOrEmpty(selicText[i]))
        //        {
        //            continue;
        //        }

        //        var rateValues = selicText[i].Split(';');

        //        if (rateValues[1].ToString() == "-100,00")
        //        {
        //            continue;
        //        }

        //        var selicRate = new SelicJson()
        //        {
        //            Date = ConvertDateToTimestamp(Convert.ToDateTime(rateValues[0])),
        //            Rate = Convert.ToDecimal(rateValues[1])
        //        };
        //        selicRateList.Add(selicRate);
        //    }

        //    WriteJsonFile(selicRateList);
        //    Logger.Info("## Selic JSON : Finished Writing information in JSON ##");
        //}
    }
}
