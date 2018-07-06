using Common.Logging;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TDService.Common;
using TDService.Entities;
using TDService.Utilities;

namespace TDService
{
    public class SelicTax
    {
        private readonly string _pathJsonFiles;        
        private DateTime _dateStart;

        public SelicTax()
        {
            _pathJsonFiles = Directory.CreateDirectory(Path.Combine(Constants.DirectoryFiles, "JsonFiles")).FullName;
            _dateStart = Convert.ToDateTime(ConfigurationManager.AppSettings.Get("DateStart"));
        }

        public void GetSelicTargetTax()
        {
            try
            {
                Logger.Logger.Info("# Selic - Service Started With Success !");

                var web = new HtmlWeb();
                web.UsingCache = false;
                //web.UserAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36";
                HtmlDocument doc = web.Load(Constants.SelicUrl);

                var nodeRows = doc.DocumentNode.SelectNodes("//*[@id='grd_DXMainTable']/tr[contains(@class,'dxgvFocusedRow')]").ToList();
                nodeRows.AddRange(doc.DocumentNode.SelectNodes("//*[@id='grd_DXMainTable']/tr[contains(@class,'dxgvDataRow')]").ToList());

                //var filePath = $@"{pathJsonFiles}\Selic.json";
                //WhriteFile(nodeRows, filePath, dateStart);

                var selicFullfilePath = $@"{_pathJsonFiles}\Selic_full.json";
                WhriteFile(nodeRows, selicFullfilePath);

                Logger.Logger.Info("# Selic - Service Finished With Success !");
            }
            catch (Exception ex)
            {
                Logger.Logger.Error("# Selic - Error when try to Access the IPEA for the Selic history", ex);
            }
        }

        private void WhriteFile(List<HtmlNode> rows, string filePath, DateTime? dateStart = null)
        {
            var selicRateList = new List<SelicJson>();

            for (int i = rows.Count() - 1; i >= 0; i--)
            {
                var row = rows[i];
                var cells = row.SelectNodes("td");

                var date = Convert.ToDateTime(cells[0].InnerText);
                if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                {
                    continue;
                }

                if (dateStart != null && date < dateStart)
                {
                    continue;
                }

                var selicRate = new SelicJson()
                {
                    Date = date.ToTimestamp(),
                    Value = Convert.ToDecimal(cells[1].InnerText)
                };
                selicRateList.Add(selicRate);
            }

            FileHelper.WriteJsonFile(selicRateList, filePath);
        }
    }
}