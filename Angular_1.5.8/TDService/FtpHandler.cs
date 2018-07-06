using System.Configuration;
using System.IO;
using System.Net;
using System.Reflection;
using TDService.Common;

namespace TDService
{
    public static class FtpHandler
    {
        private static string _pathJsonFiles = string.Empty;

        public static void UpdateFiles()
        {
            _pathJsonFiles = Directory.CreateDirectory(Path.Combine(Constants.DirectoryFiles, "JsonFiles")).FullName;

            using (var client = new WebClient())
            {
                var files = Directory.GetFiles(_pathJsonFiles);

                foreach (var file in files)
                {
                    var fileName = Path.GetFileName(file);
                    Logger.Logger.Info($"## Start Upload FTP - {fileName} ##");
                    client.Credentials = new NetworkCredential(Constants.UserFtp, Constants.PasswordFtp);
                    client.UploadFile(Constants.FtpUrl + fileName, "STOR", file);
                }
            }
        }
    }
}