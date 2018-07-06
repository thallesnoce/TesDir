using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TDService.Entities
{
    public class Titulo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Vencimento { get; set; }
        public List<InterestRate> Cotacao { get; set; }

        public Titulo()
        {
            Cotacao = new List<InterestRate>();
        }
    }

    public class BondJson
    {
        public int Id { get; set; }
        public string Bond { get; set; }
        public string MaturityDate { get; set; }
        public Boolean Cupom { get; set; }
        public Boolean Vencido { get; set; }
        public string File { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public string StartDate { get; set; }
        public Boolean IsPriceVisible { get; set; }
        public Boolean IsPriceAvaregeVisible { get; set; }
        public Boolean IsTaxVisible { get; set; }
        public Boolean IsTaxAvaregeVisible { get; set; }
    }
}