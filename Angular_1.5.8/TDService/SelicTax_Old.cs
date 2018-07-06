//using Common.Logging;
//using HtmlAgilityPack;
//using System;
//using System.Collections.Generic;
//using System.Configuration;
//using System.Globalization;
//using System.IO;
//using System.Linq;
//using System.Net;
//using System.Runtime.Serialization.Json;
//using System.Text;
//using System.Threading;
//using System.Threading.Tasks;
//using TesouroDiretoService.Common;
//using TesouroDiretoService.DataAccess;
//using TesouroDiretoService.Entities;
//using TesouroDiretoService.Utilities;

//namespace TesouroDiretoService
//{
//    public class SelicTax
//    {
//        private string pathJsonFiles = string.Empty;
//        private string pathRawFiles = string.Empty;
//        private DateTime dateStart;

//        public SelicTax()
//        {
//            pathJsonFiles = ConfigurationManager.AppSettings.Get("PathJsonFiles");
//            dateStart = Convert.ToDateTime(ConfigurationManager.AppSettings.Get("DateStart"));
//        }

//        //public void GetTesouroDireto()
//        //{
//        //    try
//        //    {
//        //        Logger.Info("Service Started With Success !");

//        //        CultureInfo ci = new CultureInfo("pt-BR");
//        //        Thread.CurrentThread.CurrentCulture = ci;

//        //        string Url = "http://www.tesouro.fazenda.gov.br/pt/tesouro-direto-precos-e-taxas-dos-titulos";
//        //        var web = new HtmlWeb();
//        //        HtmlDocument doc = web.Load(Url);

//        //        var messageTreasure = doc.DocumentNode.SelectNodes("//*[@id='p_p_id_precosetaxas_WAR_tesourodiretoportlet_']/span").Last().InnerText;
//        //        var aux = doc.DocumentNode.SelectNodes("//*[@id='p_p_id_precosetaxas_WAR_tesourodiretoportlet_']/div/div/div/span");
//        //        var messageMarketClosed = aux?.FirstOrDefault();

//        //        var isSuspended = messageTreasure.Contains("Suspenso");
//        //        var isClosed = messageMarketClosed != null && messageMarketClosed.InnerText.Equals("O mercado está fechado no momento.");
//        //        messageTreasure = isClosed ? messageMarketClosed.InnerText : messageTreasure;

//        //        if (!isClosed && !isSuspended)
//        //        {
//        //            var rows = doc.DocumentNode.SelectNodes("//*[@id='p_p_id_precosetaxas_WAR_tesourodiretoportlet_']/div/div/div/table[2]/tbody/tr[not(.//td[@colspan='7'])]")
//        //            .Where(x => x.Element("th") == null);

//        //            foreach (var row in rows)
//        //            {
//        //                var cells = row.SelectNodes("td");

//        //                var titulo = new Titulo()
//        //                {
//        //                    Name = cells[0].InnerText,
//        //                    Vencimento = DateTime.Parse(cells[1].InnerText)
//        //                };

//        //                decimal txCompraValue, txVendaValue, puCompraValue, puVendaValue;

//        //                var cotacao = new InterestRate()
//        //                {
//        //                    TxCompra = decimal.TryParse(cells[2].InnerText, out txCompraValue) ? (decimal?)txCompraValue : null,
//        //                    TxVenda = decimal.TryParse(cells[3].InnerText, out txVendaValue) ? (decimal?)txVendaValue : null,
//        //                    PuCompra = decimal.TryParse(cells[4].InnerText.Replace("R$", ""), out puCompraValue) ? (decimal?)puCompraValue : null,
//        //                    PuVenda = decimal.TryParse(cells[5].InnerText.Replace("R$", ""), out puVendaValue) ? (decimal?)puVendaValue : null,
//        //                    UpdateTime = DateTime.Now
//        //                };

//        //                titulo.Cotacao.Add(cotacao);
//        //                TituloDataAccess.Include(titulo);
//        //            }
//        //        }
//        //        else
//        //        {
//        //            Logger.Info("Market Closed or Suspended");

//        //            var statusTD = new StatusTesouroDireto()
//        //            {
//        //                UpdateCheck = DateTime.Now,
//        //                IsMarketSuspended = isSuspended,
//        //                IsMarketClosed = isClosed,
//        //                MarketMessage = messageTreasure
//        //            };
//        //            StatusTesouroDiretoDataAccess.Include(statusTD);
//        //        }
//        //        Logger.Info("Service Finished With Success !");
//        //    }
//        //    catch (Exception ex)
//        //    {
//        //        Logger.Error("Error when try to Access the direct treasure quotes", ex);
//        //    }
//        //}

//        public void GetSelicTargetTax()
//        {
//            try
//            {
//                Logger.Info("# Selic - Service Started With Success !");

//                string Url = "http://www.ipeadata.gov.br/ExibeSerie.aspx?serid=1693286996";
//                var web = new HtmlWeb();
//                web.UsingCache = false;
//                //web.UserAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36";

//                HtmlDocument doc = web.Load(Url);

//                var nodeRows = doc.DocumentNode.SelectNodes("//*[@id='grd_DXMainTable']/tr[contains(@class,'dxgvFocusedRow')]").ToList();
//                nodeRows.AddRange(doc.DocumentNode.SelectNodes("//*[@id='grd_DXMainTable']/tr[contains(@class,'dxgvDataRow')]").ToList());

//                var filePath = $@"{pathJsonFiles}\Selic.json";
//                WhriteFile(nodeRows, filePath, dateStart);

//                var selicFullfilePath = $@"{pathJsonFiles}\Selic_full.json";
//                WhriteFile(nodeRows, selicFullfilePath);

//                Logger.Info("# Selic - Service Finished With Success !");
//            }
//            catch (Exception ex)
//            {
//                Logger.Error("# Selic - Error when try to Access the IPEA for the Selic history", ex);
//            }
//        }

//        private void WhriteFile(List<HtmlNode> rows, string filePath, DateTime? dateStart = null)
//        {
//            var selicRateList = new List<SelicJson>();

//            for (int i = rows.Count() - 1; i >= 0; i--)
//            {
//                var row = rows[i];
//                var cells = row.SelectNodes("td");

//                var date = Convert.ToDateTime(cells[0].InnerText);
//                if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
//                {
//                    continue;
//                }

//                if (dateStart != null && date < dateStart)
//                {
//                    continue;
//                }

//                var selicRate = new SelicJson()
//                {
//                    Date = date.ToTimestamp(),
//                    Value = Convert.ToDecimal(cells[1].InnerText)
//                };
//                selicRateList.Add(selicRate);
//            }

//            FileHelper.WriteJsonFile(selicRateList, filePath);
//        }
//    }
//}