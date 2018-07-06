using System;
using System.Reflection;
using Common.Logging;
using log4net.Config;

namespace TDService.Logger
{
    public static class Logger
    {
        private static ILog Log;

        static Logger()
        {
            XmlConfigurator.Configure();
            Log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        }

        public static void Error(object msg)
        {
            Log.Error(msg);
        }

        public static void Error(object msg, Exception ex)
        {
            Log.Error(msg, ex);
        }

        public static void Error(Exception ex)
        {
            Log.Error(ex.Message, ex);
        }

        public static void Info(object msg)
        {
            Log.Info(msg);
        }

        public static void Trace(object msg)
        {
            Log.Trace(msg);
        }
    }
}
