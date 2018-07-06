using Quartz;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TDService
{
    public class TituloJob : IJob
    {
        public TituloJob()
        {
        }

        public void Execute(IJobExecutionContext context)
        {
            CultureInfo ci = new CultureInfo("pt-BR");
            Thread.CurrentThread.CurrentCulture = ci;

            Console.WriteLine($"Job Initiated - {DateTime.Now.ToShortTimeString()}");
            Console.WriteLine("");

            var selic = new SelicTax();
            selic.GetSelicTargetTax();

            var directTreasuryBonds = new DirectTreasuryTax();
            directTreasuryBonds.GetDirectTreasuryTax();

            FtpHandler.UpdateFiles();

            Console.WriteLine("");
            Console.WriteLine($"Job Finished - {DateTime.Now.ToShortTimeString()}");
        }
    }
}