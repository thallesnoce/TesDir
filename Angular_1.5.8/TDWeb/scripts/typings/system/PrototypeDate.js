Date.prototype.yyyymmdd = function () {
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return [this.getFullYear(), mm.length === 2 ? '' : '0', mm, dd.length === 2 ? '' : '0', dd].join(''); // padding
};
//# sourceMappingURL=PrototypeDate.js.map