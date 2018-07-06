using Quartz;
using Quartz.Impl;
using System.Globalization;
using System.Threading;

namespace TDService
{
    class Program
    {
        static void Main(string[] args)
        {
            CultureInfo ci = new CultureInfo("pt-BR");
            Thread.CurrentThread.CurrentCulture = ci;
            IniciateQuartz();
        }

        private static void IniciateQuartz()
        {
            var sched = StdSchedulerFactory.GetDefaultScheduler();

            IJobDetail job = JobBuilder.Create<TituloJob>()
                .WithIdentity("CkeckTitulo")
                .Build();

            ITrigger trigger = TriggerBuilder.Create()
              .WithIdentity("tgrTitulo")
              .StartNow()
              .WithSimpleSchedule(x => x
                  .WithIntervalInHours(8)
                  .RepeatForever())
              .Build();

            sched.ScheduleJob(job, trigger);
            sched.Start();
        }
    }
}