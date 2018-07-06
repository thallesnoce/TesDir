using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace TDService.Utilities
{
    public static class FileHelper
    {
        public static void WriteJsonFile<t>(List<t> listTyped, string path)
        {
            using (var ms = new MemoryStream())
            {
                var jsonSer = new DataContractJsonSerializer(typeof(List<t>));
                jsonSer.WriteObject(ms, listTyped);                
                byte[] json = ms.ToArray();
                File.WriteAllBytes(path, json);
            }
        }

        public static void AppendJsonFile<t>(List<t> listTyped, string path)
        {
            using (var ms = new MemoryStream())
            {
                var jsonSer = new DataContractJsonSerializer(typeof(List<t>));
                jsonSer.WriteObject(ms, listTyped);
                ms.Position = 0;
                string json = new StreamReader(ms).ReadToEnd();
                json = json.Substring(1);

                var histJson = File.ReadAllText(path);
                histJson = histJson.Substring(0, histJson.Length - 1);
                histJson = histJson.Replace("][", ",");
                histJson = histJson + ",";
                File.WriteAllText(path, histJson + json);
            }
        }

        public static DataSet ReadFile(string path)
        {
            //string connstring = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + path + ";Extended Properties='Excel 8.0;HDR=NO;IMEX=1';";
            string connstring = $"Provider=Microsoft.JET.OLEDB.4.0;Data Source='{path}';Extended Properties='Excel 8.0;HDR=NO;IMEX=1';";

            using (var conn = new OleDbConnection(connstring))
            {
                conn.Open();
                var sheetsName = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, new object[] { null, null, null, "Table" });

                var dataSet = new DataSet();
                foreach (DataRow row in sheetsName.Rows)
                {
                    try
                    {
                        string sheetName = row[2].ToString();
                        string sql = string.Format("SELECT * FROM [{0}]", sheetName);
                        var adapter = new OleDbDataAdapter(sql, connstring);
                        var dataTable = new DataTable();
                        dataTable.TableName = sheetName;
                        adapter.Fill(dataTable);
                        dataSet.Tables.Add(dataTable);
                    }
                    catch (Exception ex)
                    {
                        Logger.Logger.Error("Error in open excel sheet", ex);
                    }
                }

                return dataSet;
            }
        }
    }
}
