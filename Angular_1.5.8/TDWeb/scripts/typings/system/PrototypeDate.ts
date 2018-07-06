interface Date {
    /** Return date with the format YearMonthDay */
    yyyymmdd(): string;

    /** Return date with the format DayMonthYear */
    ddmmyyyy(): string;
}

Date.prototype.yyyymmdd = function () {
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();

    return [this.getFullYear(), mm.length === 2 ? '' : '0', mm, dd.length === 2 ? '' : '0', dd].join(''); // padding
};

Date.prototype.ddmmyyyy = function () {
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();

    return [dd.length === 2 ? '' : '0', dd, mm.length === 2 ? '' : '0', mm, this.getFullYear()].join(''); // padding
};