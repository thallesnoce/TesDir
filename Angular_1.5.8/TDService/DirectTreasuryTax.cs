using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using TDService.Common;
using TDService.Entities;
using TDService.Utilities;

namespace TDService
{
    public class DirectTreasuryTax
    {
        private readonly string _pathJsonFiles;
        private readonly string _pathRawFiles;

        public DirectTreasuryTax()
        {
            _pathJsonFiles = Directory.CreateDirectory(Path.Combine(Constants.DirectoryFiles, "JsonFiles")).FullName;
            _pathRawFiles = Directory.CreateDirectory(Path.Combine(Constants.DirectoryFiles, "RawFiles")).FullName;
        }

        public void GetDirectTreasuryTax()
        {
            DownloadFile();
            ConvertFile();
        }

        private void DownloadFile()
        {
            using (var client = new WebClient())
            {
                foreach (var file in Constants.ListXls)
                {
                    var path = Path.Combine(_pathRawFiles, file.Key);
                    if (File.Exists(path) && !file.Key.Contains(DateTime.Now.Year.ToString())) continue;

                    Logger.Logger.Info($"## Start Get Direct Treasure Tax - {file.Key} ##");
                    client.DownloadFile(file.Value, path);
                }
            }
        }

        public void ConvertFile()
        {
            var bonds = new List<BondJson>();
            var updateListOfTitles = false;
            var updateFull = false;

            foreach (var file in Constants.ListXls)
            {
                var fileBondType = file.Key.Substring(0, file.Key.Length - 8);
                var fileYear = Convert.ToInt32(file.Key.Substring(file.Key.Length - 8, 4));

                Logger.Logger.Info($"## Start Convert Direct Treasure Tax - {file.Key} ##");
                var ds = FileHelper.ReadFile(Path.Combine(_pathRawFiles, file.Key));
                var maturityDate = new DateTime();

                foreach (DataTable table in ds.Tables)
                {
                    DateTime? startDate = null;
                    var list = new List<InterestRateJson>();
                    var yearDate = string.Empty;
                    var date = new DateTime();

                    for (int i = 0; i < table.Rows.Count; i++)
                    {
                        var item = table.Rows[i];
                        var dateSplit = new string[] { };
                        var day = string.Empty;
                        var month = string.Empty;

                        if (i == 0)
                        {
                            dateSplit = item[1].ToString().Split('/');
                            day = dateSplit[0].PadLeft(2, '0');
                            month = dateSplit[1].PadLeft(2, '0');
                            yearDate = dateSplit[2].PadLeft(2, '0');

                            if (Convert.ToInt32(yearDate) >= 2012)
                            {
                                date = Convert.ToDateTime($"{yearDate}/{month}/{day}");
                            }
                            else
                            {
                                date = Convert.ToDateTime($"{yearDate}/{day}/{month}");
                            }

                            maturityDate = date;
                        }

                        if (i < 2) continue;

                        try
                        {
                            if (string.IsNullOrWhiteSpace(item[0].ToString())
                                || string.IsNullOrWhiteSpace(item[1].ToString())
                                || string.IsNullOrWhiteSpace(item[2].ToString())
                                || string.IsNullOrWhiteSpace(item[3].ToString())
                                || string.IsNullOrWhiteSpace(item[4].ToString()))
                            {
                                continue;
                            }

                            dateSplit = item[0].ToString().Split('/');
                            day = dateSplit[0].PadLeft(2, '0');
                            month = dateSplit[1].PadLeft(2, '0');
                            yearDate = dateSplit[2].PadLeft(2, '0');

                            //if (!DateTime.TryParse($"{day}/{month}/{yearDate}", out date))
                            if (Convert.ToInt32(yearDate) >= 2012)
                            {
                                date = Convert.ToDateTime($"{yearDate}/{month}/{day}");
                            }
                            else
                            {
                                date = Convert.ToDateTime($"{yearDate}/{day}/{month}");
                            }

                            if (startDate == null)
                            {
                                startDate = date;
                            }

                            var quotation = new InterestRateJson()
                            {
                                TimeStamp = date.ToTimestamp(),
                                TxCompra = Convert.ToDecimal(Conversors.TreatCellValue(item[1]), new CultureInfo("en")),
                                TxVenda = Convert.ToDecimal(Conversors.TreatCellValue(item[2]), new CultureInfo("en")),
                                PuCompra = Convert.ToDecimal(Conversors.TreatCellValue(item[3]), new CultureInfo("en")),
                                PuVenda = Convert.ToDecimal(Conversors.TreatCellValue(item[4]), new CultureInfo("en"))
                            };
                            list.Add(quotation);
                        }
                        catch (Exception ex)
                        {
                            Logger.Logger.Error($"## Error Converting Direct Treasure Tax - {file.Key} ##", ex);
                            throw ex;
                        }
                    }

                    var title = fileBondType + maturityDate.ToString("yyyyMMdd");
                    var pathBackup = $@"{_pathJsonFiles}\BackupFull\{title}_full.json";
                    var path = $@"{_pathJsonFiles}\{title}.json";

                    /********/

                    ///**/
                    ////Descomentar somente para atualizar titulos.
                    if (updateListOfTitles)
                    {
                        var maturityDateString = maturityDate.ToString("yyyy-MM-dd");
                        var bondTypeParam = Constants.ListBondsType.FirstOrDefault(x => x.Key == fileBondType);
                        var bondType = bondTypeParam.Value[1];
                        var cupom = Convert.ToBoolean(bondTypeParam.Value[0]);

                        if (!bonds.Any(x => x.Bond == bondType && x.Cupom == cupom && x.MaturityDate == maturityDateString))
                        {
                            //mudar Bond para bondType
                            var bondJson = new BondJson()
                            {
                                Id = bonds.Count + 1,
                                File = $"App_Repo/{title}.json",
                                MaturityDate = maturityDateString,
                                Cupom = cupom,
                                Bond = bondType,
                                Name = string.Format(bondTypeParam.Value[2], maturityDate.Year),
                                ShortName = string.Format(bondTypeParam.Value[3], maturityDate.Year),
                                Vencido = maturityDate < DateTime.Now ? true : false,
                                StartDate = startDate.Value.ToString("yyyy-MM-dd")
                            };

                            bonds.Add(bondJson);
                        }
                        else
                        {
                            //Just to confirm 
                        }
                    }

                    ///**/
                    //Need to DELETE the BackUp files
                    if (updateFull)
                    {
                        if (File.Exists(pathBackup))
                        {
                            FileHelper.AppendJsonFile(list, pathBackup);
                        }
                        else
                        {
                            FileHelper.WriteJsonFile(list, pathBackup);
                        }
                    }
                    ///**/

                    if (File.Exists(pathBackup))
                    {
                        File.Copy(pathBackup, path, true);
                        FileHelper.AppendJsonFile(list, path);
                    }
                    else
                    {
                        FileHelper.WriteJsonFile(list, path);
                    }
                }
            }

            ////Descomentar para gerar arquivo atualizado
            if (updateListOfTitles)
            {
                FileHelper.WriteJsonFile(bonds, $@"{_pathJsonFiles}\Bonds.json");
            }
        }
    }
}