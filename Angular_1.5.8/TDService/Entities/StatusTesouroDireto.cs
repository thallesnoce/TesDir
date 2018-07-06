using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TDService.Entities
{
    public class StatusTesouroDireto
    {
        public int Id { get; set; }
        public bool IsMarketClosed { get; set; }
        public bool IsMarketSuspended { get; set; }
        public string MarketMessage { get; set; }
        public DateTime UpdateCheck { get; set; }
    }
}