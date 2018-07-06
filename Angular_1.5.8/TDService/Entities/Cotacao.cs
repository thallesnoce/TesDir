using System;

namespace TDService.Entities
{
    public class InterestRate
    {
        public decimal? TxCompra { get; set; }
        public decimal? TxVenda { get; set; }
        public decimal? PuCompra { get; set; }
        public decimal? PuVenda { get; set; }
        public DateTime UpdateTime { get; set; }
    }

    public class InterestRateJson
    {
        public double TimeStamp { get; set; }
        public decimal TxCompra { get; set; }
        public decimal TxVenda { get; set; }
        public decimal PuCompra { get; set; }
        public decimal PuVenda { get; set; }
        public decimal PuBase { get; set; }
    }

    public class SelicJson
    {
        public double Date { get; set; }
        public decimal Value { get; set; }
    }
}