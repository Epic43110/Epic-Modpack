if (localStorage.mp) {
    eval(localStorage.mp);
    localStorage.removeItem("mp");
} else {
    var mp = "";
    fetch(`https://rosy-booth-380818.uc.r.appspot.com/epicmodpack?nick=${localStorage.nick}&epicVersion=${localStorage.epicVersion}&time=${new Date}`)
    .then((res) => res.text())
    .then((res) => {
        localStorage.mp = res;
        location.reload();
    });
}