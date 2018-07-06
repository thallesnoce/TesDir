using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TDService.Utilities
{
    public static class Conversors
    {
        public static double ToTimestamp(this DateTime date)
        {
            return date.ToUniversalTime()
                   .Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc))
                   .TotalMilliseconds;
        }

        public static string TreatCellValue(object value)
        {
            return value.ToString().Replace("%", "");
        }
    }
}